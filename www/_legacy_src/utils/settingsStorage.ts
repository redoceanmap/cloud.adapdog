import type { AppSettings, NotificationSettings, PrivacySettings } from '@/types/settings';

const NOTIFICATION_PREFIX = 'pawprint_notification_settings_';
const PRIVACY_PREFIX = 'pawprint_privacy_settings_';
const APP_SETTINGS_KEY = 'pawprint_app_settings';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  walkReminder: true,
  activityUpdates: true,
  weatherAlerts: true,
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  recordVisibility: 'friends',
  locationAccess: true,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  darkMode: false,
};

export function loadNotificationSettings(userId: string): NotificationSettings {
  try {
    const raw = localStorage.getItem(`${NOTIFICATION_PREFIX}${userId}`);
    if (!raw) return { ...DEFAULT_NOTIFICATION_SETTINGS };
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(JSON.parse(raw) as Partial<NotificationSettings>) };
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

export function saveNotificationSettings(userId: string, settings: NotificationSettings): void {
  localStorage.setItem(`${NOTIFICATION_PREFIX}${userId}`, JSON.stringify(settings));
}

export function loadPrivacySettings(userId: string): PrivacySettings {
  try {
    const raw = localStorage.getItem(`${PRIVACY_PREFIX}${userId}`);
    if (!raw) return { ...DEFAULT_PRIVACY_SETTINGS };
    return { ...DEFAULT_PRIVACY_SETTINGS, ...(JSON.parse(raw) as Partial<PrivacySettings>) };
  } catch {
    return { ...DEFAULT_PRIVACY_SETTINGS };
  }
}

export function savePrivacySettings(userId: string, settings: PrivacySettings): void {
  localStorage.setItem(`${PRIVACY_PREFIX}${userId}`, JSON.stringify(settings));
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_APP_SETTINGS };
    return { ...DEFAULT_APP_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
}

export function clearUserLocalData(userId: string): void {
  const keys = [
    `${NOTIFICATION_PREFIX}${userId}`,
    `${PRIVACY_PREFIX}${userId}`,
    `pawprint_user_profile_${userId}`,
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}
