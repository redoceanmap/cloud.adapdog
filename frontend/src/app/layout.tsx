import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500",  "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "발자국 | 반려동물 동반 여행 플랫폼",
  description:
    "내 강아지가 주인공인 여행 크로니클. AI 페르소나, 감각 지도, 여행 브이로그까지 — 반려동물과 함께하는 특별한 여행을 시작하세요.",
  keywords: ["반려동물", "여행", "강아지", "AI", "발자국", "펫프렌들리"],
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
