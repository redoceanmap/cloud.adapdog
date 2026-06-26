/** www App.tsx LIGHT/DARK 팔레트 — 플래너 워크벤치 전용 CSS 변수 */

export const PLANNER_THEME_STORAGE_KEY = "pawprint-planner-dark";

export const PLANNER_LIGHT = {
  bg: "#f8f9fb",
  panel: "#ffffff",
  "panel-2": "#f6f7f9",
  border: "#eaecef",
  line: "#f0f1f4",
  text: "#181a1f",
  muted: "#8a8f98",
  faint: "#b5b9c0",
  accent: "#3b5bfe",
  "accent-soft": "#eef1ff",
  chip: "#f3f4f6",
  hover: "#f2f3f5",
  map: "#eef1f5",
  "ai-bubble": "#f2f3f6",
  shadow: "0 8px 30px rgba(20,22,40,.08)",
} as const;

export const PLANNER_DARK = {
  bg: "#08080a",
  panel: "#101014",
  "panel-2": "#17171b",
  border: "#26262b",
  line: "#1f1f24",
  text: "#f1f2f5",
  muted: "#888b93",
  faint: "#5a5c63",
  accent: "#3b82f6",
  "accent-soft": "#15233f",
  chip: "#1b1b20",
  hover: "#1e1e24",
  map: "#0c0c0f",
  "ai-bubble": "#1a1a1f",
  shadow: "0 8px 30px rgba(0,0,0,.4)",
} as const;

export function loadPlannerDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PLANNER_THEME_STORAGE_KEY) === "1";
}

export function savePlannerDarkMode(dark: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANNER_THEME_STORAGE_KEY, dark ? "1" : "0");
}
