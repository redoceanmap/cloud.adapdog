import { loadAppSettings, saveAppSettings } from './settingsStorage';

export function applyTheme(darkMode: boolean): void {
  document.documentElement.classList.toggle('dark', darkMode);
}

export function initTheme(): boolean {
  const { darkMode } = loadAppSettings();
  applyTheme(darkMode);
  return darkMode;
}

export function setDarkMode(enabled: boolean): void {
  const current = loadAppSettings();
  saveAppSettings({ ...current, darkMode: enabled });
  applyTheme(enabled);
}
