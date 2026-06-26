import { apiFetch, parseApiError } from "@/lib/api";
import {
  clearAuth,
  saveAuthToken,
  saveAuthUser,
  type AuthUser,
} from "@/lib/auth";

interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch("/users/account/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = (await res.json()) as TokenResponse;
  saveAuthToken(data.access_token);

  const user: AuthUser = {
    id: email,
    name: email.split("@")[0] ?? "회원",
    email,
  };
  saveAuthUser(user);
  return user;
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
    throw new Error(await parseApiError(res));
  }
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const res = await apiFetch("/users/pet/me", { timeoutMs: 8_000 });
    return res.ok;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearAuth();
}
