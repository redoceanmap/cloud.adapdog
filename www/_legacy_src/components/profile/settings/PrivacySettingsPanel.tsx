import { useEffect, useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import type { RecordVisibility } from '@/types/settings';
import {
  clearUserLocalData,
  loadPrivacySettings,
  savePrivacySettings,
} from '@/utils/settingsStorage';
import { SettingsGroup, SettingsSheet } from './SettingsSheet';

const VISIBILITY_OPTIONS: { value: RecordVisibility; label: string; description: string }[] = [
  { value: 'public', label: '전체 공개', description: '모든 사용자가 내 기록을 볼 수 있어요' },
  { value: 'friends', label: '친구만', description: '친구에게만 기록이 공개돼요' },
  { value: 'private', label: '나만 보기', description: '내 기록은 나만 볼 수 있어요' },
];

interface PrivacySettingsPanelProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  onLogout: () => void;
}

export function PrivacySettingsPanel({
  isOpen,
  userId,
  onClose,
  onLogout,
}: PrivacySettingsPanelProps) {
  const [settings, setSettings] = useState(() => loadPrivacySettings(userId));
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSettings(loadPrivacySettings(userId));
    setDeleteConfirm(false);
  }, [isOpen, userId]);

  const updateVisibility = (recordVisibility: RecordVisibility) => {
    setSettings((prev) => {
      const next = { ...prev, recordVisibility };
      savePrivacySettings(userId, next);
      return next;
    });
  };

  const updateLocationAccess = (locationAccess: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, locationAccess };
      savePrivacySettings(userId, next);
      return next;
    });
  };

  const handleDeleteAccount = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    clearUserLocalData(userId);
    onClose();
    onLogout();
  };

  return (
    <SettingsSheet
      isOpen={isOpen}
      title="개인정보 보호"
      subtitle="반려견 정보와 위치 데이터를 안전하게 관리해요"
      onClose={onClose}
    >
      <p className="mb-2 px-1 text-xs font-bold text-ink-muted">
        여행 기록 공개 범위
      </p>
      <SettingsGroup>
        {VISIBILITY_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition hover:bg-canvas/50 hover:bg-surface-muted/80"
          >
            <input
              type="radio"
              name="record-visibility"
              value={option.value}
              checked={settings.recordVisibility === option.value}
              onChange={() => updateVisibility(option.value)}
              className="mt-1 h-4 w-4 accent-brand-600"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </SettingsGroup>

      <p className="mb-2 mt-5 px-1 text-xs font-bold text-ink-muted">
        위치 정보
      </p>
      <SettingsGroup>
        <ToggleSwitch
          label="위치 정보 접근 허용"
          description="지도·코스 추천을 위해 위치 정보를 사용해요. 언제든 끌 수 있어요"
          checked={settings.locationAccess}
          onChange={updateLocationAccess}
        />
      </SettingsGroup>

      <p className="mb-2 mt-5 px-1 text-xs font-bold text-ink-muted">
        계정
      </p>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface py-3.5 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50"
        >
          <LogOut size={16} />
          로그아웃
        </button>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition ${
            deleteConfirm
              ? 'bg-rose-600 text-white'
              : 'border-2 border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300'
          }`}
        >
          <Trash2 size={16} />
          {deleteConfirm ? '정말 탈퇴할까요? (탭하여 확인)' : '계정 탈퇴'}
        </button>
        {deleteConfirm && (
          <p className="text-center text-xs text-rose-600 dark:text-rose-400">
            로컬에 저장된 프로필·설정 데이터가 삭제됩니다
          </p>
        )}
      </div>
    </SettingsSheet>
  );
}
