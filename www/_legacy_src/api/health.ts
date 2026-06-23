import { apiClient, ApiClientError, getApiBaseUrl } from './client';

export { getApiBaseUrl };

export interface BackendHealth {
  status: 'ok' | 'error';
  service?: string;
  storage?: string;
  dataFile?: string;
  time?: string;
  message?: string;
}

export interface BackendCheckResult {
  ok: boolean;
  latencyMs: number;
  health: BackendHealth | null;
  error: string | null;
  apiBaseUrl: string;
}

const API_BASE_URL = getApiBaseUrl();

export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK !== 'false';
}

export async function checkBackendHealth(): Promise<BackendCheckResult> {
  const started = performance.now();

  try {
    const health = await apiClient<BackendHealth>('/health');
    return {
      ok: health.status === 'ok',
      latencyMs: Math.round(performance.now() - started),
      health,
      error: null,
      apiBaseUrl: API_BASE_URL,
    };
  } catch (err) {
    const message =
      err instanceof ApiClientError
        ? `${err.message}${err.status ? ` (${err.status})` : ''}`
        : err instanceof Error
          ? err.message
          : '연결 실패';

    return {
      ok: false,
      latencyMs: Math.round(performance.now() - started),
      health: null,
      error: message,
      apiBaseUrl: API_BASE_URL,
    };
  }
}

export async function testBackendSave(): Promise<{ ok: boolean; message: string }> {
  const health = await apiClient<BackendHealth>('/health');
  return {
    ok: health.status === 'ok',
    message: health.status === 'ok' ? '백엔드 API가 정상 동작합니다.' : '백엔드 상태를 확인해 주세요.',
  };
}
