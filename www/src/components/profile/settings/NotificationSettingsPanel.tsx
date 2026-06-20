import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import type { NotificationSettings } from '@/types/settings';
import {
  loadNotificationSettings,
  saveNotificationSettings,
} from '@/utils/settingsStorage';
import { SettingsGroup, SettingsSheet } from './SettingsSheet';

interface NotificationSettingsPanelProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export function NotificationSettingsPanel({
  isOpen,
  userId,
  onClose,
}: NotificationSettingsPanelProps) {
  const [settings, setSettings] = useState<NotificationSettings>(() =>
    loadNotificationSettings(userId),
  );

  useEffect(() => {
    if (!isOpen) return;
    setSettings(loadNotificationSettings(userId));
  }, [isOpen, userId]);

  const update = (patch: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveNotificationSettings(userId, next);
      return next;
    });
  };

  return (
    <SettingsSheet
      isOpen={isOpen}
      title="알림 설정"
      subtitle="반려견과 함께하는 일상을 놓치지 않도록 알려드려요"
      onClose={onClose}
    >
      <SettingsGroup>
        <ToggleSwitch
          label="산책 시간 알림"
          description="날씨가 좋을 때 산책 시간을 알려드려요"
          checked={settings.walkReminder}
          onChange={(walkReminder) => update({ walkReminder })}
        />
        <ToggleSwitch
          label="활동 알림"
          description="여행 기록에 좋아요·댓글이 달리면 알려드려요"
          checked={settings.activityUpdates}
          onChange={(activityUpdates) => update({ activityUpdates })}
        />
        <ToggleSwitch
          label="폭염·주의보 알림"
          description="반려견에게 위험한 날씨일 때 실시간으로 알려드려요"
          checked={settings.weatherAlerts}
          onChange={(weatherAlerts) => update({ weatherAlerts })}
        />
      </SettingsGroup>
    </SettingsSheet>
  );
}
