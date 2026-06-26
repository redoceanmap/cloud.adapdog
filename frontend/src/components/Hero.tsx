"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import AppScreenshot from "@/components/AppScreenshot";
import { useAuthSession } from "@/lib/use-auth-session";

export default function Hero() {
  const { user, ready } = useAuthSession();
  const authed = ready && !!user;

  return (
    <section className="relative min-h-screen flex items-center paw-pattern overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-sage/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-coral/6 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 border border-sage/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="text-sm font-medium text-sage">반려동물 동반 여행 앱</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight text-brown mb-6">
            {authed ? (
              <>
                안녕하세요 {user!.name}님!
                <br />
                <span className="gradient-text">강아지와 함께하는 여행 AI가 다 짜드려요</span>
              </>
            ) : (
              <>
                강아지와 함께하는 여행,
                <br />
                <span className="gradient-text">AI가 다 짜드려요</span>
              </>
            )}
          </h1>

          <p className="text-lg text-brown-light leading-relaxed mb-8 max-w-lg">
            목적지만 말하면 이동 수단, 숙소, 일정까지.{" "}
            <strong className="text-brown">반려동물 정보를 반영한 맞춤 여행</strong>을
            AI가 채팅 한 번으로 완성해 드립니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#download" className="btn-primary px-7 py-3.5">
              앱 다운로드
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#ai-planner" className="btn-secondary px-7 py-3.5">
              AI 플래너 보기
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10">
            {[
              { num: "AI", label: "맞춤 일정 설계" },
              { num: "100%", label: "펫프렌들리" },
              { num: "자차", label: "경로 추천" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-sage">{stat.num}</div>
                <div className="text-xs text-brown-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <AppScreenshot variant="planner" />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-2 lg:-right-6 top-12 bg-white rounded-2xl shadow-lg p-3 border border-sage/20"
          >
            <div className="text-xs text-brown-light mb-1">AI 플래너</div>
            <div className="text-sm font-bold text-sage">일정 완성 🎉</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-2 lg:-left-6 bottom-24 bg-white rounded-2xl shadow-lg p-3 border border-sage/20"
          >
            <div className="text-xs text-brown-light mb-1">펫 필터</div>
            <div className="text-sm font-bold text-brown">맞춤 장소만 ✓</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
