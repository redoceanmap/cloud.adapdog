import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sage via-lavender to-ink" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🐾</div>
        <div className="absolute top-20 right-20 text-4xl">🐾</div>
        <div className="absolute bottom-10 left-1/3 text-5xl">🐾</div>
        <div className="absolute bottom-20 right-10 text-3xl">🐾</div>
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          우리 강아지의 여행,
          <br />
          지금 시작하세요
        </h2>
        <p className="text-white/80 mb-8 leading-relaxed">
          기억은 유지, 굿즈는 수익. 발자국과 함께 반려동물과의
          특별한 여행 크로니클을 만들어보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-sage font-bold px-8 py-4 rounded-full hover:bg-cream transition-all shadow-xl hover:-translate-y-0.5 text-lg"
          >
            회원가입
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-transparent text-white font-semibold px-8 py-4 rounded-full border-2 border-white/50 hover:bg-white/15 transition-all text-lg"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
