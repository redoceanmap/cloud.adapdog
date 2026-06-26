"use client";

import { useCallback, useEffect, useState } from "react";
import { loadPlannerDarkMode, savePlannerDarkMode } from "@/lib/planner-theme";

export function usePlannerTheme() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(loadPlannerDarkMode());
    setReady(true);
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      savePlannerDarkMode(next);
      return next;
    });
  }, []);

  return { dark, toggleDark, ready };
}
