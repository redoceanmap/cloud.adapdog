"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadPlannerDarkMode, savePlannerDarkMode } from "@/lib/planner-theme";

interface AppThemeContextValue {
  dark: boolean;
  ready: boolean;
  toggleDark: () => void;
  setDarkMode: (dark: boolean) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(loadPlannerDarkMode());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [dark, ready]);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      savePlannerDarkMode(next);
      return next;
    });
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setDark(value);
    savePlannerDarkMode(value);
  }, []);

  const value = useMemo(
    () => ({ dark, ready, toggleDark, setDarkMode }),
    [dark, ready, toggleDark, setDarkMode],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    return {
      dark: false,
      ready: true,
      toggleDark: () => {},
      setDarkMode: () => {},
    };
  }
  return ctx;
}
