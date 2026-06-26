import { apiFetch, parseApiError } from "@/lib/api";

export interface Pet {
  id: number;
  account_id: number;
  name: string;
  breed: string;
  photo_url: string;
  size: string;
  traits: string[];
  temperament: string;
  gender: string;
  features?: string | null;
}

export interface ItineraryStop {
  order: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

export interface PlannerCourse {
  id: number;
  pet_id: number;
  title: string;
  region: string;
  prompt_text: string;
  is_saved: boolean;
  created_at: string;
  stops: ItineraryStop[];
  summary?: string;
}

interface RoutePlanResponse {
  region: string;
  pet_size: string;
  stop_count: number;
  total_distance_km: number;
  summary: string;
  stops: ItineraryStop[];
}

export async function fetchMyPets(): Promise<Pet[]> {
  const res = await apiFetch("/users/pet/me");
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  return res.json() as Promise<Pet[]>;
}

export async function fetchItineraries(petId: number): Promise<PlannerCourse[]> {
  const res = await apiFetch(`/trips/itinerary?pet_id=${petId}`);
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  return res.json() as Promise<PlannerCourse[]>;
}

export async function fetchRecommendedPlan(
  pet: Pet,
  region = "전주",
): Promise<PlannerCourse> {
  const res = await apiFetch("/map/route-planner/plan", {
    method: "POST",
    body: JSON.stringify({
      region,
      days: 1,
      pet_size: pet.size,
      pet_breed: pet.breed,
    }),
    timeoutMs: 45_000,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const plan = (await res.json()) as RoutePlanResponse;
  return {
    id: 0,
    pet_id: pet.id,
    title: `${plan.region} 펫 동반 추천 코스`,
    region: plan.region,
    prompt_text: plan.summary,
    is_saved: false,
    created_at: new Date().toISOString().slice(0, 10),
    stops: plan.stops,
    summary: plan.summary,
  };
}

export function sizeLabel(size: string): string {
  const map: Record<string, string> = {
    small: "소형견",
    medium: "중형견",
    large: "대형견",
  };
  return map[size] ?? size;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    cafe: "카페",
    sightseeing: "관광",
    park: "공원",
    trail: "둘레길",
    walk: "산책",
    restaurant: "맛집",
    lodging: "숙소",
  };
  return map[category] ?? category;
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    cafe: "☕",
    sightseeing: "🏛️",
    park: "🌳",
    trail: "🐾",
    walk: "🚶",
    restaurant: "🍽️",
    lodging: "🏨",
  };
  return map[category] ?? "📍";
}

export interface MapPoint {
  order: number;
  name: string;
  category: string;
  x: number;
  y: number;
  emoji: string;
}

export function stopsToMapPoints(
  stops: ItineraryStop[],
  width = 300,
  height = 520,
  padding = 48,
): MapPoint[] {
  if (stops.length === 0) return [];

  const lats = stops.map((s) => s.latitude);
  const lngs = stops.map((s) => s.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;

  return stops.map((stop) => ({
    order: stop.order,
    name: stop.name,
    category: stop.category,
    emoji: categoryEmoji(stop.category),
    x: padding + ((stop.longitude - minLng) / lngRange) * (width - padding * 2),
    y: height - padding - ((stop.latitude - minLat) / latRange) * (height - padding * 2),
  }));
}

export function pathFromMapPoints(points: MapPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  rest.forEach((point, index) => {
    const prev = points[index];
    const cx = (prev.x + point.x) / 2;
    d += ` Q ${cx} ${prev.y}, ${point.x} ${point.y}`;
  });
  return d;
}
