// 네이버 지도(Web Dynamic Map) SDK 동적 로더.
// VITE_NAVER_MAP_CLIENT_ID로 maps.js를 한 번만 주입하는 싱글톤 Promise.
// 키가 없거나 로드 실패면 reject → <NaverMap>이 fallback(기존 SVG)으로 그린다.

const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID as string | undefined;
// .env.example 안내대로 신규 키는 ncpKeyId, 구버전 콘솔은 ncpClientId. 순서대로 시도.
const KEY_TYPES = ['ncpKeyId', 'ncpClientId'];

// ── 업종(카테고리)별 핀 색 — 지도 마커와 범례가 같은 소스를 쓴다. ──
export const CATEGORY_PINS: { match: string[]; label: string; color: string }[] = [
  { match: ['카페'], label: '카페', color: '#E0853B' },
  { match: ['식당', '음식', '맛집', '레스토랑'], label: '식당', color: '#E0533F' },
  { match: ['미술', '박물', '전시', '갤러리', '문화'], label: '문화·전시', color: '#8B5CF6' },
  { match: ['용품', '마트', '쇼핑', '펫샵'], label: '용품', color: '#3B5BFE' },
  { match: ['미용', '그루밍'], label: '미용', color: '#E84C9B' },
  { match: ['숙박', '펜션', '호텔', '스테이', '게스트'], label: '숙박', color: '#0EA5B7' },
  { match: ['병원', '동물병원'], label: '병원', color: '#FF6B5C' },
  { match: ['여행', '공원', '관광', '명소', '둘레'], label: '여행지', color: '#22A565' },
];
export const DEFAULT_PIN = { label: '기타', color: '#5A5F68' };

/** 카테고리 문자열 → 핀 스타일(라벨·색). 부분 일치로 매칭, 없으면 기본. */
export function categoryStyle(category?: string): { label: string; color: string } {
  const c = category || '';
  for (const cat of CATEGORY_PINS) if (cat.match.some((m) => c.includes(m))) return cat;
  return DEFAULT_PIN;
}

// ── 업종별 핀 아이콘(Material Symbol) — 숙소/음식점/카페/공원/박물관을 한눈에 구별. ──
const CATEGORY_ICONS: { match: string[]; icon: string }[] = [
  { match: ['카페'], icon: 'local_cafe' },
  { match: ['식당', '음식', '맛집', '레스토랑'], icon: 'restaurant' },
  { match: ['미술', '박물', '전시', '갤러리', '문화', '문예', '유산'], icon: 'museum' },
  { match: ['숙박', '펜션', '호텔', '스테이', '게스트', '민박', '리조트'], icon: 'hotel' },
  { match: ['공원', '여행', '관광', '명소', '둘레', '호수', '정원', '수목', '산림', '숲'], icon: 'park' },
  { match: ['용품', '마트', '쇼핑', '펫샵'], icon: 'shopping_bag' },
  { match: ['미용', '그루밍'], icon: 'content_cut' },
  { match: ['병원', '동물병원'], icon: 'local_hospital' },
];

/** 카테고리 문자열 → 핀 아이콘 이름. 없으면 발바닥(pets). */
export function categoryIcon(category?: string): string {
  const c = category || '';
  for (const cat of CATEGORY_ICONS) if (cat.match.some((m) => c.includes(m))) return cat.icon;
  return 'pets';
}

let loadPromise: Promise<any> | null = null;

function injectScript(keyType: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${keyType}=${CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      const naver = (window as any).naver;
      if (naver?.maps) resolve(naver);
      else reject(new Error('naver.maps 미초기화'));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error('네이버 지도 스크립트 로드 실패'));
    };
    document.head.appendChild(script);
  });
}

/** 네이버 지도 SDK 로드. 성공 시 window.naver를 resolve. */
export function loadNaverMaps(): Promise<any> {
  if (loadPromise) return loadPromise;

  if (!CLIENT_ID || CLIENT_ID === 'your_naver_client_id') {
    loadPromise = Promise.reject(new Error('VITE_NAVER_MAP_CLIENT_ID 미설정'));
    return loadPromise;
  }
  if ((window as any).naver?.maps) {
    loadPromise = Promise.resolve((window as any).naver);
    return loadPromise;
  }

  // 키 타입을 순서대로 시도(첫 시도 실패 시 다음 타입으로 재주입).
  loadPromise = KEY_TYPES.reduce<Promise<any>>(
    (chain, keyType) => chain.catch(() => injectScript(keyType)),
    Promise.reject(new Error('init')),
  );
  return loadPromise;
}
