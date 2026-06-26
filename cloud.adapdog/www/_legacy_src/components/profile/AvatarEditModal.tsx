import { useEffect, useRef, useState } from 'react';
import { Camera, Check, PawPrint, X } from 'lucide-react';
import { AVATAR_PRESETS } from '@/data/profileOptions';
import type { UserProfile } from '@/types/profile';

interface AvatarEditModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (next: Pick<UserProfile, 'avatarUrl' | 'avatarPresetId'>) => void;
}

export function AvatarEditModal({ isOpen, profile, onClose, onSave }: AvatarEditModalProps) {
  const [draftUrl, setDraftUrl] = useState<string | null>(profile.avatarUrl);
  const [draftPresetId, setDraftPresetId] = useState<string | null>(profile.avatarPresetId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraftUrl(profile.avatarUrl);
    setDraftPresetId(profile.avatarPresetId);
  }, [isOpen, profile.avatarUrl, profile.avatarPresetId]);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : null;
      if (!url) return;
      setDraftUrl(url);
      setDraftPresetId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePresetSelect = (presetId: string) => {
    setDraftPresetId(presetId);
    setDraftUrl(null);
  };

  const handleApply = () => {
    onSave({ avatarUrl: draftUrl, avatarPresetId: draftPresetId });
    onClose();
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-edit-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <PawPrint size={20} />
            <h2 id="avatar-edit-title" className="font-bold text-ink">
              프로필 사진 변경
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line/60"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
        >
          <Camera size={16} />
          사진 업로드
        </button>

        <p className="mb-3 text-xs font-semibold text-ink-muted">기본 아바타</p>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {AVATAR_PRESETS.map((preset) => {
            const selected = !draftUrl && draftPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition ${
                  selected ? 'bg-brand-50 ring-2 ring-brand-400' : 'bg-surface-muted hover:bg-canvas'
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ring-2 ${preset.bgClass} ${preset.ringClass}`}
                >
                  {preset.emoji}
                </span>
                <span className="text-[11px] font-medium text-ink-muted">{preset.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
        >
          <Check size={16} />
          적용하기
        </button>
      </div>
    </>
  );
}
