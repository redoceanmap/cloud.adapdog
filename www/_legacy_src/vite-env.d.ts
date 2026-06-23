/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_NAVER_MAP_CLIENT_ID: string;
  readonly VITE_NAVER_MAP_KEY_TYPE?: 'ncpKeyId' | 'ncpClientId';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
