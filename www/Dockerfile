# ── build stage: Vite + React + TypeScript 빌드 ──────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# VITE_* 변수는 빌드 시점에 번들에 정적으로 인라인된다 → build arg 로 주입.
ARG VITE_USE_MOCK=false
ARG VITE_API_BASE_URL=/api
ARG VITE_OPENWEATHER_API_KEY=
ARG VITE_NAVER_MAP_CLIENT_ID=
ENV VITE_USE_MOCK=$VITE_USE_MOCK \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY \
    VITE_NAVER_MAP_CLIENT_ID=$VITE_NAVER_MAP_CLIENT_ID

RUN npm run build

# ── serve stage: nginx 정적 서빙 + /api 프록시 (nginx.conf) ───────
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
