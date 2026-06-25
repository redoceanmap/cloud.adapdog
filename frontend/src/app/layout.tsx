import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500",  "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "발자국 | 강아지와 함께하는 AI 여행 플래너",
  description:
    "강아지와 함께하는 여행, AI가 다 짜드려요. 반려동물 정보 기반 맞춤 필터링과 자차 경로 추천까지 — 발자국 앱으로 시작하세요.",
  keywords: ["반려동물", "여행", "강아지", "AI", "발자국", "펫프렌들리", "여행 플래너"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={`${noto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-white text-foreground">
        {children}
      </body>
    </html>
  );
}
