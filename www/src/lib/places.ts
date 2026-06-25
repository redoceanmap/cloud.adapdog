// 시안 standalone 의 PLACES 데이터 + 대화 로직(handleUserText)을 1:1 포팅.
// 큐레이션된 전주 1박 데모 — 플래너 채팅이 이 규칙으로 코스를 즉시 바꾼다.

export interface Popular {
  n: string;
  d: string;
}

export interface Place {
  key: string;
  name: string;
  cat: string;
  rating: string;
  price: string;
  hours: string;
  loc: string;
  day: string;
  time: string;
  icon: string;
  grad: string;
  label: string;
  desc: string;
  badges: string[];
  entry: string;
  entryNote: string;
  source: string;
  mx: number;
  my: number;
  isLodging?: boolean;
  popular: Popular[];
}

export const PLACES: Record<string, Place> = {
  cafe: { key: 'cafe', name: '한옥마을 펫카페', cat: '펫 동반 카페', rating: '4.7', price: '₩12,000~', hours: '영업 중 · ~21:00', loc: '전주 한옥마을', day: 'Day 1 · 11:00', time: '11:00', icon: 'local_cafe', grad: 'linear-gradient(135deg,#F6D9A6,#E7B776)', label: '한옥마을 펫카페', desc: '대형견 입장 가능 + 실내 에어컨으로 더위에 약한 체리도 시원하게 머물 수 있어요. 한옥 정취가 가득한 테라스 동반석이 있어 사진 찍기에도 좋습니다.', badges: ['대형견 OK', '목줄 필수', '실내 동반'], entry: '입장 가능', entryNote: '대형견 가능 · 목줄 필수 · 실내 동반', source: '한국관광공사 반려동물 동반여행', mx: 27, my: 34, popular: [{ n: '테라스 동반석', d: '대형견 가능' }, { n: '펫 음료', d: '강아지 메뉴' }, { n: '그늘 좌석', d: '더위 케어' }] },
  mural: { key: 'mural', name: '자만벽화마을', cat: '관광지 · 야외', rating: '4.8', price: '무료', hours: '24시간', loc: '전주 한옥마을', day: 'Day 1 · 13:00', time: '13:00', icon: 'palette', grad: 'linear-gradient(135deg,#C9B6E4,#A98FD0)', label: '자만벽화마을', desc: '그늘 골목이 많아 한낮에도 시원하게 둘러볼 수 있는 산책 코스예요. 좁은 언덕길이라 사람이 적은 오전·늦은 오후가 산책하기 좋습니다.', badges: ['야외', '목줄 필수', '그늘 많음'], entry: '입장 가능', entryNote: '야외 개방 · 목줄 필수', source: '한국문화정보원 반려동물 동반 문화시설', mx: 55, my: 50, popular: [{ n: '벽화 골목', d: '포토 스팟' }, { n: '그늘 길', d: '한여름 OK' }, { n: '전망 쉼터', d: '휴식' }] },
  view: { key: 'view', name: '오목대 전망', cat: '전망 · 야외', rating: '4.6', price: '무료', hours: '24시간', loc: '전주 한옥마을', day: 'Day 1 · 15:00', time: '15:00', icon: 'landscape', grad: 'linear-gradient(135deg,#A9C7E8,#7FA8D8)', label: '오목대 전망', desc: '완만한 평지 둘레길이라 대형견 체리도 무리 없이 오를 수 있어요. 한옥마을 전경이 한눈에 보이는 전망 포인트입니다.', badges: ['야외', '평지', '전망'], entry: '입장 가능', entryNote: '야외 산책로 · 평지', source: '한국관광공사 두루누비', mx: 72, my: 28, popular: [{ n: '전망 데크', d: '한옥마을 전경' }, { n: '평지 둘레길', d: '대형견 OK' }, { n: '그늘 정자', d: '휴식' }] },
  lodge: { key: 'lodge', name: '한옥 펫스테이', cat: '숙소 · 1박', rating: '4.8', price: '₩180,000/박', hours: '체크인 15:00', loc: '전주 한옥마을', day: 'Day 1 · 18:00', time: '18:00', icon: 'cottage', isLodging: true, grad: 'linear-gradient(135deg,#BFD3F0,#8FAEE0)', label: '한옥 펫스테이', desc: '대형견 동반 가능 + 마당이 있어 체리가 뛰어놀 수 있어요. 배변패드·식기 제공, 사전 고지 시 1마리 무료입니다.', badges: ['반려견 동반', '대형견 OK', '마당'], entry: '동반 가능', entryNote: '대형견 동반 가능 · 1마리 무료', source: '한국관광공사 반려동물 동반여행', mx: 42, my: 72, popular: [{ n: '마당', d: '뛰어놀기' }, { n: '배변패드', d: '기본 제공' }, { n: '한옥 객실', d: '대형견 OK' }] },
  festival: { key: 'festival', name: '전주한지문화축제', cat: '축제', rating: '4.5', price: '무료', hours: '10.09–10.11', loc: '전주 한옥마을', day: '추가 일정', time: '14:00', icon: 'festival', grad: 'linear-gradient(135deg,#E7D2A6,#D2B16E)', label: '전주한지문화축제', desc: '반려동물 동반 가능일이 지정돼 있어 체리와 함께 즐길 수 있는 축제예요. 한지 체험과 야외 공연이 열립니다.', badges: ['동반 가능일', '야외'], entry: '동반 가능일', entryNote: '지정 동반 가능일에 입장', source: '지역 문화행사 데이터', mx: 48, my: 40, popular: [{ n: '한지 체험', d: '가족 체험' }, { n: '야외 공연', d: '동반 관람' }, { n: '먹거리', d: '동반석' }] },
  food: { key: 'food', name: '펫 동반 전주비빔밥집', cat: '맛집', rating: '4.6', price: '₩11,000~', hours: '영업 중 · ~20:00', loc: '전주 풍남동', day: 'Day 1 · 12:30', time: '12:30', icon: 'restaurant', grad: 'linear-gradient(135deg,#F4C6BE,#E89B8E)', label: '전주비빔밥집', desc: '테라스 동반석을 운영해 대형견도 함께 식사할 수 있어요. 전주 대표 비빔밥을 맛볼 수 있는 노포입니다.', badges: ['동반석', '대형견 OK'], entry: '입장 가능', entryNote: '테라스 동반석 한정', source: '한국관광공사 반려동물 동반여행', mx: 35, my: 48, popular: [{ n: '테라스석', d: '대형견 OK' }, { n: '비빔밥', d: '전주 대표' }, { n: '물그릇', d: '펫 제공' }] },
  river: { key: 'river', name: '전주천 산책길', cat: '산책 · 하천', rating: '4.7', price: '무료', hours: '24시간', loc: '전주천', day: 'Day 1 · 16:30', time: '16:30', icon: 'park', grad: 'linear-gradient(135deg,#CDE6C2,#94C39C)', label: '전주천 산책길', desc: '물가라 한여름에도 시원하고 그늘 벤치에서 쉬기 좋아요. 평탄한 하천 산책로로 대형견 산책에 적합합니다.', badges: ['야외', '평지', '그늘'], entry: '입장 가능', entryNote: '야외 산책로 · 목줄 필수', source: '한국관광공사 두루누비', mx: 62, my: 64, popular: [{ n: '하천 벤치', d: '그늘 휴식' }, { n: '평지 산책', d: '대형견 OK' }, { n: '물놀이터', d: '여름 인기' }] },
};

export type TransportCode = 'KTX' | 'BUS' | 'CAR' | null;
export type LodgingCode = 'OVERNIGHT' | 'DAYTRIP' | null;
export type PlanStatus = 'DRAFTING' | 'READY';

export interface TripPlan {
  destination: string | null;
  transport: TransportCode;
  lodging: LodgingCode;
  stopovers: string[];
  itinerary: string[];
  status: PlanStatus;
}

export interface ReduceResult {
  plan: TripPlan;
  reply: string;
  sugg: string[];
  focus: string | null;
}

const courseSugg = () => ['축제 넣어줘', '맛집 추가', '오목대 빼줘', '여행 시작'];

// 시안 handleUserText 의 결정 로직을 순수 함수로 포팅.
export function reducePlan(prev: TripPlan, raw: string): ReduceResult {
  const t = String(raw || '').trim();
  const has = (...ws: string[]) => ws.some((w) => t.indexOf(w) >= 0);
  const P = PLACES;
  const plan: TripPlan = JSON.parse(JSON.stringify(prev));
  const inItin = (k: string) => plan.itinerary.indexOf(k) >= 0;
  const addKey = (k: string) => {
    if (!inItin(k)) {
      const li = plan.itinerary.indexOf('lodge');
      if (P[k].isLodging || li < 0) plan.itinerary.push(k);
      else plan.itinerary.splice(li, 0, k);
    }
  };
  let reply = '';
  let sugg: string[] = [];
  let focus: string | null = null;

  if (plan.itinerary.length && has('여행 시작', '출발', '확정', '이대로', '완성', '준비 됐', '준비됐')) {
    plan.status = 'READY';
    reply = '좋아요, 코스 완성! 🐾 "여정" 탭에서 전체 일정을 확인하고 출발하면 발자국을 따라 안내할게요.';
    sugg = ['여정 보기', '축제 넣어줘'];
  } else if (has('빼', '삭제', '제거', '말고', '지워')) {
    let rk: string | null = null;
    for (const k of plan.itinerary) {
      const it = P[k];
      if (t.indexOf(it.name) >= 0 || (has('카페') && k === 'cafe') || (has('숙소', '숙박', '펫스테이') && k === 'lodge') || (has('축제') && k === 'festival') || (has('맛집', '밥', '식당') && k === 'food') || (has('산책', '둘레', '전주천') && k === 'river') || (has('전망', '오목대') && k === 'view') || (has('벽화', '자만') && k === 'mural')) {
        rk = k;
        break;
      }
    }
    if (rk) {
      plan.itinerary = plan.itinerary.filter((x) => x !== rk);
      reply = P[rk].name + '은(는) 코스에서 뺐어요. 더 조정할까요?';
      if (plan.itinerary.length) focus = plan.itinerary[0];
    } else reply = '어떤 곳을 뺄까요? 장소 이름을 말해줘요.';
    sugg = courseSugg();
  } else if (has('ktx', 'KTX', '케이티', '기차')) {
    plan.transport = 'KTX';
    plan.stopovers = [];
    reply = 'KTX로 바꿨어요 🚄 전주역까지 직행이에요.';
    sugg = courseSugg();
  } else if (has('버스', '고속버스')) {
    plan.transport = 'BUS';
    plan.stopovers = [];
    reply = '고속버스로 바꿨어요 🚌 전주고속버스터미널 직행이에요.';
    sugg = courseSugg();
  } else if (has('자차', '자동차', '운전', '차로', '드라이브', '차 가져')) {
    plan.transport = 'CAR';
    plan.stopovers = ['여산휴게소 반려동물 쉼터', '익산 펫 카페'];
    reply = '자차로 바꿨어요 🚗 가는 길에 들를 펫 동반 경유지도 추천에 넣었어요.';
    sugg = courseSugg();
  } else if (has('1박', '자고', '숙박', '묵', '오버나잇')) {
    plan.lodging = 'OVERNIGHT';
    addKey('lodge');
    reply = '1박으로 잡고 펫 동반 숙소를 코스에 넣었어요 🏨';
    focus = 'lodge';
    sugg = courseSugg();
  } else if (has('당일', '당일치기', '돌아올')) {
    plan.lodging = 'DAYTRIP';
    plan.itinerary = plan.itinerary.filter((x) => x !== 'lodge');
    reply = '당일치기로 바꿨어요 🌿 숙소는 코스에서 뺐어요.';
    sugg = courseSugg();
  } else if (has('카페', '커피')) {
    addKey('cafe');
    reply = '대형견 OK 카페를 코스에 넣었어요 ☕';
    focus = 'cafe';
    sugg = courseSugg();
  } else if (has('축제', '한지')) {
    addKey('festival');
    reply = '전주한지문화축제를 넣었어요 🎉 동반 가능일이에요.';
    focus = 'festival';
    sugg = courseSugg();
  } else if (has('맛집', '식당', '밥', '비빔밥')) {
    addKey('food');
    reply = '펫 동반 비빔밥집을 넣었어요 🍲 테라스 동반석이 있어요.';
    focus = 'food';
    sugg = courseSugg();
  } else if (has('산책', '둘레', '전주천', '물놀이')) {
    addKey('river');
    reply = '전주천 산책길을 넣었어요 🌳 그늘이 많아요.';
    focus = 'river';
    sugg = courseSugg();
  } else if (has('전망', '오목대')) {
    addKey('view');
    reply = '오목대 전망을 넣었어요 ⛰️ 평지라 편해요.';
    focus = 'view';
    sugg = courseSugg();
  } else if (has('벽화', '자만')) {
    addKey('mural');
    reply = '자만벽화마을을 넣었어요 🎨 그늘 골목이 많아요.';
    focus = 'mural';
    sugg = courseSugg();
  } else {
    reply = '"카페 추가", "축제 넣어줘", "오목대 빼줘", "자차로 바꿔" 처럼 말하면 코스를 바로 바꿔드려요 🐾';
    sugg = courseSugg();
  }

  return { plan, reply, sugg, focus };
}

export const INITIAL_PLAN: TripPlan = {
  destination: '전주',
  transport: 'KTX',
  lodging: 'OVERNIGHT',
  stopovers: [],
  itinerary: ['cafe', 'mural', 'view', 'lodge'],
  status: 'DRAFTING',
};

export const transportLabel = (tp: TransportCode) =>
  tp === 'KTX' ? 'KTX' : tp === 'BUS' ? '고속버스' : tp === 'CAR' ? '자차' : '미정';
export const transportSub = (tp: TransportCode) =>
  tp === 'CAR' ? '경유지 포함 · 약 2시간 50분' : tp === 'BUS' ? '터미널 직행 · 약 2시간 40분' : tp === 'KTX' ? '전주역 직행 · 약 1시간 40분' : '';
