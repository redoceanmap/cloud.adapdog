import type { AvatarPreset, InterestTagOption } from '@/types/profile';

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'paw', label: '발자국', emoji: '🐾', ringClass: 'ring-brand-200', bgClass: 'bg-brand-50' },
  { id: 'dog', label: '멍멍이', emoji: '🐶', ringClass: 'ring-amber-200', bgClass: 'bg-amber-50' },
  { id: 'cat', label: '냥이', emoji: '🐱', ringClass: 'ring-orange-200', bgClass: 'bg-canvas' },
  { id: 'beach', label: '바다', emoji: '🏖️', ringClass: 'ring-sky-200', bgClass: 'bg-sky-50' },
  { id: 'coffee', label: '카페', emoji: '☕', ringClass: 'ring-stone-200', bgClass: 'bg-stone-50' },
  { id: 'mountain', label: '산책', emoji: '🌲', ringClass: 'ring-emerald-200', bgClass: 'bg-emerald-50' },
];

export const INTEREST_TAG_OPTIONS: InterestTagOption[] = [
  { id: 'walk', label: '산책' },
  { id: 'cafe', label: '카페' },
  { id: 'food', label: '맛집' },
  { id: 'beach', label: '해변' },
  { id: 'lodging', label: '숙소' },
  { id: 'culture', label: '문화' },
  { id: 'nature', label: '자연' },
  { id: 'photo', label: '포토' },
];

export const DEFAULT_STATUS_PLACEHOLDER = '반려견과 함께하는 여행을 기록해요';
