// 코스 표시용 Place 모델 + 여정 지도 앵커(서울↔전주 출발/도착/코리도어) 공용 헬퍼.

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
  isMock?: boolean; // 목업(MVP 데모용 예시) 정류장
  leg?: 'enroute' | 'jeonju'; // enroute=서울→전주 경유지, jeonju=전주 도착 코스
  popular: Popular[];
}

export type TransportCode = 'KTX' | 'BUS' | 'CAR' | null;
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
export const JEONJU_ANCHOR = { lat: 35.8242, lng: 127.148 }; // 전주 도심(코스 전 부분 경로 도착 앵커 · 백엔드 _JEONJU 동일)

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

export const transportLabel = (tp: TransportCode) =>
  tp === 'KTX' ? 'KTX' : tp === 'BUS' ? '고속버스' : tp === 'CAR' ? '자차' : '미정';
export const transportSub = (tp: TransportCode) =>
  tp === 'CAR' ? '경유지 포함 · 약 2시간 50분' : tp === 'BUS' ? '터미널 직행 · 약 2시간 40분' : tp === 'KTX' ? '전주역 직행 · 약 1시간 40분' : '';
