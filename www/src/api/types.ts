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
}

export interface RoutePlanResponse {
  region: string;
  pet_size: string;
  stop_count: number;
  total_distance_km: number;
  summary: string;
  stops: RouteStop[];
  recommended_trails: unknown[];
}

export interface EntryCheckRequest {
  region: string;
  place_name: string;
  pet_name: string;
  pet_size: string;
}

export interface EntryVerdictResult {
  place_name: string;
  pet_name: string;
  verdict: 'allowed' | 'conditional' | 'denied';
  conditions: string[];
  message: string;
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

// ── 꾸미기(F) ──
export interface DecorationTemplate {
  id: number;
  name: string;
  theme: string;
  thumbnail_url: string;
  source: string;
}

// ── 브이로그(G) ──
export interface VlogClip {
  seq: number;
  source_type: string;
  media_url: string;
}

export interface Vlog {
  id: number;
  pet_id: number;
  itinerary_id: number;
  tone: string;
  video_url: string;
  created_at: string;
  clips: VlogClip[];
}

// ── 커뮤니티(H) ──
export interface CommunityPost {
  id: number;
  account_id: number;
  pet_id: number;
  itinerary_id: number;
  title: string;
  body: string;
  created_at: string;
  like_count: number;
}

export interface YearSummary {
  id: number;
  pet_id: number;
  year: number;
  total_distance_km: number;
  places_count: number;
  story_text: string;
  created_at: string;
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
