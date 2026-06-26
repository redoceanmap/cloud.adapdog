"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUTH_CHANGE_EVENT,
  loadAuthToken,
  loadAuthUser,
  saveAuthUser,
  type AuthUser,
} from "@/lib/auth";
import { fetchMyAccount, logout, verifyAuthWithRetry } from "@/lib/auth-api";

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setReady(false);

    const token = loadAuthToken();
    const stored = loadAuthUser();
    if (!token || !stored) {
      if (token || stored) logout();
      setUser(null);
      setReady(true);
      return;
    }

    try {
      const status = await verifyAuthWithRetry();
      if (status !== "valid") {
        logout();
        setUser(null);
        setReady(true);
        return;
      }

      const account = await fetchMyAccount();
      const nextUser = account ?? stored;
      saveAuthUser(nextUser);
      setUser(nextUser);
    } catch {
      logout();
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const onAuthChange = () => {
      void refresh();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  }, [refresh]);

  return { user, ready, refresh };
}
