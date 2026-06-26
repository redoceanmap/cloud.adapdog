// 시안 DCLogic 을 React 훅으로 포팅 — 앱 전체 상태 + 액션(대화/포커스/음성/테마/반응형).
// 실데이터 전용: 백엔드 /chat(실 AI) + /recommend + 코스 직접 편집(추가/제외/스왑).
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatRoute, recommendRoute, searchPlaces, swapStop } from '../api/endpoints';
import type { RoutePlanResponse, TripPlan as BackendPlan, PetPlace, Alternative, LodgingPlace } from '../api/types';

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

// 백엔드 _stop_kind 미러 — 업종 카테고리 → 스왑 종류(cafe/culture/outdoor).
function stopKindOf(category: string): string {
  const c = category || '';
  if (c.includes('카페')) return 'cafe';
  if (/박물관|미술관|전시|문화원|문예|공연|극장|전당|회관|과학관|유산/.test(c)) return 'culture';
  return 'outdoor';
}

// 발화에서 스왑 대상 종류를 추정(식당·맛집은 1차 범위 밖이라 제외).
function kindFromText(t: string): string | null {
  if (/숙소|숙박|게스트하우스|게하|호텔|펜션|민박|리조트|스테이|모텔/.test(t)) return 'lodging';
  if (/카페/.test(t)) return 'cafe';
  if (/박물관|미술관|전시/.test(t)) return 'culture';
  if (/공원|산책|둘레|호수|정원|수목|산림/.test(t)) return 'outdoor';
  return null;
}

// 스왑 의도 파싱 — 카테고리어 + (다른|말고|대신|바꿔)가 함께 있으면 그 자리의 다른 곳 추천 의도.
// kind가 lodging이면 숙소 후보(lodgingStops)에서, 그 외는 코스 정류장(courseStops)에서 대상을 찾는다.
// target = "X 말고"의 X가 매칭되면 그곳, 아니면 해당 kind의 첫 후보.
function parseSwapIntent(
  text: string, courseStops: CourseAddStop[], lodgingStops: CourseAddStop[] = [],
): { target: CourseAddStop; kind: string } | null {
  const t = text.trim();
  if (!/다른|말고|대신|바꿔|바꾸|교체/.test(t)) return null;
  const kind = kindFromText(t);
  if (!kind) return null;
  const pool = kind === 'lodging' ? lodgingStops : courseStops;
  const norm = (s: string) => s.replace(/\s+/g, '');
  let target: CourseAddStop | undefined;
  const m = t.match(/(.+?)\s*(?:말고|대신|은|는)/);
  if (m) {
    const nq = norm(m[1].replace(/[^가-힣a-zA-Z0-9 ]/g, '').trim());
    if (nq) target = pool.find((s) => { const nn = norm(s.name); return nn.includes(nq) || nq.includes(nn); });
  }
  if (!target) target = kind === 'lodging' ? pool[0] : pool.find((s) => stopKindOf(s.category) === kind);
  if (!target) return null;
  return { target, kind };
}

export interface CourseAddStop {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  day?: number;          // 여정 슬롯 보존용(스왑 교체 시 원래 자리 유지)
  time_slot?: string;    // morning/lunch/afternoon/dinner
  clock?: string;        // 기준 시각 "HH:MM"
  is_meal?: boolean;     // 식사 정류장 여부
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
  { role: 'ai', text: '안녕하세요! 🐾 전주 펫 동반 공공데이터로 체리(골든리트리버·대형견·더위 취약)에게 맞는 코스를 짜드려요. 어디로 갈지 말해줘요. 예) "전주로 갈거야"' },
];
const INITIAL_SUGGESTIONS = ['전주로 갈거야', 'KTX', '1박 할래요'];

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
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [emg, setEmg] = useState(false);
  const [emgStep, setEmgStep] = useState<EmgStep>('entry');
  // 실데이터 코스
  const [liveCourse, setLiveCourse] = useState<RoutePlanResponse | null>(null);
  // 코스 직접 편집(둘러보기/여정에서 추가·제외) — 실데이터 코스 위에 얹는 클라이언트 오버라이드.
  const [courseRemoved, setCourseRemoved] = useState<string[]>([]);
  const [courseAdded, setCourseAdded] = useState<CourseAddStop[]>([]);
  // 숙소 스왑 오버라이드 — 기존 숙소명 → 교체할 숙소(코스 lodging에 얹어 여정·지도에 반영).
  const [lodgingSwaps, setLodgingSwaps] = useState<Record<string, LodgingPlace>>({});
  const [livePlan, setLivePlan] = useState<BackendPlan | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const voiceOn = useRef(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // UI 표시용(voiceOn ref와 동기)
  const listeningRef = useRef(false);
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
  const lodgingSwapsRef = useRef<Record<string, LodgingPlace>>({});
  const placePoolRef = useRef<PetPlace[]>([]);
  // 진행 중 스왑 상태 — 대상 정류장·종류·다음 페이지 offset·현재 제시한 대안들('○○로 바꾸기' 칩 매칭용).
  const swapStateRef = useRef<{ target: CourseAddStop; kind: string; offset: number; alternatives: Alternative[] } | null>(null);
  useEffect(() => { liveCourseRef.current = liveCourse; }, [liveCourse]);
  useEffect(() => { courseAddedRef.current = courseAdded; }, [courseAdded]);
  useEffect(() => { courseRemovedRef.current = courseRemoved; }, [courseRemoved]);
  useEffect(() => { lodgingSwapsRef.current = lodgingSwaps; }, [lodgingSwaps]);
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

  // 숙소 교체 — 기존 숙소명(fromName) 자리에 새 숙소(to)를 얹는다(여정 취침·지도 도착핀에 반영).
  const addLodgingSwap = useCallback((fromName: string, to: LodgingPlace) => {
    setLodgingSwaps((m) => ({ ...m, [fromName]: to }));
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
          setLodgingSwaps({});
          swapStateRef.current = null;
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

  // 실데이터: 백엔드 /swap — 대상 정류장 자리의 같은 종류 다른 펫동반 후보를 거리순으로 받아 칩으로 제시.
  const swapSend = useCallback(
    async (target: CourseAddStop, kind: string, offset = 0) => {
      if (liveLoadingRef.current) return;
      liveLoadingRef.current = true;
      setLiveLoading(true);
      setInput('');
      setSuggestions([]);
      try {
        // 숙소 스왑은 대상 숙소만 제외(백엔드가 대상명을 제외하므로 빈 목록 → 나머지 펫동반 숙소가 대안).
        // 코스 정류장 스왑은 현재 코스 전체를 제외(중복 방지).
        const exclude = kind === 'lodging'
          ? []
          : [
              ...(liveCourseRef.current?.stops.map((s) => s.name) ?? []),
              ...courseAddedRef.current.map((s) => s.name),
            ].filter((n) => !courseRemovedRef.current.includes(n));
        const res = await swapStop({
          stop_name: target.name, stop_category: target.category,
          stop_lat: target.latitude, stop_lng: target.longitude,
          kind, exclude_names: exclude, offset,
          pet_size: 'large', pet_breed: '골든 리트리버', pet_traits: '대형견, 활동 활발, 사회성 좋음, 체질 더위 취약',
        });
        swapStateRef.current = { target, kind, offset: res.next_offset, alternatives: res.alternatives };
        pushAi(res.reply); speak(res.reply);
        const chips = [
          ...res.alternatives.map((a) => `${a.name}로 바꾸기`),
          ...(res.has_more ? ['더 멀리 추천'] : []),
        ];
        setSuggestions(chips);
      } catch {
        pushAi('대안을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        liveLoadingRef.current = false;
        setLiveLoading(false);
      }
    },
    [pushAi, speak],
  );

  const handleUserText = useCallback(
    (raw: string) => {
      const t = String(raw || '').trim();
      if (!t) return;
      // 코스가 이미 있으면 자연어 추가/제외를 클라이언트 편집으로 처리(백엔드 재생성·초기화 방지).
      const course = liveCourseRef.current;
      if (course) {
        const stops: CourseAddStop[] = [
          ...course.stops.map((s) => ({
            name: s.name, category: s.category, latitude: s.latitude, longitude: s.longitude,
            day: s.day, time_slot: s.time_slot, clock: s.clock, is_meal: s.is_meal,
          })),
          ...courseAddedRef.current,
        ].filter((s) => !courseRemovedRef.current.includes(s.name));
        // 숙소 후보(적용된 교체 반영) — 숙소 스왑 대상 매칭/추천용.
        const lodgingStops: CourseAddStop[] = (course.lodging ?? []).map((l) => {
          const sw = lodgingSwapsRef.current[l.name];
          const cur = sw ?? l;
          return { name: cur.name, category: cur.category, latitude: cur.latitude, longitude: cur.longitude };
        });

        // 0) 진행 중 스왑 — 대안 칩 선택('○○로 바꾸기') → 교체 적용, '더 멀리 추천' → 다음 페이지.
        const sw = swapStateRef.current;
        if (sw) {
          const pick = sw.alternatives.find((a) => t === `${a.name}로 바꾸기` || t === `${a.name}으로 바꾸기`);
          if (pick) {
            setInput(''); setSuggestions([]);
            setMessages((m) => [...m, { role: 'user', text: t }]);
            if (sw.kind === 'lodging') {
              // 숙소 교체 — lodging 오버라이드(여정 취침·지도 도착핀이 새 숙소로 바뀐다).
              addLodgingSwap(sw.target.name, {
                name: pick.name, category: pick.category, latitude: pick.latitude, longitude: pick.longitude,
                source: '한국관광공사 반려동물 동반여행',
              });
            } else {
              removeCourseStop(sw.target.name);
              addCourseStop({
                name: pick.name, category: pick.category, latitude: pick.latitude, longitude: pick.longitude,
                day: sw.target.day, time_slot: sw.target.time_slot, clock: sw.target.clock, is_meal: false,
              });
            }
            const reply = `${sw.target.name} 대신 ${pick.name}로 바꿨어요. 여정에 반영했어요.`;
            pushAi(reply); speak(reply);
            swapStateRef.current = null;
            return;
          }
          if (t === '더 멀리 추천') {
            setMessages((m) => [...m, { role: 'user', text: t }]);
            swapSend(sw.target, sw.kind, sw.offset);
            return;
          }
        }

        // 1) 새 스왑 의도("○○ 카페 말고 다른 카페" / "○○ 숙소 말고 다른 숙소") → 그 자리의 같은 종류 대안 제시.
        const swap = parseSwapIntent(t, stops, lodgingStops);
        if (swap) {
          setMessages((m) => [...m, { role: 'user', text: t }]);
          swapSend(swap.target, swap.kind, 0);
          return;
        }

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
    },
    [speak, liveSend, recommendSend, swapSend, addCourseStop, removeCourseStop, addLodgingSwap, pushAi],
  );

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
    livePlanRef.current = null;
    swapStateRef.current = null;
    setLivePlan(null);
    setLiveCourse(null);
    setCourseRemoved([]);
    setCourseAdded([]);
    setLodgingSwaps({});
    setMessages(INITIAL_MESSAGES);
    setSuggestions(INITIAL_SUGGESTIONS);
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
    messages, suggestions,
    emg, setEmg, emgStep, setEmgStep,
    liveCourse, livePlan, liveLoading,
    courseRemoved, courseAdded, lodgingSwaps, addCourseStop, removeCourseStop, pushAi,
    handleUserText, startVoice, resetChat,
    voiceEnabled, toggleVoice,
  };
}
