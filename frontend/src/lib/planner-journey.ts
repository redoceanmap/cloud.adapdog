import type { RouteStop, TripPlan } from "@/lib/planner-api";
import { categoryStyle } from "@/lib/naverMap";

export interface LatLng {
  lat: number;
  lng: number;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function transportLabel(transport: TripPlan["transport"]): string {
  if (transport === "ktx") return "KTX";
  if (transport === "bus") return "고속버스";
  if (transport === "car") return "자차";
  return "이동";
}

export function transportArrivalSub(transport: TripPlan["transport"], destination: string): string {
  if (transport === "ktx") return `${destination}역 직행 · 약 1시간 40분`;
  if (transport === "bus") return `${destination} 터미널 직행 · 약 2시간 40분`;
  if (transport === "car") return "경유지 포함 · 약 2시간 50분";
  return "이동 수단을 선택해 주세요";
}

export function estimateDriveMinutes(km: number): number {
  if (km <= 0) return 0;
  return Math.max(3, Math.round((km / 35) * 60));
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "1분 미만";
  if (minutes < 60) return `약 ${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `약 ${h}시간`;
  return `약 ${h}시간 ${m}분`;
}

export function stopScheduleLabel(stopIndex: number, transport: TripPlan["transport"]): string {
  const arrivalMin =
    transport === "ktx" ? 11 * 60 : transport === "bus" ? 11 * 60 + 20 : transport === "car" ? 11 * 60 + 50 : 10 * 60;
  const gap = 150;
  const total = arrivalMin + stopIndex * gap;
  const day = Math.floor(total / (24 * 60)) + 1;
  const h = Math.floor((total % (24 * 60)) / 60);
  const m = total % 60;
  return `Day ${day} · ${h}:${String(m).padStart(2, "0")}`;
}

export interface TravelLeg {
  from: string;
  to: string;
  mode: string;
  detail: string;
  minutes: number;
  km?: number;
}

export function buildIntercityLeg(plan: TripPlan | null, region: string): TravelLeg | null {
  const dest = plan?.destination || region;
  if (!dest) return null;
  const origin = plan?.origin || "서울";
  const transport = plan?.transport ?? "unset";
  const mode = transportLabel(transport);
  const minutes =
    transport === "ktx" ? 100 : transport === "bus" ? 160 : transport === "car" ? 170 : 90;
  return {
    from: origin,
    to: dest,
    mode,
    detail:
      transport === "unset"
        ? `${dest}까지 이동 · 약 ${formatDuration(minutes)}`
        : transportArrivalSub(transport, dest),
    minutes,
  };
}

export function buildStopLeg(from: RouteStop, to: RouteStop, km?: number): TravelLeg {
  const distance =
    km ??
    to.distance_from_prev_km ??
    haversineKm(
      { lat: from.latitude, lng: from.longitude },
      { lat: to.latitude, lng: to.longitude },
    );
  const minutes = estimateDriveMinutes(distance);
  return {
    from: from.name,
    to: to.name,
    mode: "자차",
    detail: `${distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} · ${formatDuration(minutes)}`,
    minutes,
    km: distance,
  };
}

const HERO_GRADS = [
  "linear-gradient(135deg,#F6D9A6,#E7B776)",
  "linear-gradient(135deg,#C9B6E4,#A98FD0)",
  "linear-gradient(135deg,#A9C7E8,#7FA8D8)",
  "linear-gradient(135deg,#CDE6C2,#94C39C)",
  "linear-gradient(135deg,#F4C6BE,#E89B8E)",
];

const CATEGORY_ICONS: { match: string[]; icon: string }[] = [
  { match: ["카페"], icon: "local_cafe" },
  { match: ["식당", "음식", "맛집", "레스토랑"], icon: "restaurant" },
  { match: ["미술", "박물", "전시", "갤러리", "문화"], icon: "museum" },
  { match: ["숙박", "펜션", "호텔", "스테이", "게스트", "민박"], icon: "hotel" },
  { match: ["공원", "여행", "관광", "명소", "둘레", "호수"], icon: "park" },
  { match: ["용품", "마트", "쇼핑"], icon: "shopping_bag" },
  { match: ["미용", "그루밍"], icon: "content_cut" },
  { match: ["병원", "동물병원"], icon: "local_hospital" },
];

export function placeHeroIcon(category?: string): string {
  const c = category || "";
  for (const row of CATEGORY_ICONS) if (row.match.some((m) => c.includes(m))) return row.icon;
  return "temple_buddhist";
}

export function placeHeroGrad(index: number): string {
  return HERO_GRADS[index % HERO_GRADS.length];
}

export function placePriceHint(category?: string): string {
  const c = category || "";
  if (c.includes("숙박") || c.includes("펜션") || c.includes("호텔")) return "₩문의";
  if (c.includes("식당") || c.includes("맛집") || c.includes("카페")) return "₩문의";
  return "무료";
}

export function placeHoursHint(category?: string): string {
  const c = category || "";
  if (c.includes("공원") || c.includes("야외")) return "상시 개방";
  if (c.includes("박물") || c.includes("문화")) return "09:00–18:00 · 월 휴관";
  if (c.includes("숙박")) return "체크인 15:00";
  if (c.includes("카페") || c.includes("식당")) return "영업 중 · ~21:00";
  return "운영시간 확인";
}

export function placeLocationHint(region: string, category?: string): string {
  const c = category || "";
  if (c.includes("한옥") || c.includes("마을")) return `${region} · 한옥 일원`;
  return `${region} 일대`;
}

export function buildPopularSpots(
  stop: RouteStop,
  alternatives?: { name: string; category: string }[],
): { name: string; desc: string }[] {
  if (alternatives?.length) {
    return alternatives.slice(0, 3).map((a) => ({ name: a.name, desc: a.category || "근처" }));
  }
  const c = stop.category || "";
  if (c.includes("공원")) {
    return [
      { name: "둘레길", desc: "평지 산책" },
      { name: "그늘 벤치", desc: "더위 케어" },
      { name: "급수 구역", desc: "펫 음수" },
    ];
  }
  if (c.includes("한옥") || c.includes("문화")) {
    return [
      { name: "야외 거리", desc: "목줄 산책" },
      { name: "마당", desc: "외부 동반" },
      { name: "그늘 골목", desc: "휴식" },
    ];
  }
  if (c.includes("카페") || c.includes("식당")) {
    return [
      { name: "테라스석", desc: "동반석" },
      { name: "물그릇", desc: "펫 제공" },
      { name: "포토존", desc: "기념 촬영" },
    ];
  }
  const style = categoryStyle(c);
  return [
    { name: style.label, desc: "추천 포인트" },
    { name: "야외 공간", desc: "산책" },
    { name: "휴식", desc: "그늘" },
  ];
}

export function buildDescription(stop: RouteStop, petName: string, verdictMessage?: string): string {
  if (stop.reason) return stop.reason;
  if (verdictMessage) return verdictMessage;
  return `${petName}와 함께 방문하기 좋은 ${stop.category || "장소"}입니다. 목줄·배변봉투를 챙기고 여유 있게 둘러보세요.`;
}
