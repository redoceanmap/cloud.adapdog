import { loadAuthToken } from "@/lib/auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(
  /\/+$/,
  "",
);

export async function parseApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as {
      error?: string;
      message?: string;
      detail?: string | { msg?: string }[];
    };

    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      const messages = data.detail.map((item) => item.msg).filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }

    return data.message ?? data.error ?? "요청에 실패했습니다.";
  } catch {
    return res.statusText || "요청에 실패했습니다.";
  }
}

export async function apiFetch(
  path: string,
  options?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const token = loadAuthToken();
  const timeoutMs = options?.timeoutMs ?? 20_000;
  const { timeoutMs: _omit, ...fetchOptions } = options ?? {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${API_URL}${normalizedPath}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("서버 응답이 지연되고 있습니다. 백엔드가 실행 중인지 확인해 주세요.");
    }
    throw new Error("백엔드에 연결할 수 없습니다. npm run dev:backend 를 실행해 주세요.");
  } finally {
    clearTimeout(timer);
  }
}

export { API_URL };
