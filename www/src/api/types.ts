// 백엔드 OpenAPI 스키마 대응 타입.

export interface BreedPreview {
  breed: string;
  size: string;
  traits: string[];
  temperament: string;
}

export interface PetPlace {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  allowed_sizes: string[];
}

export interface RoutePlanRequest {
  region: string;
  days: number;
  pet_size: string;
  pet_breed: string;
}

export interface RouteStop {
  order: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance_from_prev_km: number;
  similarity: number;
  reason?: string;
  source?: string;
  day?: number;                                 // 며칠째(1부터). 백엔드 생성 코스에만
  time_slot?: 'morning' | 'lunch' | 'afternoon' | 'dinner';   // 시간대 블록. 백엔드 생성 코스에만
  clock?: string;                               // 기준 시각 "HH:MM"
  is_meal?: boolean;                            // 식사(음식점) 정류장 여부
  is_mock?: boolean;                            // 목업(MVP 데모용 예시) 정류장 여부 — 실데이터 부족분
  image_url?: string | null;                    // 음식점 썸네일 URL
  phone?: string | null;                        // 음식점 대표 전화
  address?: string | null;                      // 음식점 주소
}

export interface LodgingPlace {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  source?: string;
}

export interface Stopover {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  reason?: string;
  source?: string;
}

export interface RoutePlanResponse {
  region: string;
  pet_size: string;
  stop_count: number;
  total_distance_km: number;
  summary: string;
  stops: RouteStop[];
  recommended_trails: unknown[];
  lodging?: LodgingPlace[];
  stopovers?: Stopover[];
}

// ── 대화형 동선 플래너(route-planner/chat) ──
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** 대화로 채워지는 누적 여정 상태 — 매 요청에 직전 값을 다시 보낸다(서버 무상태). */
export interface TripPlan {
  origin: string;
  destination: string | null;
  transport: 'ktx' | 'bus' | 'car' | 'unset';
  departure_time: string | null; // 서울 출발시각 "HH:MM"(미정이면 null)
  lodging: 'overnight' | 'daytrip' | 'unset';
  nights: number; // 묵는 박 수(0=당일치기)
  stage: 'ask_destination' | 'ask_transport' | 'ask_departure_time' | 'ask_lodging' | 'ready';
  lodging_pref?: string | null; // 숙소 취향·위치(선택)
  interests?: string | null;    // 여행 스타일(선택)
  pet_mobility?: string | null; // 이동 성향(선택)
}

export interface RouteChatResponse {
  reply: string;
  plan: TripPlan;
  suggestions: string[];
  course: RoutePlanResponse | null;
}

/** 정류장 스왑 대안 — 같은 종류의 다른 펫동반 장소(대상과의 거리 포함). */
export interface Alternative {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  reason: string;
  distance_km: number;
}

/** 정류장 스왑 응답 — 대상 자리에 갈 같은 종류 대안들(거리순) + 더 멀리 페이지 안내. */
export interface SwapAlternativesResponse {
  reply: string;
  target_name: string;
  alternatives: Alternative[];
  next_offset: number;
  has_more: boolean;
}

// ── 시설 후기(review) ──
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

export interface EntryCheckRequest {
  region: string;
  place_name: string;
  pet_name: string;
  pet_size: string;
}

export interface EntryAlternative {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}

export interface EntryVerdictResult {
  place_name: string;
  pet_name: string;
  verdict: 'allowed' | 'conditional' | 'denied';
  conditions: string[];
  message: string;
  alternatives?: EntryAlternative[];
}

export interface CohortPlace {
  facility_id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  road_address: string;
  score: number;
}

/** 발자국 — 반려동물이 실제로 다녀온 시설(방문기록 집계, 실좌표). */
export interface VisitedPlace {
  facility_id: number;
  name: string;
  category: string | null;
  latitude: number;
  longitude: number;
  region: string | null;
  road_address: string | null;
  visit_count: number;
  first_visited_at: string | null;
}

// ── 둘러보기(E) ──
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
  route_info: string;
}

export interface StampSpot {
  id: number;
  name: string;
  region: string;
  theme: string;
}

// ── 온보딩(A·B) ──
export interface BreedPrediction {
  id: number;
  pet_id: number;
  candidate_breed: string;
  similarity: number;
  rank: number;
}

export interface PetPersona {
  pet_id: number;
  intro_text: string;
  hero_image_url: string;
  mascot_image_url: string;
  tone: string;
  created_at: string;
}

// ── 여행 진행(D) ──
export interface CareReminder {
  id: number;
  pet_id: number;
  type: string;
  label: string;
  interval_min: number;
  scheduled_time: string;
  enabled: boolean;
}

export interface AudioGuide {
  id: number;
  facility_id: number;
  language: string;
  script_text: string;
  audio_url: string;
}

export interface SymptomCheck {
  id: number;
  pet_id: number;
  symptom_text: string;
  ai_result_text: string;
  severity: string;
  is_diagnostic: boolean;
  created_at: string;
}

// ── 안전·위험 알리미(D 병원) ──
export interface SafetyCheckRequest {
  region: string;
  pet_breed?: string;
  pet_size: string;
  latitude?: number;
  longitude?: number;
}

export interface SafetyAlertResult {
  region: string;
  temperature_c: number;
  condition: string;
  risk_level: string;
  reasons: string[];
  hospital_count: number;
  nearest_hospital: string | null;
  nearest_hospital_km: number | null;
}

// 응급 동물병원 (행안부 표준데이터)
export interface AnimalHospital {
  name: string;
  latitude: number;
  longitude: number;
  phone: string;
  road_address: string;
  is_24h: boolean;
  is_open: boolean;
  distance_km: number | null;
}

export interface AnimalHospitalList {
  region: string;
  total: number;
  hospitals: AnimalHospital[];
}

export interface NearbyHospitalRequest {
  region?: string;
  latitude?: number;
  longitude?: number;
  open_only?: boolean;
  limit?: number;
}

// ── 코스 저장(C) ──
export interface ItineraryStop {
  order: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

export interface Itinerary {
  id: number;
  pet_id: number;
  title: string;
  region: string;
  prompt_text: string;
  is_saved: boolean;
  created_at: string;
  stops: ItineraryStop[];
}

export interface Reservation {
  id: number;
  itinerary_id: number;
  pet_id: number;
  type: string;
  place_name: string;
  party_size: number;
  price: string;
  status: string;
  reserved_at: string;
}

export interface PetStamp {
  pet_id: number;
  stamp_spot_id: number;
  spot_name: string;
  collected_at: string;
}

// ── 이동약자 배려(inclusive-filter) ──
export interface InclusivePlace {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  accessibility: string[];
}

export interface InclusiveFilterResult {
  region: string;
  pet_size: string;
  count: number;
  places: InclusivePlace[];
}

// ── 동반 규정 배지(policy-card) ──
export interface PolicyBadge {
  code: string;
  label: string;
}

export interface PolicyCardResult {
  source_text: string;
  badges: PolicyBadge[];
}
