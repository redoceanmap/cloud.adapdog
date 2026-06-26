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
  latitude: number;
  longitude: number;
  isLodging?: boolean;
  leg?: 'enroute' | 'jeonju'; // enroute=서울→전주 경유지, jeonju=전주 도착 코스
  popular: Popular[];
}

export const PLACES: Record<string, Place> = {
  // ── 서울 → 전주 경유지(자차): 펫 동반 휴게소 + 길목 문화시설 ──
  gwanggyo: { key: 'gwanggyo', name: '수원 광교호수공원', cat: '경유 · 호수공원', leg: 'enroute', rating: '4.7', price: '무료', hours: '24시간', loc: '경기 수원 · 서울→전주 길목', day: '경유 1 · 출발 후 40분', time: '10:40', icon: 'water', grad: 'linear-gradient(135deg,#A9C7E8,#7FA8D8)', label: '수원 광교호수공원', desc: '서울을 막 벗어난 첫 휴식 포인트. 대형견도 마음껏 걷는 평지 호수 둘레길이라 체리 컨디션을 풀어주기 좋아요.', badges: ['대형견 OK', '야외', '평지 산책'], entry: '동반 가능', entryNote: '야외 공원 · 대형견 가능 · 목줄 필수', source: '한국관광공사 반려동물 동반여행', mx: 30, my: 14, latitude: 37.287, longitude: 127.0625, popular: [{ n: '호수 둘레길', d: '평지 산책' }, { n: '그늘 데크', d: '더위 케어' }, { n: '급수대', d: '펫 음수' }] },
  yeosan: { key: 'yeosan', name: '여산휴게소 반려동물 쉼터', cat: '경유 · 휴게소', leg: 'enroute', rating: '4.4', price: '무료', hours: '24시간', loc: '호남고속도로 · 전주 30분 전', day: '경유 2 · 도착 30분 전', time: '13:10', icon: 'local_parking', grad: 'linear-gradient(135deg,#CDE6C2,#94C39C)', label: '여산휴게소 반려동물 쉼터', desc: '전주 진입 직전 마지막 쉼터. 반려동물 전용 쉼터와 배변·급수 공간이 있어 긴 이동 중 체리가 잠시 쉬어가기 좋아요.', badges: ['펫 쉼터', '배변 공간', '급수'], entry: '이용 가능', entryNote: '반려동물 쉼터 · 목줄 필수', source: '한국도로공사 반려동물 쉼터', mx: 50, my: 56, latitude: 36.0667, longitude: 127.1009, popular: [{ n: '펫 쉼터', d: '전용 공간' }, { n: '배변 공간', d: '비치' }, { n: '급수대', d: '펫 음수' }] },
  mireuk: { key: 'mireuk', name: '익산 미륵사지', cat: '경유 · 세계유산(야외)', leg: 'enroute', rating: '4.8', price: '무료', hours: '24시간', loc: '전북 익산 · 전주 40분 전', day: '경유 3 · 길목 문화시설', time: '12:20', icon: 'temple_buddhist', grad: 'linear-gradient(135deg,#E7D2A6,#D2B16E)', label: '익산 미륵사지', desc: '가는 길에 들르는 백제 세계유산. 탁 트인 야외 사적이라 대형견 체리와 함께 목줄 산책으로 둘러볼 수 있어요. 국보 미륵사지 석탑이 있습니다.', badges: ['세계유산', '야외 사적', '대형견 OK'], entry: '동반 가능', entryNote: '야외 사적 동반 가능 · 목줄 필수 · 실내 전시관 제한', source: '국가유산청 · 유네스코 세계유산', mx: 44, my: 50, latitude: 36.0119, longitude: 127.0286, popular: [{ n: '미륵사지 석탑', d: '국보' }, { n: '야외 사적', d: '목줄 산책' }, { n: '잔디 광장', d: '대형견 OK' }] },

  // ── 전주 도착 코스: 문화체육관광부 산하·연계 문화시설 ──
  village: { key: 'village', name: '전주한옥마을', cat: '문화시설 · 야외', leg: 'jeonju', rating: '4.8', price: '무료', hours: '상시 개방', loc: '전주 완산구 · 경기전 일원', day: 'Day 1 · 11:00', time: '11:00', icon: 'temple_buddhist', grad: 'linear-gradient(135deg,#E7D2A6,#D2B16E)', label: '전주한옥마을', desc: '경기전을 중심으로 한 한옥 거리. 야외 골목과 경기전 외부 마당은 대형견 체리와 목줄 산책이 가능해요(실내 전각·경기전 내부는 제한). 그늘 골목이 많아 더위에 약한 체리에게 좋습니다.', badges: ['야외 동반', '대형견 OK', '그늘 골목'], entry: '입장 가능', entryNote: '야외 거리 동반 가능 · 경기전 실내 제한 · 목줄 필수', source: '한국관광공사 · 전주시 문화시설', mx: 60, my: 70, latitude: 35.815, longitude: 127.153, popular: [{ n: '한옥 거리', d: '야외 산책' }, { n: '경기전 마당', d: '외부 동반' }, { n: '그늘 골목', d: '더위 케어' }] },
  heritage: { key: 'heritage', name: '국립무형유산원', cat: '문화부 산하 · 야외공간', leg: 'jeonju', rating: '4.7', price: '무료', hours: '09:00–18:00 · 월 휴관', loc: '전주 완산구 서학로', day: 'Day 1 · 14:00', time: '14:00', icon: 'account_balance', grad: 'linear-gradient(135deg,#BFD3F0,#8FAEE0)', label: '국립무형유산원', desc: '문화체육관광부 산하 무형유산 전문기관. 너른 야외 마당과 산책로는 대형견 동반이 가능해 체리와 함께 여유롭게 둘러볼 수 있어요(실내 전시관은 제한).', badges: ['문화부 산하', '야외 동반', '대형견 OK'], entry: '동반 가능', entryNote: '야외 공간 동반 가능 · 실내 전시관 제한 · 목줄 필수', source: '문화체육관광부 국립무형유산원', mx: 52, my: 66, latitude: 35.8042, longitude: 127.1442, popular: [{ n: '야외 마당', d: '대형견 OK' }, { n: '전통정원', d: '산책로' }, { n: '그늘 회랑', d: '휴식' }] },
  park: { key: 'park', name: '덕진공원', cat: '공원 · 산책', leg: 'jeonju', rating: '4.6', price: '무료', hours: '24시간', loc: '전주 덕진구', day: 'Day 1 · 16:30', time: '16:30', icon: 'park', grad: 'linear-gradient(135deg,#CDE6C2,#94C39C)', label: '덕진공원', desc: '연꽃 호수를 낀 평지 산책로라 대형견 체리도 무리 없이 걸을 수 있어요. 물가라 한여름에도 비교적 시원하고 그늘 벤치가 많습니다.', badges: ['대형견 OK', '평지', '그늘 많음'], entry: '입장 가능', entryNote: '야외 공원 · 대형견 산책 가능 · 목줄 필수', source: '전주시 · 한국관광공사 두루누비', mx: 70, my: 56, latitude: 35.8489, longitude: 127.1303, popular: [{ n: '연꽃 호수', d: '포토 스팟' }, { n: '평지 둘레길', d: '대형견 OK' }, { n: '그늘 벤치', d: '더위 케어' }] },
  lodge: { key: 'lodge', name: '한옥 펫스테이', cat: '숙소 · 1박', leg: 'jeonju', rating: '4.8', price: '₩180,000/박', hours: '체크인 15:00', loc: '전주 한옥마을', day: 'Day 1 · 18:00', time: '18:00', icon: 'cottage', isLodging: true, grad: 'linear-gradient(135deg,#BFD3F0,#8FAEE0)', label: '한옥 펫스테이', desc: '대형견 동반 가능 + 마당이 있어 체리가 뛰어놀 수 있어요. 배변패드·식기 제공, 사전 고지 시 1마리 무료입니다.', badges: ['반려견 동반', '대형견 OK', '마당'], entry: '동반 가능', entryNote: '대형견 동반 가능 · 1마리 무료', source: '한국관광공사 반려동물 동반여행', mx: 62, my: 80, latitude: 35.8155, longitude: 127.152, popular: [{ n: '마당', d: '뛰어놀기' }, { n: '배변패드', d: '기본 제공' }, { n: '한옥 객실', d: '대형견 OK' }] },
  museum: { key: 'museum', name: '국립전주박물관', cat: '문화부 · 야외 조각공원', leg: 'jeonju', rating: '4.6', price: '무료', hours: '10:00–18:00 · 월 휴관', loc: '전주 완산구 쑥고개로', day: 'Day 2 · 10:00', time: '10:00', icon: 'museum', grad: 'linear-gradient(135deg,#C9B6E4,#A98FD0)', label: '국립전주박물관', desc: '문화체육관광부 산하 박물관. 야외 조각공원과 정원은 대형견 동반 산책이 가능해 체리와 함께 둘러볼 수 있어요(실내 전시는 제한).', badges: ['문화부 산하', '야외 조각공원', '대형견 OK'], entry: '동반 가능', entryNote: '야외 조각공원 동반 가능 · 실내 전시 제한 · 목줄 필수', source: '국립전주박물관', mx: 40, my: 78, latitude: 35.8016, longitude: 127.1086, popular: [{ n: '야외 조각공원', d: '대형견 OK' }, { n: '정원 산책로', d: '평지' }, { n: '그늘 쉼터', d: '휴식' }] },
  hall: { key: 'hall', name: '한국전통문화전당', cat: '문화부 연계 · 야외행사', leg: 'jeonju', rating: '4.5', price: '무료', hours: '행사별 상이', loc: '전주 완산구 전주천동로', day: 'Day 2 · 13:00', time: '13:00', icon: 'theater_comedy', grad: 'linear-gradient(135deg,#F4C6BE,#E89B8E)', label: '한국전통문화전당', desc: '전통문화 공연·전시가 열리는 문화부 연계 시설. 야외 행사·마당 프로그램 때는 체리와 함께 관람할 수 있어요(실내 공연장 제한).', badges: ['문화부 연계', '야외행사 동반', '대형견 OK'], entry: '야외행사 시 동반', entryNote: '야외 행사 동반 가능 · 실내 공연장 제한 · 목줄 필수', source: '한국전통문화전당', mx: 54, my: 68, latitude: 35.8146, longitude: 127.1456, popular: [{ n: '야외 마당', d: '행사 관람' }, { n: '전통 공연', d: '시즌별' }, { n: '체험 부스', d: '동반석' }] },
  food: { key: 'food', name: '펫 동반 전주비빔밥집', cat: '맛집', leg: 'jeonju', rating: '4.6', price: '₩11,000~', hours: '영업 중 · ~20:00', loc: '전주 풍남동', day: 'Day 1 · 12:30', time: '12:30', icon: 'restaurant', grad: 'linear-gradient(135deg,#F4C6BE,#E89B8E)', label: '전주비빔밥집', desc: '테라스 동반석을 운영해 대형견도 함께 식사할 수 있어요. 전주 대표 비빔밥을 맛볼 수 있는 노포입니다.', badges: ['동반석', '대형견 OK'], entry: '입장 가능', entryNote: '테라스 동반석 한정', source: '한국관광공사 반려동물 동반여행', mx: 58, my: 74, latitude: 35.8135, longitude: 127.1502, popular: [{ n: '테라스석', d: '대형견 OK' }, { n: '비빔밥', d: '전주 대표' }, { n: '물그릇', d: '펫 제공' }] },
  festival: { key: 'festival', name: '전주한지문화축제', cat: '축제', leg: 'jeonju', rating: '4.5', price: '무료', hours: '10.09–10.11', loc: '전주 한옥마을', day: '추가 일정', time: '15:00', icon: 'festival', grad: 'linear-gradient(135deg,#E7D2A6,#D2B16E)', label: '전주한지문화축제', desc: '반려동물 동반 가능일이 지정돼 있어 체리와 함께 즐길 수 있는 축제예요. 한지 체험과 야외 공연이 열립니다.', badges: ['동반 가능일', '야외'], entry: '동반 가능일', entryNote: '지정 동반 가능일에 입장 · 목줄 필수', source: '지역 문화행사 데이터', mx: 64, my: 64, latitude: 35.8143, longitude: 127.1538, popular: [{ n: '한지 체험', d: '가족 체험' }, { n: '야외 공연', d: '동반 관람' }, { n: '먹거리', d: '동반석' }] },
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

const courseSugg = () => ['박물관 추가', '맛집 추가', '덕진공원 빼줘', '여행 시작'];

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
      if (t.indexOf(it.name) >= 0 || (has('한옥마을', '경기전') && k === 'village') || (has('무형유산원', '유산원') && k === 'heritage') || (has('덕진', '공원', '산책') && k === 'park') || (has('박물관') && k === 'museum') || (has('전통문화전당', '전당', '공연') && k === 'hall') || (has('숙소', '숙박', '펫스테이') && k === 'lodge') || (has('맛집', '밥', '식당', '비빔밥') && k === 'food') || (has('축제', '한지') && k === 'festival')) {
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
    plan.stopovers = ['gwanggyo', 'yeosan', 'mireuk'];
    reply = '자차로 바꿨어요 🚗 가는 길에 들를 펫 동반 휴게소와 길목 문화시설도 경유지로 추천에 넣었어요 — 수원 광교호수공원, 여산휴게소, 익산 미륵사지(세계유산).';
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
  } else if (has('박물관')) {
    addKey('museum');
    reply = '국립전주박물관을 넣었어요 🏛️ 야외 조각공원은 대형견 동반이 가능해요.';
    focus = 'museum';
    sugg = courseSugg();
  } else if (has('전통문화전당', '전당', '공연')) {
    addKey('hall');
    reply = '한국전통문화전당을 넣었어요 🎭 야외 행사 때 체리와 함께 관람할 수 있어요.';
    focus = 'hall';
    sugg = courseSugg();
  } else if (has('무형유산원', '유산원')) {
    addKey('heritage');
    reply = '국립무형유산원을 넣었어요 🏛️ 야외 마당은 대형견 동반이 가능해요.';
    focus = 'heritage';
    sugg = courseSugg();
  } else if (has('덕진', '공원', '산책')) {
    addKey('park');
    reply = '덕진공원을 넣었어요 🌳 평지 호수 산책로라 대형견도 편해요.';
    focus = 'park';
    sugg = courseSugg();
  } else if (has('한옥마을', '경기전')) {
    addKey('village');
    reply = '전주한옥마을을 넣었어요 🏯 그늘 골목이 많아 더위에 약한 체리에게 좋아요.';
    focus = 'village';
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
  } else {
    reply = '"박물관 추가", "축제 넣어줘", "덕진공원 빼줘", "자차로 바꿔" 처럼 말하면 코스를 바로 바꿔드려요 🐾';
    sugg = courseSugg();
  }

  return { plan, reply, sugg, focus };
}

export const INITIAL_PLAN: TripPlan = {
  destination: '전주',
  transport: 'KTX',
  lodging: 'OVERNIGHT',
  stopovers: [],
  itinerary: ['village', 'heritage', 'park', 'lodge'],
  status: 'DRAFTING',
};

// ── 여정 지도 앵커 ──────────────────────────────────────────────
// 교통수단별 실제 여정을 그린다:
//  KTX  → 서울역 ─[열차]→ 전주역 ─→ 전주 코스
//  고속버스 → 센트럴시티 ─[버스]→ 전주고속터미널 ─→ 전주 코스
//  자차  → 서울(내 위치) ─→ 경유지(휴게소·문화시설) ─→ 전주 코스
export type JourneyRole = 'origin' | 'stopover' | 'transit' | 'dest';
export interface JourneyPoint {
  name: string;
  lat: number;
  lng: number;
  role: JourneyRole;
  caption: string;
  icon?: string; // Material Symbol (출발/역/터미널 마커용)
}

export const SEOUL_ORIGIN = { lat: 37.5663, lng: 126.9779 }; // 서울(내 위치 대용 · 시청)
const JEONJU_DEST = { lat: 35.8149, lng: 127.153 }; // 전주 한옥마을(코스 거점)

// 교통수단별 출발역/터미널 · 도착역/터미널 좌표.
const STATION = {
  KTX: { dep: { name: '서울역', lat: 37.5559, lng: 126.9723 }, arr: { name: '전주역', lat: 35.8503, lng: 127.1602 }, icon: 'train' },
  BUS: { dep: { name: '센트럴시티터미널', lat: 37.505, lng: 127.0048 }, arr: { name: '전주고속버스터미널', lat: 35.8345, lng: 127.1292 }, icon: 'directions_bus' },
} as const;

// KTX 전라선 실제 정차역 코리도어(서울→전주). 철도는 도로 라우팅(OSRM) 대상이 아니라,
// 기차가 실제로 지나는 정차역을 이어 경로를 그린다(직선 대각선=비행 느낌 제거, 실데이터).
export const KTX_CORRIDOR: { lat: number; lng: number }[] = [
  { lat: 37.5559, lng: 126.9723 }, // 서울역
  { lat: 37.4161, lng: 126.8846 }, // 광명역
  { lat: 36.7943, lng: 127.1045 }, // 천안아산역
  { lat: 36.6207, lng: 127.3275 }, // 오송역
  { lat: 35.9379, lng: 126.9544 }, // 익산역
  { lat: 35.8503, lng: 127.1602 }, // 전주역
];

/** 교통수단별 출발 지점(역/터미널, 자차·미정은 서울 내 위치). */
export function journeyOrigin(tp: TransportCode): JourneyPoint {
  const s = tp === 'KTX' ? STATION.KTX : tp === 'BUS' ? STATION.BUS : null;
  if (s) return { lat: s.dep.lat, lng: s.dep.lng, name: s.dep.name, role: 'origin', caption: `출발 · ${s.dep.name}`, icon: s.icon };
  return { ...SEOUL_ORIGIN, name: '서울', role: 'origin', caption: '출발 · 서울(내 위치)', icon: 'home' };
}

/** 교통수단별 도착역/터미널 경유점(자차·미정은 없음). */
export function journeyTransit(tp: TransportCode): JourneyPoint[] {
  const s = tp === 'KTX' ? STATION.KTX : tp === 'BUS' ? STATION.BUS : null;
  if (!s) return [];
  return [{ lat: s.arr.lat, lng: s.arr.lng, name: s.arr.name, role: 'transit', caption: `${s.arr.name} 도착`, icon: s.icon }];
}

/** 전주 코스 도착 거점(좌표 미지정 시 한옥마을 기본). */
export function journeyDest(courseCount: number, lat = JEONJU_DEST.lat, lng = JEONJU_DEST.lng): JourneyPoint {
  return { lat, lng, name: '전주 코스', role: 'dest', caption: courseCount ? `전주 코스 · ${courseCount}곳` : '전주 도착', icon: 'flag' };
}

/** 데모 플랜 → 교통수단별 여정 포인트. 자차면 경유지(PLACES 키)를 끼운다. */
export function buildJourney(plan: TripPlan, courseCount: number): JourneyPoint[] {
  const pts: JourneyPoint[] = [journeyOrigin(plan.transport)];
  if (plan.transport === 'CAR') {
    for (const key of plan.stopovers) {
      const p = PLACES[key];
      if (p) pts.push({ lat: p.latitude, lng: p.longitude, name: p.name, role: 'stopover', caption: p.name, icon: 'pets' });
    }
  } else {
    pts.push(...journeyTransit(plan.transport));
  }
  pts.push(journeyDest(courseCount));
  return pts;
}

export const transportLabel = (tp: TransportCode) =>
  tp === 'KTX' ? 'KTX' : tp === 'BUS' ? '고속버스' : tp === 'CAR' ? '자차' : '미정';
export const transportSub = (tp: TransportCode) =>
  tp === 'CAR' ? '경유지 포함 · 약 2시간 50분' : tp === 'BUS' ? '터미널 직행 · 약 2시간 40분' : tp === 'KTX' ? '전주역 직행 · 약 1시간 40분' : '';
