import type { UserProfile } from '@/types/profile';

const STORAGE_PREFIX = 'pawprint_user_profile_';

export const EMPTY_PROFILE: UserProfile = {
  avatarUrl: null,
  avatarPresetId: 'paw',
  statusMessage: '',
  interestTags: [],
};

export function loadUserProfile(userId: string): UserProfile {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return { ...EMPTY_PROFILE };
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveUserProfile(userId: string, profile: UserProfile): boolean {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}
