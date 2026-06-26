import { Camera, User } from 'lucide-react';
import { AVATAR_PRESETS } from '@/data/profileOptions';
import type { UserProfile } from '@/types/profile';

interface ProfileAvatarProps {
  profile: UserProfile;
  size?: 'md' | 'lg';
  editable?: boolean;
  onEdit?: () => void;
}

export function ProfileAvatar({ profile, size = 'lg', editable = false, onEdit }: ProfileAvatarProps) {
  const preset = AVATAR_PRESETS.find((item) => item.id === profile.avatarPresetId);
  const sizeClass = size === 'lg' ? 'h-16 w-16' : 'h-14 w-14';
  const iconSize = size === 'lg' ? 32 : 26;

  const content = profile.avatarUrl ? (
    <img src={profile.avatarUrl} alt="프로필" className="h-full w-full object-cover" />
  ) : preset ? (
    <span className="text-3xl">{preset.emoji}</span>
  ) : (
    <User size={iconSize} />
  );

  if (!editable) {
    return (
      <div
        className={`flex ${sizeClass} items-center justify-center overflow-hidden rounded-full bg-brand-100 text-brand-600 ring-4 ring-white/80`}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEdit}
      className={`group relative ${sizeClass} shrink-0 overflow-hidden rounded-full bg-brand-100 text-brand-600 ring-4 ring-white/80 transition hover:ring-brand-200`}
      aria-label="프로필 사진 변경"
    >
      {content}
      <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow-md ring-2 ring-white">
        <Camera size={12} />
      </span>
    </button>
  );
}
