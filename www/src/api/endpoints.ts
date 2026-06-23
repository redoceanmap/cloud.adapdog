// 데모 핵심 경로 엔드포인트 래퍼.
import { apiGet, apiPost } from './client';
import type {
  AudioGuide,
  BreedPrediction,
  BreedPreview,
  CareReminder,
  CohortPlace,
  CommunityPost,
  DecorationTemplate,
  EntryCheckRequest,
  EntryVerdictResult,
  Festival,
  InclusiveFilterResult,
  Itinerary,
  PetPersona,
  PetPlace,
  PetStamp,
  PolicyCardResult,
  Reservation,
  RoutePlanRequest,
  RoutePlanResponse,
  SafetyAlertResult,
  SafetyCheckRequest,
  StampSpot,
  SymptomCheck,
  Vlog,
  WalkingTrail,
  YearSummary,
} from './types';

/** A5 견종 자동분류 — 견종명으로 표준 크기·기질 조회. */
export const previewBreed = (breed: string) =>
  apiGet<BreedPreview>(`/users/breed-catalog/${encodeURIComponent(breed)}`);

/** C2 시설 검색 — 지역 기준 반려동물 동반 가능 시설. */
export const searchPlaces = (region: string) =>
  apiGet<PetPlace[]>(`/map/pet-place/search?region=${encodeURIComponent(region)}`);

/** C1→C2 동선 플래너 — 프롬프트 조건으로 코스 생성(LLM). */
export const planRoute = (req: RoutePlanRequest) =>
  apiPost<RoutePlanResponse>('/map/route-planner/plan', req);

/** C5 입장 판정 — 시설×반려동물 규칙 기반 판정. */
export const checkEntry = (req: EntryCheckRequest) =>
  apiPost<EntryVerdictResult>('/map/entry-verdict/check', req);

/** C12 닮은 친구 추천 — 코호트(같은 크기·체질) 누적 행동 기반 인기 시설. */
export const cohortRecommendation = (size: string, limit = 4) =>
  apiGet<CohortPlace[]>(
    `/map/cohort-recommendation?size=${encodeURIComponent(size)}&limit=${limit}`,
  );

// ── 둘러보기(E) ──
/** E1/E2 축제 캘린더·리스트. */
export const getFestivals = (region = '전주') =>
  apiGet<Festival[]>(`/map/festival?region=${encodeURIComponent(region)}`);

/** E3 걷기 코스(둘레길). */
export const getTrails = (region = '전주') =>
  apiGet<WalkingTrail[]>(`/map/walking-trail?region=${encodeURIComponent(region)}`);

/** E4 문화시설 스탬프. */
export const getStamps = (region = '전주') =>
  apiGet<StampSpot[]>(`/map/stamp-spot?region=${encodeURIComponent(region)}`);

// ── 온보딩(A·B) ──
/** A4 견종 인식 후보 (닮은 친구 %). */
export const getBreedPredictions = (petId: number) =>
  apiGet<BreedPrediction[]>(`/users/breed-prediction?pet_id=${petId}`);

/** B 페르소나(1:1). */
export const getPersona = (petId: number) =>
  apiGet<PetPersona>(`/users/pet-persona?pet_id=${petId}`);

// ── 여행 진행(D) ──
/** D2 케어 알림. */
export const getCareReminders = (petId: number) =>
  apiGet<CareReminder[]>(`/care/care-reminder?pet_id=${petId}`);

/** D4 오디오 가이드. */
export const getAudioGuides = (facilityId: number) =>
  apiGet<AudioGuide[]>(`/map/audio-guide?facility_id=${facilityId}`);

/** D6~D9 응급 증상 체크(참고용·진단 아님). */
export const getSymptomChecks = (petId: number) =>
  apiGet<SymptomCheck[]>(`/care/symptom-check?pet_id=${petId}`);

/** D 안전·위험 알리미 — 지역 날씨 위험도 + 최근접 동물병원. */
export const checkSafety = (req: SafetyCheckRequest) =>
  apiPost<SafetyAlertResult>('/map/safety-alert/check', req);

// ── 코스 저장(C) ──
/** C 저장된 추천 코스. */
export const getItineraries = (petId: number) =>
  apiGet<Itinerary[]>(`/trips/itinerary?pet_id=${petId}`);

/** C10/C11 식당·숙소 예약 목록. */
export const getReservations = (petId: number) =>
  apiGet<Reservation[]>(`/trips/reservation?pet_id=${petId}`);

// ── 꾸미기(F) ──
/** F1/F4 꾸미기 템플릿 갤러리. */
export const getDecorationTemplates = () =>
  apiGet<DecorationTemplate[]>('/creative/decoration-template');

// ── 브이로그(G) ──
/** G 강아지 시점 브이로그(클립 포함). */
export const getVlogs = (petId: number) =>
  apiGet<Vlog[]>(`/creative/vlog?pet_id=${petId}`);

// ── 커뮤니티(H) ──
/** H1/H2 코스 후기 피드. */
export const getCommunityPosts = () =>
  apiGet<CommunityPost[]>('/community/community-post');

/** H5 연말 결산. */
export const getYearSummary = (petId: number) =>
  apiGet<YearSummary[]>(`/community/year-summary?pet_id=${petId}`);

/** H4 수집 스탬프(펫 패스포트). */
export const getPetStamps = (petId: number) =>
  apiGet<PetStamp[]>(`/users/pet-stamp?pet_id=${petId}`);

/** 이동약자 배려 — 펫 동반 ∩ 무장애 교차 시설(실 배리어프리 DB). */
export const searchInclusive = (region: string, petSize = 'large', features: string[] = []) =>
  apiPost<InclusiveFilterResult>('/map/inclusive-filter/search', {
    region,
    pet_size: petSize,
    required_features: features,
  });

/** 동반 규정 배지 — 규정 원문을 AI가 배지로 파싱. */
export const parsePolicy = (text: string) =>
  apiPost<PolicyCardResult>('/map/policy-card/parse', { text });
