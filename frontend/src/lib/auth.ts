export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const TOKEN_KEY = "pawprint_auth_token";
const USER_KEY = "pawprint_auth_user";

export const AUTH_CHANGE_EVENT = "pawprint-auth-change";

export function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function loadAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function loadAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const token = loadAuthToken();
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    if (!token) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  try {
    const prev = localStorage.getItem(USER_KEY);
    const next = user ? JSON.stringify(user) : null;
    if (prev === next) return;

    if (user) localStorage.setItem(USER_KEY, next!);
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  notifyAuthChange();
}

export function clearAuth(): void {
  saveAuthToken(null);
  saveAuthUser(null);
  notifyAuthChange();
}
