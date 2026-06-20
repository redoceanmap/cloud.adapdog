import type { ApiError } from '@/types';
import { loadAuthToken } from '@/utils/authToken';

/** 백엔드 루트(http://host:8000)만 적어도 /api 가 붙도록 정규화 */
export function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? '/api').trim();

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    const withoutTrailing = raw.replace(/\/+$/, '');
    return withoutTrailing.endsWith('/api') ? withoutTrailing : `${withoutTrailing}/api`;
  }

  const relative = raw.startsWith('/') ? raw : `/${raw}`;
  return relative.replace(/\/+$/, '') || '/api';
}

const BASE_URL = resolveApiBaseUrl();

export function getApiBaseUrl(): string {
  return BASE_URL;
}

export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = BASE_URL.startsWith('http')
    ? new URL(`${BASE_URL}${normalizedPath}`)
    : new URL(`${BASE_URL}${normalizedPath}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = (await response.json()) as { message?: string; detail?: string | { msg?: string }[] };
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).filter(Boolean).join(', ')
          : undefined;

    return {
      message: detail ?? data.message ?? response.statusText,
      status: response.status,
    };
  } catch {
    return { message: response.statusText || '요청에 실패했습니다.', status: response.status };
  }
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers, ...rest } = options;
  const token = loadAuthToken();

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new ApiClientError(error.message, error.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
