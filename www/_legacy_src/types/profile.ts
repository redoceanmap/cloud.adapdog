export interface UserProfile {
  avatarUrl: string | null;
  avatarPresetId: string | null;
  statusMessage: string;
  interestTags: string[];
}

export interface AvatarPreset {
  id: string;
  label: string;
  emoji: string;
  ringClass: string;
  bgClass: string;
}

export interface InterestTagOption {
  id: string;
  label: string;
}
