export type RecordVisibility = 'public' | 'friends' | 'private';

export interface NotificationSettings {
  walkReminder: boolean;
  activityUpdates: boolean;
  weatherAlerts: boolean;
}

export interface PrivacySettings {
  recordVisibility: RecordVisibility;
  locationAccess: boolean;
}

export interface AppSettings {
  darkMode: boolean;
}
