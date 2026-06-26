"use client";

import { motion } from "framer-motion";
import { Apple, Play, Star } from "lucide-react";

function StoreBadge({
  platform,
  subtitle,
  icon: Icon,
}: {
  platform: string;
  subtitle: string;
  icon: typeof Apple;
}) {
  return (
    <button
      type="button"
      className="group flex items-center gap-3 bg-brown text-white px-6 py-3.5 rounded-2xl hover:bg-ink transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl min-w-[200px]"
    >
      <Icon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform" />
      <div className="text-left">
        <div className="text-[10px] uppercase tracking-wide opacity-80">{subtitle}</div>
        <div className="text-base font-semibold leading-tight">{platform}</div>
      </div>
    </button>
  );
}

export default function AppStoreCTA() {
  return (
    <section id="download" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-dark to-ink" />
      <div className="absolute inset-0 opacity-[0.07]">
        {["🐾", "🐕", "🦴"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-5xl"
            style={{
              top: `${15 + i * 25}%`,
              left: `${10 + i * 30}%`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4 fill-white" />
            <span>곧 정식 출시 예정</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            발자국 앱으로
            <br />
            첫 여행을 시작하세요
          </h2>
          <p className="text-white/80 mb-10 leading-relaxed max-w-md mx-auto">
            AI 여행 플래너, 반려동물 맞춤 필터, 자차 경로 추천까지.
            강아지와 함께하는 여행의 모든 것을 앱 하나에 담았습니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <StoreBadge platform="App Store" subtitle="Download on the" icon={Apple} />
            <StoreBadge platform="Google Play" subtitle="Get it on" icon={Play} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
