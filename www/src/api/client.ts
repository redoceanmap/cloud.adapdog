// 백엔드(FastAPI, :8000) 호출 클라이언트.
// vite dev 프록시(/api → 127.0.0.1:8000)를 통해 같은 출처로 요청한다.
const BASE = '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public path: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, path, body || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

/** 백엔드 헬스체크 — 연결 상태 확인용. */
export async function checkHealth(): Promise<boolean> {
  try {
    const r = await apiGet<{ status: string }>('/health');
    return r.status === 'ok';
  } catch {
    return false;
  }
}
