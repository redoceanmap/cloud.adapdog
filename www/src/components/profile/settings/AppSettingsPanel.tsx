import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import type { AppSettings } from '@/types/settings';
import { loadAppSettings, saveAppSettings } from '@/utils/settingsStorage';
import { applyTheme } from '@/utils/theme';
import { SettingsGroup, SettingsSheet } from './SettingsSheet';

interface AppSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSettingsPanel({ isOpen, onClose }: AppSettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSettings(loadAppSettings());
    setCacheNotice(null);
  }, [isOpen]);

  const updateDarkMode = (darkMode: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, darkMode };
      saveAppSettings(next);
      applyTheme(darkMode);
      return next;
    });
  };

  const handleClearCache = () => {
    const keepKeys = ['pawprint_auth_user', 'pawprint_auth_token'];
    const preserved: Record<string, string> = {};
    keepKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) preserved[key] = value;
    });
    localStorage.clear();
    Object.entries(preserved).forEach(([key, value]) => localStorage.setItem(key, value));
    saveAppSettings(settings);
    setCacheNotice('캐시를 정리했어요. 앱을 새로고침해 주세요.');
  };

  return (
    <SettingsSheet
      isOpen={isOpen}
      title="앱 설정"
      subtitle="더 편하게 앱을 사용할 수 있도록 환경을 맞춰보세요"
      onClose={onClose}
    >
      <SettingsGroup>
        <ToggleSwitch
          label="다크 모드"
          description={
            settings.darkMode
              ? '어두운 테마로 표시 중이에요. 밤에도 눈이 편해요'
              : '밝은 베이지·에메랄드 테마로 표시 중이에요'
          }
          checked={settings.darkMode}
          onChange={updateDarkMode}
        />
      </SettingsGroup>

      <p className="mb-2 mt-5 px-1 text-xs font-bold text-ink-muted">
        저장 공간
      </p>
      <button
        type="button"
        onClick={handleClearCache}
        className="w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm font-semibold text-ink transition hover:bg-canvas"
      >
        캐시 초기화
      </button>
      {cacheNotice && (
        <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {cacheNotice}
        </p>
      )}

      <p className="mt-6 text-center text-[11px] text-ink-muted">
        발자국 v0.1.0
      </p>
    </SettingsSheet>
  );
}
