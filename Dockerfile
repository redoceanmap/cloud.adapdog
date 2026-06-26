# 발자국 단일 서비스 배포(레일웨이) — Vite 프론트 빌드 → FastAPI 백엔드가 정적 dist + /api 동시 서빙.
# DB 는 외부 Neon(DATABASE_URL 환경변수), CSV 는 이미지에 동봉(/csv).

# ── 1단계: 프론트엔드(Vite + React) 빌드 ────────────────────────────────
FROM node:22-alpine AS web
WORKDIR /web
COPY www/package.json www/package-lock.json* ./
RUN npm ci
COPY www/ ./
# 프론트가 빌드 시점에 인라인하는 유일한 변수 = 네이버 지도 클라이언트 ID(지도 렌더링용).
# (API base 는 client.ts 에서 '/api' 로 하드코딩 → 동일 오리진이라 추가 변수 불필요)
ARG VITE_NAVER_MAP_CLIENT_ID=
ENV VITE_NAVER_MAP_CLIENT_ID=$VITE_NAVER_MAP_CLIENT_ID
RUN npm run build

# ── 2단계: 백엔드(FastAPI) 런타임 ──────────────────────────────────────
FROM python:3.13-slim
WORKDIR /app

COPY adapdog/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 소스
COPY adapdog/ .
# 런타임 CSV(코리도어 경유지·둘레길·식당·동물병원·공원) — config.py 기본 경로가 /csv.
COPY csv /csv
# 프론트 빌드물 → FastAPI 가 /app/static 에서 서빙(main.py FRONTEND_DIST).
COPY --from=web /web/dist ./static
ENV FRONTEND_DIST=/app/static

# 부팅 시 alembic 으로 스키마를 head 까지 올린 뒤, 레일웨이가 주입한 $PORT 로 기동.
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
