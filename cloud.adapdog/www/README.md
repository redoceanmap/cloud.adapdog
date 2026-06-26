# 발자국 (Pawprint) Frontend

반려견 동반 여행 플랫폼 **발자국** 프론트엔드 UI입니다.

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Lucide React (아이콘)

## 시작하기

```bash
cd frontend
npm install
npm run dev
```

## 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 엔드포인트
│   ├── client.ts     # 공통 fetch 래퍼
│   ├── places.ts     # 장소 API
│   └── dogs.ts       # 반려견 프로필 / AI 분석 API
├── hooks/
│   └── useFetch.ts   # 데이터 fetching / mutation 훅
├── components/
│   ├── badges/       # 펫티켓 · 무장애 정책 배지
│   ├── map/          # 지도, 마커, 바텀시트
│   └── dog/          # 프로필 등록, 이미지 업로드, AI 분석
├── types/            # 공통 타입 정의
└── data/             # 개발용 목업 데이터
```

## Docker (프론트만)

백엔드 병합 전, 프론트 UI만 컨테이너로 확인할 때:

```bash
cd frontend
docker compose up --build
```

- 앱: http://localhost:5173
- 관리자: http://localhost:5173/admin
- **Mock 모드**로 동작합니다 (`VITE_USE_MOCK=true`). 로그인·장소 API는 백엔드 없이도 UI만 볼 수 있습니다.

백엔드를 병합한 뒤 API를 연결하려면 `frontend/docker-compose.yml`의 빌드 args를 바꾸세요:

```yaml
VITE_USE_MOCK: "false"
```

그리고 `docker compose up --build`로 다시 빌드합니다. nginx가 `/api`를 호스트 8000 포트로 프록시합니다.

## 로컬 개발 (npm)

```bash
cd frontend
npm install
npm run dev
```

`.env.example`을 `.env.local`로 복사해 설정하세요. 백엔드 병합 전에는 `VITE_USE_MOCK=true`를 권장합니다.

## 화면

- **지도**: 장소 마커 + 바텀시트 (펫티켓·무장애 배지 강조)
- **프로필**: 사진 업로드 → AI 분석 → 이름/나이/활동량 입력
