import { apiFetch, parseApiError } from "@/lib/api";
import {
  clearAuth,
  saveAuthToken,
  saveAuthUser,
  type AuthUser,
} from "@/lib/auth";

interface AccountResponse {
  id: number;
  email: string;
  nickname: string;
}

interface LoginResponse {
  access_token: string;
  token_type?: string;
  account: AccountResponse;
}

function accountToUser(account: AccountResponse): AuthUser {
  return {
    id: String(account.id),
    name: account.nickname,
    email: account.email,
  };
}

export async function fetchMyAccount(): Promise<AuthUser | null> {
  const res = await apiFetch("/users/account/me");
  if (!res.ok) return null;
  const account = (await res.json()) as AccountResponse;
  return accountToUser(account);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch("/users/account/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = (await res.json()) as Partial<LoginResponse> & { access_token: string };
  if (!data.access_token) {
    throw new Error("로그인 응답이 올바르지 않습니다.");
  }

  saveAuthToken(data.access_token);

  if (data.account?.nickname) {
    const user = accountToUser(data.account);
    saveAuthUser(user);
    return user;
  }

  const account = await fetchMyAccount();
  if (account) {
    saveAuthUser(account);
    return account;
  }

  const fallback: AuthUser = {
    id: email,
    name: email.split("@")[0] ?? "회원",
    email,
  };
  saveAuthUser(fallback);
  return fallback;
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const res = await apiFetch("/users/account/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      nickname: name,
      pet: {
        name: name ? `${name}의 반려견` : "반려견",
        breed: "믹스견",
        photo_url: "",
      },
    }),
  });

  if (!res.ok) {
    const message = await parseApiError(res);
    if (res.status === 409) {
      throw new Error(message || "이미 가입된 이메일입니다. 로그인해 주세요.");
    }
    throw new Error(message);
  }
}

export async function verifyAuth(): Promise<"valid" | "invalid" | "unknown"> {
  try {
    const res = await apiFetch("/users/account/me", { timeoutMs: 12_000 });
    if (res.ok) return "valid";
    if (res.status === 401 || res.status === 403) return "invalid";
    return "unknown";
  } catch {
    return "unknown";
  }
}

/** 백엔드 재기동 직후 일시 오류를 흡수한 뒤 세션 유효성을 판별한다. */
export async function verifyAuthWithRetry(
  attempts = 4,
  delayMs = 1200,
): Promise<"valid" | "invalid" | "unknown"> {
  for (let i = 0; i < attempts; i++) {
    const status = await verifyAuth();
    if (status !== "unknown") return status;
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return "unknown";
}

export function logout(): void {
  clearAuth();
}
