let loadPromise: Promise<void> | null = null;

export type NaverMapKeyParam = 'ncpKeyId' | 'ncpClientId';

const KEY_PARAM =
  (import.meta.env.VITE_NAVER_MAP_KEY_TYPE as NaverMapKeyParam | undefined) ?? 'ncpKeyId';

function buildScriptUrl(clientId: string, keyParam: NaverMapKeyParam): string {
  return `https://oapi.map.naver.com/openapi/v3/maps.js?${keyParam}=${encodeURIComponent(clientId)}`;
}

function waitForNaverMaps(timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (window.naver?.maps?.Map) {
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('SCRIPT_LOAD_FAILED'));
    document.head.appendChild(script);
  });
}

async function tryLoad(clientId: string, keyParam: NaverMapKeyParam): Promise<boolean> {
  const src = buildScriptUrl(clientId, keyParam);
  await injectScript(src);
  return waitForNaverMaps();
}

/** 네이버 지도 SDK 로드 — ncpKeyId / ncpClientId 자동 시도 */
export async function loadNaverMapScript(clientId: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('브라우저 환경에서만 지도를 불러올 수 있습니다.');
  }

  if (!clientId?.trim()) {
    throw new Error('VITE_NAVER_MAP_CLIENT_ID가 비어 있습니다.');
  }

  if (window.naver?.maps?.Map) {
    return;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const trimmed = clientId.trim();
    const attempts: NaverMapKeyParam[] =
      KEY_PARAM === 'ncpClientId' ? ['ncpClientId', 'ncpKeyId'] : ['ncpKeyId', 'ncpClientId'];

    for (const keyParam of attempts) {
      const ok = await tryLoad(trimmed, keyParam);
      if (ok) return;
    }

    throw new Error('NAVER_MAP_AUTH_FAILED');
  })();

  try {
    await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

export const NAVER_MAP_SETUP_GUIDE = [
  '네이버 클라우드 → AI·NAVER API → Application → [인증 정보]',
  'Web 서비스 URL에 http://localhost 등록 (포트 없이 localhost만)',
  '추가로 http://127.0.0.1 도 등록',
  'Application에 Web Dynamic Map 서비스가 선택되어 있는지 확인',
  'Client ID를 VITE_NAVER_MAP_CLIENT_ID에 넣고 dev 서버 재시작',
] as const;

export function getNaverMapErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === 'NAVER_MAP_AUTH_FAILED' || err.message === 'SCRIPT_LOAD_FAILED') {
      return '네이버 지도 인증에 실패했습니다. 콘솔에서 Web 서비스 URL과 Client ID를 확인해 주세요.';
    }
    return err.message;
  }
  return '지도를 불러오지 못했습니다.';
}
