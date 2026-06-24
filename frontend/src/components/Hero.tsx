"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center paw-pattern overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-lavender/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-coral/8 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 border border-sage/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="text-sm font-medium text-sage">AI 기반 반려동물 여행 플랫폼</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-brown mb-6">
            내 강아지가
            <br />
            <span className="gradient-text">주인공</span>인
            <br />
            여행 크로니클
          </h1>

          <p className="text-lg text-brown-light leading-relaxed mb-8 max-w-lg">
            &ldquo;나를 위해 계획하는 여행&rdquo;이 아니라,{" "}
            <strong className="text-brown">강아지가 AI 페르소나로 직접 이야기</strong>하는
            세상에 없던 반려동물 동반 여행 경험.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="btn-primary px-7 py-3.5"
            >
              회원가입
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary px-7 py-3.5"
            >
              로그인
            </Link>
            <a
              href="#flow"
              className="btn-ghost px-7 py-3.5"
            >
              <Play className="w-4 h-4 text-sage" />
              30초 데모 보기
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10">
            {[
              { num: "9+", label: "AI 핵심 기능" },
              { num: "100%", label: "반려동물 중심" },
              { num: "MZ", label: "바이럴 콘텐츠" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-sage">{stat.num}</div>
                <div className="text-xs text-brown-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 bg-gradient-to-br from-sage/20 via-lavender/10 to-coral/15 rounded-[2.5rem] blur-xl" />
            <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
              <div className="bg-gradient-to-br from-sage to-sage-dark p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    🐕
                  </div>
                  <div>
                    <div className="font-bold">몽이</div>
                    <div className="text-sm text-white/80">AI 페르소나 · 말티즈</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed bg-white/10 rounded-xl p-3">
                  &ldquo;안녕! 나는 더위를 많이 타는 강아지야. 오늘은 그늘진 카페랑
                  잔디밭이 있는 코스로 가고 싶어! 🌿&rdquo;
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-brown-light">
                  <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                  오늘의 추천 코스
                </div>
                {["한강공원 잔디밭 산책", "펫프렌들리 카페 '포포'", "반려견 놀이터"].map(
                  (place, i) => (
                    <div
                      key={place}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-cream hover:bg-sage/5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sage/10 flex items-center justify-center text-xs font-bold text-sage">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-brown">{place}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -right-6 top-16 bg-white rounded-2xl shadow-lg p-3 border border-sage/20"
            >
              <div className="text-xs text-brown-light mb-1">발자국 지도</div>
              <div className="text-lg font-bold text-sage">12곳 방문 🐾</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -left-6 bottom-20 bg-white rounded-2xl shadow-lg p-3 border border-lavender/30"
            >
              <div className="text-xs text-brown-light mb-1">연말 요약</div>
              <div className="text-sm font-bold text-brown">올해 최고의 순간 ✨</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
