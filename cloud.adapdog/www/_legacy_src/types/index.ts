export type PettiquetteLevel = 'allowed' | 'restricted' | 'not_allowed';

export type AccessibilityLevel = 'full' | 'partial' | 'none';

export interface PettiquettePolicy {
  level: PettiquetteLevel;
  label: string;
  description?: string;
}

export interface AccessibilityInfo {
  level: AccessibilityLevel;
  label: string;
  features: string[];
}

export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  pettiquette: PettiquettePolicy;
  accessibility: AccessibilityInfo;
  rating?: number;
  /** 숙소 등 외부 예약 페이지 딥링크 (야놀자, 네이버 예약 등) */
  reservationUrl?: string;
}

export type ActivityLevel = 'low' | 'moderate' | 'high';

export interface RegisteredDog {
  id: string;
  name: string;
  photoUrl: string;
  breed: string;
  age: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  traits: string[];
  personality: string;
}

export interface DogProfile {
  name: string;
  age: number;
  activityLevel: ActivityLevel;
  breed?: string;
  weightKg?: number;
  imageUrl?: string;
}

export interface AiAnalysisResult {
  breed: string;
  weightKg: number;
  confidence: number;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type PlaceCategory = 'all' | 'cafe' | 'beach' | 'lodging' | 'restaurant' | 'park';

export type CourseStopStatus = 'allowed' | 'conditional' | 'denied';

export interface CourseStopTag {
  icon: 'leash' | 'indoor' | 'outdoor' | 'carrier' | 'bag';
  label: string;
}

export interface CourseStop {
  id: string;
  order: number;
  day: 1 | 2;
  name: string;
  category: string;
  lat: number;
  lng: number;
  stayDuration: string;
  distanceToNext: string;
  tags: CourseStopTag[];
  status: CourseStopStatus;
  statusMessage: string;
}

export interface TravelCourse {
  id: string;
  title: string;
  region: string;
  totalDays: number;
  totalDistanceKm: number;
  stops: CourseStop[];
}

export type RecommendedCourseBadge = 'recommended' | 'barrier-free' | 'custom';

export interface RecommendedCourse {
  id: string;
  title: string;
  region: string;
  badge: RecommendedCourseBadge;
  badgeLabel: string;
  highlights: string[];
  tags: string[];
  gradient: 'orange' | 'green' | 'sky' | 'rose' | 'violet';
  course: TravelCourse;
}

export interface PersonalizedCourse extends RecommendedCourse {
  matchScore: number;
  matchReason: string;
  rank: number;
}

export interface RecordPost {
  id: string;
  authorName: string;
  dogName: string;
  breed: string;
  likes: number;
  comments: number;
  location: string;
  caption: string;
  courseTitle: string;
  photoUrl?: string;
}

export interface SafetyInfo {
  temperatureC: number;
  humidity: number;
  uvLevel: 'low' | 'moderate' | 'high';
  heatWarning: string;
  breedWarning: string;
  breedWarningDetail: string;
}
