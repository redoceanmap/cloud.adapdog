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
  day?: number;
  time_slot?: RouteStop["time_slot"];
  clock?: string;
  is_meal?: boolean;
}

export interface RouteStop extends ItineraryStop {
  distance_from_prev_km: number;
  similarity: number;
  reason?: string;
  source?: string;
  day?: number;
  time_slot?: "morning" | "lunch" | "afternoon" | "dinner";
  clock?: string;
  is_meal?: boolean;
  is_mock?: boolean;
  image_url?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface RoutePlanResponse {
  region: string;
  pet_size: string;
  stop_count: number;
  total_distance_km: number;
  summary: string;
  stops: RouteStop[];
  recommended_trails: unknown[];
  lodging?: { name: string; category: string; latitude: number; longitude: number; source?: string }[];
  stopovers?: { name: string; category: string; latitude: number; longitude: number; reason?: string; source?: string }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TripPlan {
  origin: string;
  destination: string | null;
  transport: "ktx" | "bus" | "car" | "unset";
  lodging: "overnight" | "daytrip" | "unset";
  nights: number;
  stage: "ask_destination" | "ask_transport" | "ask_lodging" | "ready";
}

export interface RouteChatResponse {
  reply: string;
  plan: TripPlan;
  suggestions: string[];
  course: RoutePlanResponse | null;
}

export interface PetPlace {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  allowed_sizes: string[];
}

export interface Review {
  id: number;
  facility_id: number;
  place_name: string;
  title: string;
  body: string;
  rating: number;
  author: string;
  source: string;
}

export interface EntryVerdictResult {
  place_name: string;
  pet_name: string;
  verdict: "allowed" | "conditional" | "denied";
  conditions: string[];
  message: string;
  alternatives?: {
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    distance_km: number;
  }[];
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

interface RoutePlanApiResponse {
  region: string;
  pet_size: string;
  stop_count: number;
  total_distance_km: number;
  summary: string;
  stops: ItineraryStop[];
}

export function petTraitsText(pet: Pet): string {
  const parts = [
    sizeLabel(pet.size),
    ...pet.traits,
    pet.temperament !== "정보 없음" ? pet.temperament : "",
  ].filter(Boolean);
  return parts.join(", ");
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

export async function saveItinerary(
  pet: Pet,
  course: RoutePlanResponse,
  options?: { title?: string; promptText?: string },
): Promise<PlannerCourse> {
  if (!course.stops.length) {
    throw new Error("저장할 장소가 없습니다.");
  }
  const body = {
    pet_id: pet.id,
    title: options?.title ?? `${course.region} 펫 동반 코스`,
    region: course.region,
    prompt_text: options?.promptText ?? course.summary ?? "",
    stops: course.stops.map((s) => ({
      order: s.order,
      name: s.name,
      category: s.category,
      latitude: s.latitude,
      longitude: s.longitude,
      day: s.day,
      time_slot: s.time_slot,
      clock: s.clock,
      is_meal: s.is_meal,
    })),
  };
  const res = await apiFetch("/trips/itinerary", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  return res.json() as Promise<PlannerCourse>;
}

export async function updateItinerary(
  itineraryId: number,
  pet: Pet,
  course: RoutePlanResponse,
  options?: { title?: string; promptText?: string },
): Promise<PlannerCourse> {
  if (!course.stops.length) {
    throw new Error("저장할 장소가 없습니다.");
  }
  const res = await apiFetch(`/trips/itinerary/${itineraryId}`, {
    method: "PUT",
    body: JSON.stringify({
      pet_id: pet.id,
      title: options?.title ?? `${course.region} 펫 동반 코스`,
      region: course.region,
      prompt_text: options?.promptText ?? course.summary ?? "",
      stops: course.stops.map((s) => ({
        order: s.order,
        name: s.name,
        category: s.category,
        latitude: s.latitude,
        longitude: s.longitude,
        day: s.day,
        time_slot: s.time_slot,
        clock: s.clock,
        is_meal: s.is_meal,
      })),
    }),
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  return res.json() as Promise<PlannerCourse>;
}

export async function deleteItinerary(itineraryId: number): Promise<void> {
  const res = await apiFetch(`/trips/itinerary/${itineraryId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
}

export async function fetchRecommendedPlan(
  pet: Pet,
  region: string,
): Promise<PlannerCourse> {
  if (!region.trim()) {
    throw new Error("추천 코스를 만들 지역을 지정해 주세요.");
  }
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

  const plan = (await res.json()) as RoutePlanApiResponse;
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

export async function chatRoute(
  messages: ChatMessage[],
  pet: Pet,
  plan?: TripPlan | null,
): Promise<RouteChatResponse> {
  const res = await apiFetch("/map/route-planner/chat", {
    method: "POST",
    body: JSON.stringify({
      messages,
      plan: plan ?? null,
      pet_size: pet.size,
      pet_breed: pet.breed,
      pet_traits: petTraitsText(pet),
    }),
    timeoutMs: 60_000,
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<RouteChatResponse>;
}

export async function recommendRoute(
  messages: ChatMessage[],
  currentCourse: { name: string; category: string; latitude: number; longitude: number }[],
  pet: Pet,
  plan?: TripPlan | null,
): Promise<RouteChatResponse> {
  const res = await apiFetch("/map/route-planner/recommend", {
    method: "POST",
    body: JSON.stringify({
      messages,
      current_course: currentCourse,
      plan: plan ?? null,
      pet_size: pet.size,
      pet_breed: pet.breed,
      pet_traits: petTraitsText(pet),
    }),
    timeoutMs: 45_000,
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<RouteChatResponse>;
}

export async function searchPlaces(region: string): Promise<PetPlace[]> {
  const res = await apiFetch(`/map/pet-place/search?region=${encodeURIComponent(region)}`);
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<PetPlace[]>;
}

export interface Festival {
  id: number;
  name: string;
  region: string;
  start_date: string;
  end_date: string;
  pet_allowed: boolean;
  source: string;
}

export interface WalkingTrail {
  id: number;
  name: string;
  region: string;
  distance_km: number;
  difficulty: string;
  duration: string;
  description: string;
  route_info?: string;
}

export async function fetchFestivals(region: string): Promise<Festival[]> {
  const res = await apiFetch(`/map/festival?region=${encodeURIComponent(region)}`);
  if (!res.ok) return [];
  return res.json() as Promise<Festival[]>;
}

export async function fetchTrails(region: string): Promise<WalkingTrail[]> {
  const res = await apiFetch(`/map/walking-trail?region=${encodeURIComponent(region)}`);
  if (!res.ok) return [];
  return res.json() as Promise<WalkingTrail[]>;
}

export async function checkEntry(
  region: string,
  placeName: string,
  pet: Pet,
): Promise<EntryVerdictResult> {
  const res = await apiFetch("/map/entry-verdict/check", {
    method: "POST",
    body: JSON.stringify({
      region,
      place_name: placeName,
      pet_name: pet.name,
      pet_size: pet.size,
    }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<EntryVerdictResult>;
}

export async function fetchReviews(placeName: string): Promise<Review[]> {
  const res = await apiFetch(`/map/review?place_name=${encodeURIComponent(placeName)}`);
  if (!res.ok) return [];
  return res.json() as Promise<Review[]>;
}

export interface CareReminder {
  id: number;
  pet_id: number;
  type: string;
  label: string;
  interval_min: number;
  scheduled_time: string;
  enabled: boolean;
}

export interface SafetyAlert {
  region: string;
  temperature_c: number;
  condition: string;
  risk_level: string;
  reasons: string[];
  hospital_count: number;
  nearest_hospital: string | null;
  nearest_hospital_km: number | null;
}

export async function fetchCareReminders(petId: number): Promise<CareReminder[]> {
  const res = await apiFetch(`/care/care-reminder?pet_id=${petId}`);
  if (!res.ok) return [];
  return res.json() as Promise<CareReminder[]>;
}

export async function checkSafetyAlert(pet: Pet, region: string): Promise<SafetyAlert> {
  const res = await apiFetch("/map/safety-alert/check", {
    method: "POST",
    body: JSON.stringify({
      region,
      pet_size: pet.size,
      pet_breed: pet.breed,
    }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<SafetyAlert>;
}

export function sizeLabel(size: string): string {
  const map: Record<string, string> = {
    small: "소형견",
    medium: "중형견",
    large: "대형견",
    unknown: "크기 미정",
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
