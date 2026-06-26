This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. 환경 설정

```bash
npm run install:all
```

백엔드(Neon DB) — `cloud.adapdog/adapdog/.env` 에 `DATABASE_URL` 등 설정  
(예시: `cloud.adapdog/adapdog/.env.example` 참고)

프론트 — `frontend/.env.local` (이미 `http://localhost:8000/api` 로 설정됨)

### 2. 개발 서버 실행

```bash
npm run dev
```

| 서비스 | 포트 | 설명 |
|--------|------|------|
| 랜딩 웹 | **3001** | Next.js 홍보 사이트 |
| API | **8000** | FastAPI (cloud.adapdog) |
| 앱 UI | 3000 | `npm run dev:app` 로 별도 실행 |

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
