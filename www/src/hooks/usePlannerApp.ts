// 시안 DCLogic 을 React 훅으로 포팅 — 앱 전체 상태 + 액션(대화/포커스/음성/테마/반응형).
// dataMode: 'demo'(큐레이션 reducePlan) ⇄ 'live'(백엔드 /chat 실 AI·실데이터).
import { useCallback, useEffect, useRef, useState } from 'react';
import { reducePlan, INITIAL_PLAN, type TripPlan } from '../lib/places';
import { chatRoute } from '../api/endpoints';
import type { RoutePlanResponse, TripPlan as BackendPlan } from '../api/types';

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
  const [focusPlace, setFocusPlace] = useState('cafe');
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
  const [livePlan, setLivePlan] = useState<BackendPlan | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const voiceOn = useRef(true);
  const listeningRef = useRef(false);
  const modeRef = useRef<'demo' | 'live'>('demo');
  const liveLoadingRef = useRef(false);
  const livePlanRef = useRef<BackendPlan | null>(null);
  const messagesRef = useRef<Msg[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

  const pushAi = useCallback((text: string) => {
    setMessages((m) => [...m, { role: 'ai', text }]);
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
        if (res.course) setLiveCourse(res.course);
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

  const handleUserText = useCallback(
    (raw: string) => {
      const t = String(raw || '').trim();
      if (!t) return;
      if (modeRef.current === 'live') {
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
    [plan, speak, liveSend],
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
      setMessages([{ role: 'ai', text: '실데이터 모드예요 🛰️ 전주 펫 동반 공공데이터로 코스를 짜드려요. 어디로 갈지 말해줘요. 예) "전주로 갈거야"' }]);
      setSuggestions(['전주로 갈거야', 'KTX', '1박 할래요']);
    } else {
      setMessages(INITIAL_MESSAGES);
      setSuggestions(['축제 넣어줘', '맛집 추가', '자차로 바꿔', '여행 시작']);
      setPlan(INITIAL_PLAN);
      setFocusPlace('cafe');
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
    handleUserText, startVoice, resetChat,
  };
}
