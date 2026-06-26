const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const KEY_TYPES = (
  process.env.NEXT_PUBLIC_NAVER_MAP_KEY_TYPE
    ? [process.env.NEXT_PUBLIC_NAVER_MAP_KEY_TYPE]
    : ["ncpKeyId", "ncpClientId"]
) as string[];

export const NAVER_MAP_SETUP_GUIDE = [
  "네이버 클라우드 → AI·NAVER API → Application 등록",
  '서비스: "Web Dynamic Map" 선택 (developers.naver.com 검색 API 키와 다름)',
  "Web 서비스 URL: http://localhost , http://127.0.0.1 (포트·경로 없이)",
  "인증 정보의 Client ID(ncpKeyId)를 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID에 입력",
  "frontend dev 서버 재시작 후 새로고침",
] as const;

export const CATEGORY_PINS: { match: string[]; label: string; color: string }[] = [
  { match: ["카페"], label: "카페", color: "#E0853B" },
  { match: ["식당", "음식", "맛집", "레스토랑"], label: "식당", color: "#E0533F" },
  { match: ["미술", "박물", "전시", "갤러리", "문화"], label: "문화·전시", color: "#8B5CF6" },
  { match: ["용품", "마트", "쇼핑", "펫샵"], label: "용품", color: "#3B5BFE" },
  { match: ["미용", "그루밍"], label: "미용", color: "#E84C9B" },
  { match: ["숙박", "펜션", "호텔", "스테이", "게스트"], label: "숙박", color: "#0EA5B7" },
  { match: ["병원", "동물병원"], label: "병원", color: "#FF6B5C" },
  { match: ["여행", "공원", "관광", "명소", "둘레"], label: "여행지", color: "#22A565" },
];
export const DEFAULT_PIN = { label: "기타", color: "#5A5F68" };

export function categoryStyle(category?: string): { label: string; color: string } {
  const c = category || "";
  for (const cat of CATEGORY_PINS) if (cat.match.some((m) => c.includes(m))) return cat;
  return DEFAULT_PIN;
}

const CATEGORY_ICONS: { match: string[]; icon: string }[] = [
  { match: ["카페"], icon: "local_cafe" },
  { match: ["식당", "음식", "맛집", "레스토랑"], icon: "restaurant" },
  { match: ["미술", "박물", "전시", "갤러리", "문화", "문예", "유산"], icon: "museum" },
  { match: ["숙박", "펜션", "호텔", "스테이", "게스트", "민박", "리조트"], icon: "hotel" },
  { match: ["공원", "여행", "관광", "명소", "둘레", "호수", "정원", "수목", "산림", "숲"], icon: "park" },
  { match: ["용품", "마트", "쇼핑", "펫샵"], icon: "shopping_bag" },
  { match: ["미용", "그루밍"], icon: "content_cut" },
  { match: ["병원", "동물병원"], icon: "local_hospital" },
];

export function categoryIcon(category?: string): string {
  const c = category || "";
  for (const cat of CATEGORY_ICONS) if (cat.match.some((m) => c.includes(m))) return cat.icon;
  return "pets";
}

let loadPromise: Promise<unknown> | null = null;
let authFailed = false;

function waitForNaverMaps(timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      const naver = (window as { naver?: { maps?: { Map?: unknown } } }).naver;
      if (naver?.maps?.Map) {
        resolve(true);
        return;
      }
      if (authFailed || Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function injectScript(keyType: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    authFailed = false;
    (window as { navermap_authFailure?: () => void }).navermap_authFailure = () => {
      authFailed = true;
    };

    const src = `https://oapi.map.naver.com/openapi/v3/maps.js?${keyType}=${encodeURIComponent(CLIENT_ID!)}`;
    const existing = document.querySelector(`script[src^="https://oapi.map.naver.com/openapi/v3/maps.js"]`);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = async () => {
      const ok = await waitForNaverMaps();
      const naver = (window as { naver?: { maps?: unknown } }).naver;
      if (ok && naver?.maps) resolve(naver);
      else reject(new Error(authFailed ? "NAVER_MAP_AUTH_FAILED" : "naver.maps 미초기화"));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("네이버 지도 스크립트 로드 실패"));
    };
    document.head.appendChild(script);
  });
}

export function loadNaverMaps(): Promise<unknown> {
  if (loadPromise) return loadPromise;

  if (!CLIENT_ID || CLIENT_ID === "your_naver_client_id") {
    loadPromise = Promise.reject(new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 미설정"));
    return loadPromise;
  }
  if ((window as { naver?: { maps?: unknown } }).naver?.maps) {
    loadPromise = Promise.resolve((window as { naver?: unknown }).naver);
    return loadPromise;
  }

  loadPromise = KEY_TYPES.reduce<Promise<unknown>>(
    (chain, keyType) => chain.catch(() => injectScript(keyType)),
    Promise.reject(new Error("init")),
  ).catch((err) => {
    loadPromise = null;
    throw err;
  });
  return loadPromise;
}

export function getNaverMapErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === "NAVER_MAP_AUTH_FAILED") {
      return "네이버 지도 인증에 실패했습니다. Web Dynamic Map용 Client ID와 Web 서비스 URL을 확인해 주세요.";
    }
    return err.message;
  }
  return "지도를 불러오지 못했습니다.";
}
