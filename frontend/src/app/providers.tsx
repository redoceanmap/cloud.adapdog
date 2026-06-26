"use client";

import { AppThemeProvider } from "@/contexts/AppThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>;
}
