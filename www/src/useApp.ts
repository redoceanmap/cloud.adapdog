// @ts-nocheck
// 통합 프로토타입(발자국 앱 (통합).html)의 상태머신(DCLogic Component)을 React 훅으로 이식.
// 원본 renderVals() 본문을 보존하되 this.state→s, this.setState→setState 로 치환.
import { useEffect, useState } from 'react';
import { checkHealth } from './api/client';
import {
  chatRoute,
  checkEntry,
  checkSafety,
  cohortRecommendation,
  getAudioGuides,
  getBreedPredictions,
  getCareReminders,
  getCommunityPosts,
  getDecorationTemplates,
  getFestivals,
  getPersona,
  getPetStamps,
  getReservations,
  getStamps,
  getSymptomChecks,
  getTrails,
  getVlogs,
  getYearSummary,
  parsePolicy,
  previewBreed,
  searchInclusive,
} from './api/endpoints';

/** 무장애 요소 코드 → 한글 라벨. */
const ACCESS_LABELS: Record<string, string> = {
  wheelchair: '휠체어', parking: '전용주차', braille: '점자', restroom: '장애인화장실',
};

/** 배지 시스템 데모용 — 전주 펫카페 입장 규정 샘플(AI 파싱 입력). */
const SAMPLE_POLICY_TEXT =
  '소형견은 안고 입장 가능, 이동장(케이지) 지참 권장. 실내 동반 가능하나 목줄 필수. 반려동물 음료 1잔 주문 필요.';

/** 데모는 체리(pet_id=1) 고정 시나리오. */
const DEMO_PET_ID = 1;

export function useApp() {
  const [s, setS] = useState<any>({
    phase: 'login', personaView: 'mascot', memory: null, recapSlide: 0,
    figureStep: 'photo', sub: null, festView: 'cal', screen: 'planner',
    plannerView: 'list', exploreView: 'list', dogView: 'wallet', emg: false,
  });
  const setState = (patch: any) =>
    setS((prev: any) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));

  // 백엔드(:8000) 연결 상태 확인 — 데모는 체리(전주·골든리트리버) 고정.
  useEffect(() => {
    checkHealth().then((ok) => setState({ backendOk: ok }));
  }, []);

  const ACT = '#3B5BFE', OFF = '#C7CAD0';
  const go = (screen) => () => setState({ screen, emg: false });
  const tabActive = (...names) => (names.includes(s.screen) ? ACT : OFF);
  const pill = (on) => (on ? { bg: '#fff', tx: '#1A1A1D' } : { bg: 'transparent', tx: '#8A8F98' });
  const seg = (on) => (on ? { bg: '#fff', tx: '#3B5BFE' } : { bg: 'transparent', tx: '#8A8F98' });

  const pl = pill(s.plannerView === 'list'), pm = pill(s.plannerView === 'map');
  const el = pill(s.exploreView === 'list'), em = pill(s.exploreView === 'map');
  const wv = seg(s.dogView === 'wallet'), dv = seg(s.dogView === 'dressup');

  // ── E3 둘레길 구간 — 경로정보("A→B→C")를 구간 스텝으로 분할, 앞 5곳 + 더보기 ──
  const TRAIL_STOP_LIMIT = 5;
  const _trailRoute = (s.trails?.[0]?.route_info) || '';
  const _trailParts = _trailRoute.split(/[→>]/).map((x) => x.trim()).filter(Boolean);
  const _trailStops = (_trailParts.length ? _trailParts : ['한옥마을 입구', '자만벽화마을', '오목대 전망']).map(
    (name, i, arr) => ({
      name, $index: i,
      sub: i === 0 ? '출발' : i === arr.length - 1 ? '도착' : '경유',
      last: i === arr.length - 1,
    }),
  );
  const _trailExpanded = !!s.trailExpanded;

  return {
    // screens
    isPlanner: s.screen === 'planner',
    isFacility: s.screen === 'facility',
    isTrip: s.screen === 'trip',
    isExplore: s.screen === 'explore',
    isCommunity: s.screen === 'community',
    isDog: s.screen === 'dog',
    emgOpen: s.emg,

    // nav handlers
    goPlanner: go('planner'),
    goExplore: go('explore'),
    goCommunity: () => {
      setState({ screen: 'community', emg: false });
      getCommunityPosts().then((communityPosts) => setState({ communityPosts })).catch(() => {});
    },
    goDog: go('dog'),
    // ── H 커뮤니티 (community-post) — 코스 후기 피드 ──
    communityPosts: s.communityPosts || [],
    openFacility: go('facility'),
    openTrip: go('trip'),
    // ── C3 시설 상세 + C5 입장 판정 연동 ──
    selectFacility: (stop: any) => {
      setState({
        screen: 'facility', emg: false, selectedStop: stop,
        verdict: null, verdictLoading: true, verdictError: null,
      });
      checkEntry({ region: '전주', place_name: stop.name, pet_name: '체리', pet_size: 'large' })
        .then((verdict) => setState({ verdict, verdictLoading: false }))
        .catch((err) => setState({ verdictLoading: false, verdictError: String(err) }));
    },
    facilityName: s.selectedStop?.name || '한옥마을 펫카페',
    facilityDesc: s.selectedStop ? `${s.selectedStop.category} · 전주` : '반려동물 동반 카페 · 전주 한옥마을',
    verdictLoading: !!s.verdictLoading,
    verdictLabel: s.verdict ? { allowed: '가능', conditional: '조건부 가능', denied: '불가' }[s.verdict.verdict] : '',
    verdictMessage: s.verdict?.message || '체리 기준 입장 정보를 확인하는 중이에요.',
    verdictConditions: s.verdict?.conditions?.join(' · ') || '',
    openEmg: () => {
      setState({ emg: true, emgStep: 'entry' });
      getSymptomChecks(DEMO_PET_ID).then((symptomChecks) => setState({ symptomChecks })).catch(() => {});
      checkSafety({ region: '전주', pet_breed: '골든 리트리버', pet_size: 'large' })
        .then((safety) => setState({ safety }))
        .catch(() => {});
    },
    // ── D 안전·위험 알리미 (safety-alert) ──
    safetyNearestHospital: s.safety?.nearest_hospital || '',
    safetyHospitalCount: s.safety?.hospital_count ?? 0,
    safetyRiskLevel: s.safety?.risk_level || '',
    safetyReason: s.safety?.reasons?.[0] || '',
    hasSafety: !!s.safety,
    closeEmg: () => setState({ emg: false }),
    emgGo: (step) => () => setState({ emgStep: step }),
    emgToAttach: () => setState({ emgStep: 'attach' }),
    emgToAnalyzing: () => setState({ emgStep: 'analyzing' }),
    emgToResult: () => setState({ emgStep: 'result' }),
    emgToList: () => setState({ emgStep: 'list' }),
    emgToDetail: () => setState({ emgStep: 'detail' }),
    emgBackEntry: () => setState({ emgStep: 'entry' }),
    emgBackAttach: () => setState({ emgStep: 'attach' }),
    emgBackResult: () => setState({ emgStep: 'result' }),
    emgBackList: () => setState({ emgStep: 'list' }),
    emgIsEntry: (s.emgStep || 'entry') === 'entry',
    emgIsAttach: s.emgStep === 'attach',
    emgIsAnalyzing: s.emgStep === 'analyzing',
    emgIsResult: s.emgStep === 'result',
    emgIsList: s.emgStep === 'list',
    emgIsDetail: s.emgStep === 'detail',

    // planner toggle
    isPlannerPrompt: (s.plannerMode || 'prompt') === 'prompt',
    isPlannerResults: s.plannerMode === 'results',
    editPrompt: () => setState({ plannerMode: 'prompt' }),

    // ── 대화형 플래너 (route-planner/chat, Gemini 연동) ──
    chatMessages: s.chatMessages || [],
    chatInput: s.chatInput || '',
    chatLoading: !!s.chatLoading,
    isPlannerChatEmpty: !(s.chatMessages && s.chatMessages.length),
    setChatInput: (val) => setState({ chatInput: val }),
    sendChat: (text) => {
      const content = (typeof text === 'string' ? text : s.chatInput || '').trim();
      if (!content || s.chatLoading) return;
      const history = [...(s.chatMessages || []), { role: 'user', content }];
      setState({ chatMessages: history, chatInput: '', chatLoading: true });
      chatRoute(
        history.map((m) => ({ role: m.role, content: m.content })),
        'large',
        '골든 리트리버',
      )
        .then((res) =>
          setState((prev) => ({
            chatLoading: false,
            chatMessages: [
              ...prev.chatMessages,
              { role: 'assistant', content: res.reply, course: res.course },
            ],
          })),
        )
        .catch((err) =>
          setState((prev) => ({
            chatLoading: false,
            chatMessages: [
              ...prev.chatMessages,
              { role: 'assistant', content: '연결에 문제가 생겼어요. 백엔드(:8000)를 확인해 주세요.' },
            ],
            chatError: String(err),
          })),
        );
    },
    /** 채팅에서 확정된 코스를 기존 결과/지도 화면으로 보낸다. */
    viewCourse: (course) => setState({ plan: course, plannerMode: 'results', plannerView: 'list' }),
    // ── 꾸미기 버전 선택 (기본=골든리트리버, 카드마다 다른 버전) ──
    decoSel: s.decoSel || 'base',
    selectDeco: (key) => () => setState({ decoSel: key }),
    decoImage: ({ base: '/pet-breed.png', pink: '/deco-pink-cut.png', navy: '/deco-navy-cut.png', photobook: '/deco-photobook.jpg', figure: '/deco-figure.jpg' })[s.decoSel || 'base'],
    decoCaption: ({ base: '체리, 골든 리트리버', pink: '체리, 전주 한옥마을에서 분홍 저고리', navy: '체리, 남색 도포 한복', photobook: '체리, 우리 강아지 포토북', figure: '체리, 3D 피규어' })[s.decoSel || 'base'],
    // 옷 입은 강아지(누끼)는 3D 형태로 띄워 드래그 회전, 포토북·피규어는 사진 그대로.
    decoIs3d: ['base', 'pink', 'navy'].includes(s.decoSel || 'base'),
    // ── 특징 편집 칩 (단일 선택) ──
    taActivity: s.traitActivity || '활동량 많음',
    taSocial: s.traitSocial || '사람 좋아함',
    taBody: s.traitBody || '더위 취약',
    setTrait: (key, val) => () => setState({ [key]: val }),
    /** 채팅 헤더 뒤로가기 — 대화 중이면 대화를 비워 시작 화면으로, 빈 상태면 내 강아지 탭으로. */
    backChat: () =>
      setState((prev) =>
        prev.chatMessages && prev.chatMessages.length
          ? { chatMessages: [], chatInput: '', chatLoading: false }
          : { screen: 'dog', emg: false },
      ),
    // ── 플래너 API 연동(Phase 1) ──
    backendOk: s.backendOk,
    planLoading: !!s.planLoading,
    planError: s.planError || null,
    planSummary: s.plan?.summary || '',
    planStopCount: s.plan?.stop_count ?? 0,
    planDistanceKm: s.plan?.total_distance_km ?? 0,
    planStops: s.plan?.stops || [],
    plannerList: () => setState({ plannerView: 'list' }),
    plannerMap: () => setState({ plannerView: 'map' }),
    plannerIsList: s.plannerView === 'list',
    plannerIsMap: s.plannerView === 'map',
    plannerListBg: pl.bg, plannerListTx: pl.tx, plannerMapBg: pm.bg, plannerMapTx: pm.tx,

    // explore toggle
    exploreList: () => setState({ exploreView: 'list' }),
    exploreMap: () => setState({ exploreView: 'map' }),
    exploreIsList: s.exploreView === 'list',
    exploreIsMap: s.exploreView === 'map',
    exploreListBg: el.bg, exploreListTx: el.tx, exploreMapBg: em.bg, exploreMapTx: em.tx,

    // dog sub-tab
    walletView: () => setState({ dogView: 'wallet' }),
    dressView: () => {
      setState({ dogView: 'dressup' });
      if (!s.decorationTemplates) {
        getDecorationTemplates()
          .then((decorationTemplates) => setState({ decorationTemplates }))
          .catch(() => {});
      }
    },
    // ── F 꾸미기 (decoration-template) — 테마 칩 ──
    decorationTemplates: s.decorationTemplates || [],
    dogIsWallet: s.dogView === 'wallet',
    dogIsDress: s.dogView === 'dressup',
    walletBg: wv.bg, walletTx: wv.tx, dressBg: dv.bg, dressTx: dv.tx,

    // tab bar colors
    tPlanner: tabActive('planner', 'facility', 'trip'),
    tExplore: tabActive('explore'),
    tCommunity: tabActive('community'),
    tDog: tabActive('dog'),

    // ===== entry phase =====
    inApp: s.phase === 'app',
    isLogin: s.phase === 'login',
    isName: s.phase === 'name',
    isMethod: s.phase === 'method',
    isUpload: s.phase === 'upload',
    isBreed: s.phase === 'breed',
    isProfile: s.phase === 'profile',
    isComplete: s.phase === 'complete',
    isPersona: s.phase === 'persona',
    startApp: () => setState({ phase: 'name' }),
    goMethod: () => setState({ phase: 'method' }),
    petName: s.petName || '체리',
    setPetName: (e) => setState({ petName: e.target.value }),
    petPhoto: s.petPhoto || null,
    hasPhoto: !!s.petPhoto,
    noPhoto: !s.petPhoto,
    // AI 3D 모델 MVP 영상(투명 배경). Safari는 VP9-알파 webm을 못 돌려 멈추므로
    // HEVC-알파 mp4로, 그 외(Chrome/Firefox/Edge)는 VP9-알파 webm으로 분기한다.
    petModelSrc: (() => {
      if (typeof navigator === 'undefined') return '/pet-3d-mvp.webm';
      const ua = navigator.userAgent;
      const isSafari = /^((?!chrome|crios|chromium|android|edg).)*safari/i.test(ua);
      return isSafari ? '/pet-3d-mvp.mp4' : '/pet-3d-mvp.webm';
    })(),
    fig3dStyle:
      (s.petPhoto
        ? 'background-image:url(' + s.petPhoto + '); background-size:cover; background-position:center; '
        : 'background-color:#EBB06A; ') +
      'transform:perspective(800px) rotateY(' + (s.rotY ?? -18) + 'deg) rotateX(' + (s.rotX ?? 4) + 'deg);',
    // 배경 이미지는 각 요소가 지정하고 회전 변환만 공유(투명 PNG 마스코트/실사용).
    fig3dRotate:
      'transform:perspective(800px) rotateY(' + (s.rotY ?? -18) + 'deg) rotateX(' + (s.rotX ?? 4) + 'deg);',
    onDragStart: (e) => {
      const startX = e.touches ? e.touches[0].clientX : e.clientX;
      const startY = e.touches ? e.touches[0].clientY : e.clientY;
      const baseY = s.rotY ?? -18;
      const baseX = s.rotX ?? 4;
      const move = (ev) => {
        const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
        setState({ rotY: baseY + (cx - startX) * 0.6, rotX: baseX - (cy - startY) * 0.4 });
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    photoStyle: s.petPhoto
      ? 'background-image:url(' + s.petPhoto + '); background-size:cover; background-position:center;'
      : '',
    onPhoto: (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => setState({ petPhoto: ev.target.result });
      r.readAsDataURL(f);
    },
    goUpload: () => setState({ phase: 'upload' }),
    goBreed: () => {
      setState({ phase: 'breed' });
      getBreedPredictions(DEMO_PET_ID)
        .then((predictions) => setState({ predictions }))
        .catch(() => {});
    },
    predictions: s.predictions || [],
    goProfile: () => {
      setState({ phase: 'profile' });
      previewBreed('골든 리트리버')
        .then((breed) => setState({ breed }))
        .catch(() => {});
    },
    // ── A5 견종 자동분류 (breed-catalog) ──
    breedName: s.breed?.breed || '골든 리트리버',
    breedSizeLabel: s.breed
      ? ({ large: '대형견', medium: '중형견', small: '소형견' } as any)[s.breed.size] || s.breed.size
      : '대형견',
    breedTemperament: s.breed?.temperament || '',
    goComplete: () => setState({ phase: 'complete' }),
    goPersona: () => {
      setState({ phase: 'persona' });
      getPersona(DEMO_PET_ID)
        .then((persona) => setState({ persona }))
        .catch(() => {});
    },
    persona: s.persona || null,
    finishOb: () => setState({ phase: 'app', screen: 'planner' }),
    backLogin: () => setState({ phase: 'login' }),
    backMethod: () => setState({ phase: 'method' }),
    backUpload: () => setState({ phase: 'upload' }),
    backBreed: () => setState({ phase: 'breed' }),
    backProfile: () => setState({ phase: 'profile' }),

    // persona toggle
    personaMascot: () => setState({ personaView: 'mascot' }),
    personaReal: () => setState({ personaView: 'real' }),
    personaIsMascot: s.personaView === 'mascot',
    personaIsReal: s.personaView === 'real',
    pMascotBg: s.personaView === 'mascot' ? '#fff' : 'transparent',
    pMascotTx: s.personaView === 'mascot' ? '#3B5BFE' : '#8A8F98',
    pRealBg: s.personaView === 'real' ? '#fff' : 'transparent',
    pRealTx: s.personaView === 'real' ? '#3B5BFE' : '#8A8F98',

    // ===== memory overlays =====
    openRecap: () => {
      setState({ memory: 'recap', recapSlide: 0 });
      getYearSummary(DEMO_PET_ID).then((rows) => setState({ yearSummary: rows[0] || null })).catch(() => {});
    },
    // ── H 연말 결산 (year-summary) ──
    recapYear: s.yearSummary?.year ?? 2025,
    recapPlacesCount: s.yearSummary?.places_count ?? 14,
    recapDistanceKm: s.yearSummary?.total_distance_km ?? 38,
    recapStory: s.yearSummary?.story_text || '',
    openPawmap: () => setState({ sub: 'pawmap' }),
    isPawmap: s.sub === 'pawmap',
    openFigure: () => setState({ memory: 'figure', figureStep: 'photo' }),
    openPhotocard: () => setState({ memory: 'photocard' }),
    closeMemory: () => setState({ memory: null }),
    isRecap: s.memory === 'recap',
    isFigure: s.memory === 'figure',
    isPhotocard: s.memory === 'photocard',
    recapS0: s.recapSlide === 0,
    recapS1: s.recapSlide === 1,
    recapS2: s.recapSlide === 2,
    recapNext: () => setState((st) => ({ recapSlide: Math.min(2, st.recapSlide + 1) })),
    recapDot0Bg: s.recapSlide === 0 ? '#fff' : 'rgba(255,255,255,.4)',
    recapDot1Bg: s.recapSlide === 1 ? '#fff' : 'rgba(255,255,255,.4)',
    recapDot2Bg: s.recapSlide === 2 ? '#fff' : 'rgba(255,255,255,.4)',
    figIsPhoto: s.figureStep === 'photo',
    figIsStyle: s.figureStep === 'style',
    figIsGen: s.figureStep === 'gen',
    figIsReveal: s.figureStep === 'reveal',
    figIsCustom: s.figureStep === 'custom',
    figToCustom: () => setState({ figureStep: 'custom' }),
    dressApply: () => setState({ dressStep: 'applying' }),
    dressDone: () => setState({ dressStep: 'result' }),
    dressReset: () => setState({ dressStep: 'main' }),
    dressIsMain: (s.dressStep || 'main') === 'main',
    dressIsApplying: s.dressStep === 'applying',
    dressIsResult: s.dressStep === 'result',
    figToStyle: () => setState({ figureStep: 'style' }),
    figToGen: () => setState({ figureStep: 'gen' }),
    figToReveal: () => setState({ figureStep: 'reveal' }),

    // ===== explore sub-screens =====
    openSub: (name) => setState({ sub: name }),
    openQR: () => setState({ sub: 'qr' }),
    openAudio: () => {
      setState({ sub: 'audio' });
      getAudioGuides(1).then((audioGuides) => setState({ audioGuides })).catch(() => {});
    },
    openCare: () => {
      setState({ sub: 'care' });
      getCareReminders(DEMO_PET_ID).then((careReminders) => setState({ careReminders })).catch(() => {});
    },
    careReminders: s.careReminders || [],
    audioGuides: s.audioGuides || [],
    audioScript: s.audioGuides?.[0]?.script_text || '',
    symptomChecks: s.symptomChecks || [],
    isCare: s.sub === 'care',
    careLogs: s.careLogs || [],
    recordFeed: () =>
      setState((st) => {
        const logs = st.careLogs || [];
        const mins = 42 + logs.length * 38;
        return { careLogs: [...logs, { type: '급여', icon: 'water_drop', label: '물·간식 급여', mins }] };
      }),
    recordRest: () =>
      setState((st) => {
        const logs = st.careLogs || [];
        const mins = 58 + logs.length * 38;
        return { careLogs: [...logs, { type: '휴식', icon: 'chair', label: '그늘 휴식', mins }] };
      }),
    clearLogs: () => setState({ careLogs: [] }),
    hasLogs: (s.careLogs || []).length > 0,
    careLogsView: (s.careLogs || []).map((l, i) => ({
      ...l, $index: i,
      elapsed: '여행 시작 후 ' + Math.floor(l.mins / 60) + '시간 ' + (l.mins % 60) + '분',
    })),
    isQR: s.sub === 'qr',
    isAudio: s.sub === 'audio',
    audioToggle: () => setState((st) => ({ audioPlaying: !st.audioPlaying })),
    audioIsPlaying: !!s.audioPlaying,
    audioIcon: s.audioPlaying ? 'pause' : 'play_arrow',
    openFest: () => {
      setState({ sub: 'festival', festView: 'cal' });
      getFestivals().then((festivals) => setState({ festivals })).catch(() => {});
    },
    openTrail: () => {
      setState({ sub: 'trail', trailExpanded: false });
      getTrails().then((trails) => setState({ trails })).catch(() => {});
    },
    openStamp: () => {
      setState({ sub: 'stamp' });
      getStamps().then((stamps) => setState({ stamps })).catch(() => {});
    },
    festivals: s.festivals || [],
    trails: s.trails || [],
    stamps: s.stamps || [],
    // ── E3 둘레길 구간 — 앞 5곳 + 더보기 ──
    trailStops: _trailExpanded ? _trailStops : _trailStops.slice(0, TRAIL_STOP_LIMIT),
    trailStopsHasMore: _trailStops.length > TRAIL_STOP_LIMIT,
    trailStopsExpanded: _trailExpanded,
    trailStopsMoreCount: Math.max(0, _trailStops.length - TRAIL_STOP_LIMIT),
    toggleTrailStops: () => setState((st) => ({ trailExpanded: !st.trailExpanded })),
    openVlog: () => {
      setState({ sub: 'vlog', vlogStep: 'course' });
      getVlogs(DEMO_PET_ID).then((vlogs) => setState({ vlog: vlogs[0] || null })).catch(() => {});
    },
    // ── G 브이로그 (vlog) ──
    vlogToneLabel: ({ 따뜻한: '따뜻·다정', 발랄한: '발랄·귀엽', 코믹한: '코믹' } as any)[s.vlog?.tone] || s.vlog?.tone || '',
    vlogClipCount: s.vlog?.clips?.length ?? 0,
    vlogStep: s.vlogStep || 'course',
    vlogToClips: () => setState({ vlogStep: 'clips' }),
    vlogToTone: () => setState({ vlogStep: 'tone' }),
    vlogToGen: () => setState({ vlogStep: 'gen' }),
    vlogToDone: () => setState({ vlogStep: 'done' }),
    vlogBackCourse: () => setState({ vlogStep: 'course' }),
    vlogBackClips: () => setState({ vlogStep: 'clips' }),
    vlogBackTone: () => setState({ vlogStep: 'tone' }),
    vlogIsCourse: (s.vlogStep || 'course') === 'course',
    vlogIsClips: s.vlogStep === 'clips',
    vlogIsTone: s.vlogStep === 'tone',
    vlogIsGen: s.vlogStep === 'gen',
    vlogIsDone: s.vlogStep === 'done',
    openPost: (post) => setState({ sub: 'post', selectedPost: post || null }),
    openClips: () => {
      setState({ sub: 'clips' });
      getVlogs(DEMO_PET_ID).then((vlogs) => setState({ vlog: vlogs[0] || null })).catch(() => {});
    },
    // ── 코스 후기 상세 (community-post) ──
    post: s.selectedPost || null,
    postTitle: s.selectedPost?.title || '콩이네 산책',
    postBody: s.selectedPost?.body || '한옥마을 펫카페 → 자만벽화마을 코스 너무 좋았어요! 그늘 많아서 더위 걱정 없었어요 🐾',
    postLikeCount: s.selectedPost?.like_count ?? 168,
    postDate: s.selectedPost?.created_at || '어제',
    // ── 발자국 클립 (vlog clips) ──
    vlogClips: (s.vlog?.clips || []).map((c, i) => ({
      ...c, $index: i,
      typeLabel: c.source_type === 'video' ? '영상' : '사진',
    })),
    isPost: s.sub === 'post',
    isClips: s.sub === 'clips',
    openAccess: () => {
      setState({ sub: 'access' });
      searchInclusive('전주', 'large', [])
        .then((res) => setState({ inclusive: res }))
        .catch(() => {});
    },
    // ── 이동약자 배려 (inclusive-filter, 실 배리어프리 DB) ──
    // 배려 요소가 1개 이상 태깅된 시설만 노출(빈 배지 카드 방지). 전부 실데이터.
    inclusivePlaces: (s.inclusive?.places || [])
      .filter((p) => (p.accessibility || []).length > 0)
      .slice(0, 20)
      .map((p, i) => ({
        ...p, $index: i,
        accessLabels: (p.accessibility || []).map((c) => ACCESS_LABELS[c] || c),
      })),
    inclusiveCount: s.inclusive?.count ?? 0,
    openPassport: () => {
      setState({ sub: 'passport' });
      getPetStamps(DEMO_PET_ID).then((petStamps) => setState({ petStamps })).catch(() => {});
    },
    // ── H 펫 패스포트 (pet-stamp) ──
    petStamps: s.petStamps || [],
    petStampCount: (s.petStamps || []).length,
    petStampsView: (s.petStamps || []).map((st, i) => ({
      ...st, $index: i,
      dateLabel: (st.collected_at || '').slice(5).replace('-', '.'),
    })),
    openEditTraits: () => setState({ sub: 'traits' }),
    closeSub: () => setState({ sub: null }),
    isFest: s.sub === 'festival',
    isTrail: s.sub === 'trail',
    isStamp: s.sub === 'stamp',
    isVlog: s.sub === 'vlog',
    isAccess: s.sub === 'access',
    isPassport: s.sub === 'passport',
    isTraits: s.sub === 'traits',
    isBadges: s.sub === 'badges',
    isJudge: s.sub === 'judge',
    isDine: s.sub === 'dine',
    isStay: s.sub === 'stay',
    isSimilar: s.sub === 'similar',
    openBadges: () => {
      setState({ sub: 'badges' });
      parsePolicy(SAMPLE_POLICY_TEXT)
        .then((res) => setState({ policy: res }))
        .catch(() => {});
    },
    // ── 동반 규정 배지 (policy-card, AI 파싱) ──
    policyBadges: s.policy?.badges || [],
    policySource: s.policy?.source_text || SAMPLE_POLICY_TEXT,
    hasPolicy: !!s.policy,
    openJudge: () => setState({ sub: 'judge' }),
    openDine: () => {
      setState({ sub: 'dine' });
      getReservations(DEMO_PET_ID).then((reservations) => setState({ reservations })).catch(() => {});
    },
    openStay: () => {
      setState({ sub: 'stay' });
      getReservations(DEMO_PET_ID).then((reservations) => setState({ reservations })).catch(() => {});
    },
    // ── C 코스 저장 (reservation) — 식당/숙소 예약 ──
    dineReservation: (s.reservations || []).find((r) => r.type === 'restaurant') || null,
    stayReservation: (s.reservations || []).find((r) => r.type === 'lodging') || null,
    dinePlaceName: (s.reservations || []).find((r) => r.type === 'restaurant')?.place_name || '한옥마을 펫카페',
    dinePrice: (s.reservations || []).find((r) => r.type === 'restaurant')?.price || '',
    stayPlaceName: (s.reservations || []).find((r) => r.type === 'lodging')?.place_name || '한옥 펜스테이',
    stayPrice: (s.reservations || []).find((r) => r.type === 'lodging')?.price || '',
    openSimilar: () => {
      setState({ sub: 'similar', similarLoading: true });
      cohortRecommendation('large', 4)
        .then((similar) => setState({ similar, similarLoading: false }))
        .catch(() => setState({ similarLoading: false }));
    },
    similarPlaces: s.similar || [],
    similarLoading: !!s.similarLoading,
    accOn: () => setState({ accessOn: true }),
    accOff: () => setState({ accessOn: false }),
    accessIsOn: s.accessOn !== false,
    accessIsOff: s.accessOn === false,
    accOnBg: s.accessOn !== false ? '#3B5BFE' : 'transparent',
    accOnTx: s.accessOn !== false ? '#fff' : '#8A8F98',
    accOffBg: s.accessOn === false ? '#fff' : 'transparent',
    accOffTx: s.accessOn === false ? '#1A1A1D' : '#8A8F98',
    // festival cal/list toggle
    festCal: () => setState({ festView: 'cal' }),
    festList: () => setState({ festView: 'list' }),
    festIsCal: s.festView === 'cal',
    festIsList: s.festView === 'list',
    festCalBg: s.festView === 'cal' ? '#fff' : 'transparent',
    festCalTx: s.festView === 'cal' ? '#3B5BFE' : '#8A8F98',
    festListBg: s.festView === 'list' ? '#fff' : 'transparent',
    festListTx: s.festView === 'list' ? '#3B5BFE' : '#8A8F98',
  };
}
