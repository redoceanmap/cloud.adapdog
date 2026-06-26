// 시안 DCLogic 을 React 훅으로 포팅 — 앱 전체 상태 + 액션(대화/포커스/음성/테마/반응형).
// dataMode: 'demo'(큐레이션 reducePlan) ⇄ 'live'(백엔드 /chat 실 AI·실데이터).
import { useCallback, useEffect, useRef, useState } from 'react';
import { reducePlan, INITIAL_PLAN, type TripPlan } from '../lib/places';
import { chatRoute, recommendRoute, searchPlaces } from '../api/endpoints';
import type { RoutePlanResponse, TripPlan as BackendPlan, PetPlace } from '../api/types';

// 채팅 자연어에서 코스 편집 의도(추가/제외)를 파싱. 매치되면 백엔드 재생성 없이 클라이언트 편집.
function parseCourseEdit(
  text: string, courseNames: string[], pool: PetPlace[],
): { action: 'add'; place: PetPlace } | { action: 'remove'; name: string } | null {
  const t = text.trim();
  const clean = (s: string) => s.replace(/[을를은는이가,.\s]+$/g, '').replace(/^(그|이|저)\s+/, '').trim();
  const norm = (s: string) => s.replace(/\s+/g, ''); // 공백 무시 매칭("전북대학교 박물관" ↔ "전북대학교박물관")
  const rm = t.match(/(.+?)\s*(?:은|는|을|를|이|가)?\s*(?:빼|제외|삭제|지워|제거|빼줘|빼주)/);
  if (rm) {
    const nq = norm(clean(rm[1]));
    const hit = nq ? courseNames.find((n) => { const nn = norm(n); return nn.includes(nq) || nq.includes(nn); }) : undefined;
    if (hit) return { action: 'remove', name: hit };
  }
  let addQuery: string | null = null;
  const adPrefix = t.match(/^추가\s*(.+)/);
  if (adPrefix) addQuery = adPrefix[1];
  else {
    const ad = t.match(/(.+?)\s*(?:을|를|은|는|이|가)?\s*(?:추가|넣어|담아|담을|넣을|넣어줘|추가해)/);
    if (ad) addQuery = ad[1];
  }
  if (addQuery) {
    const nq = norm(clean(addQuery));
    const hit = nq ? pool.find((p) => { const nn = norm(p.name); return nn.includes(nq) || nq.includes(nn); }) : undefined;
    if (hit) return { action: 'add', place: hit };
  }
  return null;
}

// 추천 의도 — "다른 걸로", "카페 추천", "너무 힘들 것 같아" 등 대안을 원하는 발화.
const RECOMMEND_INTENT = /추천|다른|대신|뭐가|좋을|힘들|지치|지칠|쉬어|쉴|어때|골라|바꿔줘|말고/;

export interface CourseAddStop {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

export type View = 'planner' | 'explore' | 'itinerary' | 'dog';
export type DetailTab = 'overview' | 'policy' | 'location' | 'review';
export type MobilePanel = 'chat' | 'detail' | 'map';
export type EmgStep = 'entry' | 'result' | 'list';

export interface Msg {
  role: 'user' | 'ai';
  text: string;
  doc?: boolean;
}

const INITIAL_MESSAGES: Msg[] = [
  { role: 'user', text: '체리랑 전주 1박 여행 코스 짜줘 🐶' },
  { role: 'ai', text: '좋아요! 골든리트리버 체리(대형견·더위 취약)에게 맞춰 전주 1박 펫 동반 코스를 짰어요. 입장 가능 여부·그늘·이동약자 배려까지 확인했고, KTX로 전주역까지 직행이에요. 오른쪽 지도에서 장소를 눌러 자세히 볼 수 있어요.', doc: true },
  { role: 'ai', text: '더 넣거나 빼고 싶은 곳이 있으면 말해줘요. 예) "축제 넣어줘", "오목대 빼줘", "자차로 바꿔"' },
];

export function usePlannerApp() {
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 900);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('chat');
  const [view, setView] = useState<View>('planner');
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [focusPlace, setFocusPlace] = useState('village');
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [suggestions, setSuggestions] = useState<string[]>(['축제 넣어줘', '맛집 추가', '자차로 바꿔', '여행 시작']);
  const [plan, setPlan] = useState<TripPlan>(INITIAL_PLAN);
  const [emg, setEmg] = useState(false);
  const [emgStep, setEmgStep] = useState<EmgStep>('entry');
  // 실데이터 모드
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [liveCourse, setLiveCourse] = useState<RoutePlanResponse | null>(null);
  // 코스 직접 편집(둘러보기/여정에서 추가·제외) — 실데이터 코스 위에 얹는 클라이언트 오버라이드.
  const [courseRemoved, setCourseRemoved] = useState<string[]>([]);
  const [courseAdded, setCourseAdded] = useState<CourseAddStop[]>([]);
  const [livePlan, setLivePlan] = useState<BackendPlan | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const voiceOn = useRef(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // UI 표시용(voiceOn ref와 동기)
  const listeningRef = useRef(false);
  const modeRef = useRef<'demo' | 'live'>('demo');
  const liveLoadingRef = useRef(false);
  const livePlanRef = useRef<BackendPlan | null>(null);
  const messagesRef = useRef<Msg[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 채팅 자연어 편집용 — 현재 코스/편집/전주 펫시설 풀을 ref로 유지(handleUserText 동기 접근).
  const [placePool, setPlacePool] = useState<PetPlace[]>([]);
  const liveCourseRef = useRef<RoutePlanResponse | null>(null);
  const courseAddedRef = useRef<CourseAddStop[]>([]);
  const courseRemovedRef = useRef<string[]>([]);
  const placePoolRef = useRef<PetPlace[]>([]);
  useEffect(() => { liveCourseRef.current = liveCourse; }, [liveCourse]);
  useEffect(() => { courseAddedRef.current = courseAdded; }, [courseAdded]);
  useEffect(() => { courseRemovedRef.current = courseRemoved; }, [courseRemoved]);
  useEffect(() => { placePoolRef.current = placePool; }, [placePool]);
  useEffect(() => { searchPlaces('전주').then(setPlacePool).catch(() => setPlacePool([])); }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceOn.current) return;
    try {
      const s = window.speechSynthesis;
      if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/[^가-힣a-zA-Z0-9 .,!?~·]/g, ''));
      u.lang = 'ko-KR';
      u.pitch = 1.5;
      u.rate = 1.05;
      const kv = (s.getVoices() || []).find((v) => v.lang && v.lang.toLowerCase().indexOf('ko') === 0);
      if (kv) u.voice = kv;
      s.speak(u);
    } catch {
      /* noop */
    }
  }, []);

  // 음성(TTS) on/off — 브라우저 내장 Web Speech API(무료). 끄면 즉시 발화 중단.
  const toggleVoice = useCallback(() => {
    const next = !voiceOn.current;
    voiceOn.current = next;
    setVoiceEnabled(next);
    if (!next) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    }
  }, []);

  const pushAi = useCallback((text: string) => {
    setMessages((m) => [...m, { role: 'ai', text }]);
  }, []);

  // 코스에 직접 추가(둘러보기/여정) — 같은 이름이면 무시, 제외 목록에 있으면 해제.
  const addCourseStop = useCallback((p: CourseAddStop) => {
    setCourseRemoved((r) => r.filter((n) => n !== p.name));
    setCourseAdded((a) => (a.some((x) => x.name === p.name) ? a : [...a, p]));
  }, []);

  // 코스에서 제외 — 추가했던 곳이면 추가 목록에서 빼고, 원본 정류장이면 제외 목록에 넣는다.
  const removeCourseStop = useCallback((name: string) => {
    setCourseAdded((a) => a.filter((x) => x.name !== name));
    setCourseRemoved((r) => (r.includes(name) ? r : [...r, name]));
  }, []);

  // 실데이터: 백엔드 /chat 핑퐁(누적 BackendPlan 왕복).
  const liveSend = useCallback(
    async (t: string) => {
      if (liveLoadingRef.current) return;
      liveLoadingRef.current = true;
      setLiveLoading(true);
      setInput('');
      setSuggestions([]);
      const hist: Msg[] = [...messagesRef.current, { role: 'user', text: t }];
      messagesRef.current = hist;
      setMessages(hist);
      try {
        const res = await chatRoute(
          hist.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
          'large', '골든 리트리버', '대형견, 활동 활발, 사회성 좋음, 체질 더위 취약',
          livePlanRef.current,
        );
        const next: Msg[] = [...hist, { role: 'ai', text: res.reply, doc: !!res.course }];
        messagesRef.current = next;
        setMessages(next);
        livePlanRef.current = res.plan;
        setLivePlan(res.plan);
        setSuggestions(res.suggestions || []);
        if (res.course) {
          setLiveCourse(res.course);
          setCourseRemoved([]); // 새 코스가 생성되면 직접 편집 초기화
          setCourseAdded([]);
        }
        setDetailTab('overview');
        speak(res.reply);
      } catch {
        setMessages([...hist, { role: 'ai', text: '백엔드(:8000) 연결에 문제가 생겼어요. 서버를 확인해 주세요.' }]);
      } finally {
        liveLoadingRef.current = false;
        setLiveLoading(false);
      }
    },
    [speak],
  );

  // 실데이터: 백엔드 /recommend — 현재 코스를 분석해 대안을 '○○ 추가' 칩으로 제시(코스 재생성 X).
  const recommendSend = useCallback(
    async (t: string, courseStops: CourseAddStop[]) => {
      if (liveLoadingRef.current) return;
      liveLoadingRef.current = true;
      setLiveLoading(true);
      setInput('');
      setSuggestions([]);
      const hist: Msg[] = [...messagesRef.current, { role: 'user', text: t }];
      messagesRef.current = hist;
      setMessages(hist);
      try {
        const res = await recommendRoute(
          hist.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
          courseStops,
          'large', '골든 리트리버', '대형견, 활동 활발, 사회성 좋음, 체질 더위 취약',
          livePlanRef.current,
        );
        const next: Msg[] = [...hist, { role: 'ai', text: res.reply }];
        messagesRef.current = next;
        setMessages(next);
        setSuggestions(res.suggestions || []); // "○○ 추가" 칩 — 탭하면 클라가 코스에 더한다
        speak(res.reply);
      } catch {
        setMessages([...hist, { role: 'ai', text: '추천을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }]);
      } finally {
        liveLoadingRef.current = false;
        setLiveLoading(false);
      }
    },
    [speak],
  );

  const handleUserText = useCallback(
    (raw: string) => {
      const t = String(raw || '').trim();
      if (!t) return;
      if (modeRef.current === 'live') {
        // 코스가 이미 있으면 자연어 추가/제외를 클라이언트 편집으로 처리(백엔드 재생성·초기화 방지).
        const course = liveCourseRef.current;
        if (course) {
          const stops: CourseAddStop[] = [
            ...course.stops.map((s) => ({ name: s.name, category: s.category, latitude: s.latitude, longitude: s.longitude })),
            ...courseAddedRef.current,
          ].filter((s) => !courseRemovedRef.current.includes(s.name));
          const names = stops.map((s) => s.name);
          const edit = parseCourseEdit(t, names, placePoolRef.current);
          const wantsRec = RECOMMEND_INTENT.test(t);
          // 단순 편집(추천 의도 없음) → 즉시 클라 편집.
          if (edit && !wantsRec) {
            setInput('');
            setSuggestions([]);
            setMessages((m) => [...m, { role: 'user', text: t }]);
            if (edit.action === 'add') {
              addCourseStop({ name: edit.place.name, category: edit.place.category, latitude: edit.place.latitude, longitude: edit.place.longitude });
              const reply = `${edit.place.name}을(를) 코스에 추가했어요. 여정에서 확인해보세요.`;
              pushAi(reply); speak(reply);
            } else {
              removeCourseStop(edit.name);
              const reply = `${edit.name}을(를) 코스에서 뺐어요.`;
              pushAi(reply); speak(reply);
            }
            return;
          }
          // 추천 의도 → 명시적 "제외"가 같이 있으면 먼저 빼고, 그 코스를 분석해 추천(재생성 X).
          if (wantsRec) {
            let analyzed = stops;
            if (edit && edit.action === 'remove') {
              removeCourseStop(edit.name);
              analyzed = stops.filter((s) => s.name !== edit.name);
            }
            recommendSend(t, analyzed);
            return;
          }
        }
        liveSend(t);
        return;
      }
      const { plan: next, reply, sugg, focus } = reducePlan(plan, t);
      setMessages((m) => [...m, { role: 'user', text: t }, { role: 'ai', text: reply }]);
      setPlan(next);
      setSuggestions(sugg);
      setInput('');
      setDetailTab('overview');
      if (focus) setFocusPlace(focus);
      speak(reply);
    },
    [plan, speak, liveSend, recommendSend, addCourseStop, removeCourseStop, pushAi],
  );

  // 데모 ⇄ 실데이터 토글 — 채팅 초기화.
  const toggleMode = useCallback(() => {
    const next = modeRef.current === 'demo' ? 'live' : 'demo';
    modeRef.current = next;
    setDataMode(next);
    setInput('');
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    if (next === 'live') {
      livePlanRef.current = null;
      setLivePlan(null);
      setLiveCourse(null);
      setCourseRemoved([]);
      setCourseAdded([]);
      setMessages([{ role: 'ai', text: '실데이터 모드예요 🛰️ 전주 펫 동반 공공데이터로 코스를 짜드려요. 어디로 갈지 말해줘요. 예) "전주로 갈거야"' }]);
      setSuggestions(['전주로 갈거야', 'KTX', '1박 할래요']);
    } else {
      setMessages(INITIAL_MESSAGES);
      setSuggestions(['축제 넣어줘', '맛집 추가', '자차로 바꿔', '여행 시작']);
      setPlan(INITIAL_PLAN);
      setFocusPlace('village');
    }
  }, []);

  const startVoice = useCallback(() => {
    if (listeningRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      pushAi('이 브라우저는 음성 인식을 지원하지 않아요. 텍스트로 입력해줘요!');
      return;
    }
    try {
      const rec = new SR();
      rec.lang = 'ko-KR';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      listeningRef.current = true;
      setListening(true);
      rec.onresult = (e: any) => {
        const tr = e.results[0][0].transcript;
        listeningRef.current = false;
        setListening(false);
        handleUserText(tr);
      };
      rec.onerror = () => {
        listeningRef.current = false;
        setListening(false);
      };
      rec.onend = () => {
        listeningRef.current = false;
        setListening(false);
      };
      rec.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
    }
  }, [handleUserText, pushAi]);

  const setFocus = useCallback((key: string) => {
    setFocusPlace(key);
    setDetailTab('overview');
    setMobilePanel('detail');
  }, []);

  const resetChat = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    setInput('');
    if (modeRef.current === 'live') {
      livePlanRef.current = null;
      setLivePlan(null);
      setLiveCourse(null);
      setCourseRemoved([]);
      setCourseAdded([]);
      setMessages([{ role: 'ai', text: '실데이터 모드예요 🛰️ 어디로 갈지 말해줘요. 예) "전주로 갈거야"' }]);
      setSuggestions(['전주로 갈거야', 'KTX', '1박 할래요']);
      return;
    }
    setMessages([{ role: 'ai', text: '안녕하세요! 🐾 체리와 어디로 떠날까요? 지역과 이동수단을 말해주면 펫 동반 코스를 짜드려요.' }]);
    setSuggestions(['전주 갈래', 'KTX로', '당일치기']);
    setPlan({ destination: null, transport: null, lodging: null, stopovers: [], itinerary: [], status: 'DRAFTING' });
  }, []);

  const go = useCallback((v: View) => {
    setView(v);
    setMobilePanel('chat');
  }, []);

  return {
    dark, setDark,
    isMobile, mobilePanel, setMobilePanel,
    view, go, setView,
    detailTab, setDetailTab,
    focusPlace, setFocus,
    input, setInput,
    listening,
    messages, suggestions, plan,
    emg, setEmg, emgStep, setEmgStep,
    dataMode, toggleMode, liveCourse, livePlan, liveLoading,
    courseRemoved, courseAdded, addCourseStop, removeCourseStop, pushAi,
    handleUserText, startVoice, resetChat,
    voiceEnabled, toggleVoice,
  };
}
