import type { ItineraryStop, Pet, PlannerCourse, RoutePlanResponse } from "@/lib/planner-api";
import type { PetPlace } from "@/lib/planner-api";

export interface CourseAddStop {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  day?: number;
  time_slot?: string;
  clock?: string;
  is_meal?: boolean;
}

function normPlaceName(name: string): string {
  return name.trim().replace(/\s+/g, "");
}

export function dedupeStops<T extends { name: string; latitude: number; longitude: number }>(
  stops: T[],
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const s of stops) {
    const key = `${normPlaceName(s.name)}|${s.latitude.toFixed(5)}|${s.longitude.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

export function dedupeRoutePlan(course: RoutePlanResponse): RoutePlanResponse {
  const stops = dedupeStops(course.stops);
  if (stops.length === course.stops.length) return course;
  const withOrder = stops.map((s, i) => ({
    ...s,
    order: i + 1,
    distance_from_prev_km:
      i === 0 ? 0 : Math.round(haversineKm(stops[i - 1], s) * 100) / 100,
  }));
  return { ...course, stops: withOrder, stop_count: withOrder.length };
}

function haversineKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLa = toRad(b.latitude - a.latitude);
  const dLo = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function localStopReason(category: string): string {
  const c = category || "";
  if (/박물관|미술관|전시|유산원|문화원|과학관/.test(c)) {
    return "실내 전시가 있어 더위에 약한 아이가 시원하게 둘러보기 좋아요.";
  }
  if (/공원|호수|정원|수목|산책|둘레|천|강/.test(c)) {
    return "평지 야외라 목줄 산책하기 좋아요. 그늘·급수를 확인하세요.";
  }
  if (/카페|식당|맛집|음식/.test(c)) {
    return "동반석이 있어 함께 쉬어가기 좋아요.";
  }
  return "반려동물 동반 가능으로 등록된 곳이에요.";
}

export function plannerCourseToRoutePlan(course: PlannerCourse, pet: Pet): RoutePlanResponse {
  return {
    region: course.region,
    pet_size: pet.size,
    stop_count: course.stops.length,
    total_distance_km: 0,
    summary: course.summary ?? course.prompt_text,
    stops: course.stops.map((s, i) => ({
      order: s.order || i + 1,
      name: s.name,
      category: s.category,
      latitude: s.latitude,
      longitude: s.longitude,
      distance_from_prev_km: 0,
      similarity: 0,
      reason: localStopReason(s.category),
      source: "한국문화정보원 펫동반 문화시설",
    })),
    recommended_trails: [],
  };
}

export function withCourseEdits(
  course: RoutePlanResponse | null,
  removed: string[],
  added: CourseAddStop[],
): RoutePlanResponse | null {
  if (!course) return course;
  const kept = course.stops.filter((s) => !removed.includes(s.name));
  const extra = added
    .filter((p) => !removed.includes(p.name) && !kept.some((s) => s.name === p.name))
    .map((p) => ({
      order: 0,
      name: p.name,
      category: p.category,
      latitude: p.latitude,
      longitude: p.longitude,
      distance_from_prev_km: 0,
      similarity: 0,
      reason: localStopReason(p.category),
      source: "한국문화정보원 펫동반 문화시설",
      day: p.day ?? 1,
      time_slot: (p.time_slot ?? "morning") as RoutePlanResponse["stops"][0]["time_slot"],
      clock: p.clock ?? "",
      is_meal: p.is_meal ?? false,
    }));
  const merged = dedupeStops([...kept, ...extra]);
  const stops = merged.map((s, i) => ({
    ...s,
    order: i + 1,
    distance_from_prev_km:
      i === 0 ? 0 : Math.round(haversineKm(merged[i - 1], s) * 100) / 100,
  }));
  return { ...course, stops, stop_count: stops.length };
}

const RECOMMEND_INTENT = /추천|다른|대신|뭐가|좋을|힘들|지치|지칠|쉬어|쉴|어때|골라|바꿔줘|말고/;
const DEDUPE_INTENT = /중복|같은\s*곳|똑같은|두\s*번|한번\s*더/;

export function wantsDedupeIntent(text: string): boolean {
  return DEDUPE_INTENT.test(text);
}

export function parseCourseEdit(
  text: string,
  courseNames: string[],
  pool: PetPlace[],
): { action: "add"; place: PetPlace } | { action: "remove"; name: string } | null {
  const t = text.trim();
  const clean = (s: string) =>
    s.replace(/[을를은는이가,.\s]+$/g, "").replace(/^(그|이|저)\s+/, "").trim();
  const norm = (s: string) => s.replace(/\s+/g, "");
  const rm = t.match(/(.+?)\s*(?:은|는|을|를|이|가)?\s*(?:빼|제외|삭제|지워|제거|빼줘|빼주)/);
  if (rm) {
    const nq = norm(clean(rm[1]));
    const hit = nq
      ? courseNames.find((n) => {
          const nn = norm(n);
          return nn.includes(nq) || nq.includes(nn);
        })
      : undefined;
    if (hit) return { action: "remove", name: hit };
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
    const hit = nq
      ? pool.find((p) => {
          const nn = norm(p.name);
          return nn.includes(nq) || nq.includes(nn);
        })
      : undefined;
    if (hit) return { action: "add", place: hit };
  }
  return null;
}

export function wantsRecommendIntent(text: string): boolean {
  return RECOMMEND_INTENT.test(text);
}

export function routeStopsToItinerary(
  stops: RoutePlanResponse["stops"],
): ItineraryStop[] {
  return stops.map((s) => ({
    order: s.order,
    name: s.name,
    category: s.category,
    latitude: s.latitude,
    longitude: s.longitude,
  }));
}

export interface LiveStop extends ItineraryStop {
  reason?: string;
  source?: string;
}

export function routeStopsToLiveStops(stops: RoutePlanResponse["stops"]): LiveStop[] {
  return stops.map((s) => ({
    order: s.order,
    name: s.name,
    category: s.category,
    latitude: s.latitude,
    longitude: s.longitude,
    reason: s.reason,
    source: s.source,
  }));
}
