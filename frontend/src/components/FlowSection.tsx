"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, MapPin, Gift, ChevronRight } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: Camera,
    title: "사진 업로드",
    description: "우리 강아지 사진 한 장만 올려주세요.",
    visual: (
      <div className="bg-gradient-to-br from-coral/10 to-gold/10 rounded-2xl p-6 flex flex-col items-center justify-center h-48">
        <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl mb-3">
          🐕
        </div>
        <div className="text-sm font-medium text-brown">몽이.jpg 업로드 완료 ✓</div>
      </div>
    ),
  },
  {
    num: 2,
    icon: Sparkles,
    title: "AI 페르소나 등장",
    description: "견종과 표정을 분석해 강아지만의 목소리가 탄생해요.",
    visual: (
      <div className="bg-gradient-to-br from-lavender/20 to-coral/10 rounded-2xl p-6 h-48 flex flex-col justify-center">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🐕</span>
            <span className="font-bold text-brown text-sm">몽이</span>
          </div>
          <p className="text-xs text-brown-light leading-relaxed">
            &ldquo;안녕! 나는 더위를 많이 타는 말티즈야.
            <br />
            산책보다 그늘진 카페가 좋아! ☕&rdquo;
          </p>
        </div>
      </div>
    ),
  },
  {
    num: 3,
    icon: MapPin,
    title: "발자국 여행 코스",
    description: "AI가 추천한 맞춤 코스로 여행을 떠나요.",
    visual: (
      <div className="bg-gradient-to-br from-sage/20 to-sage-light/20 rounded-2xl p-6 h-48 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <path d="M30 60 Q70 20 120 50 T180 40" stroke="#7cb87c" strokeWidth="3" fill="none" strokeDasharray="6 4" />
          </svg>
        </div>
        <div className="relative space-y-2">
          {["한강 잔디밭", "포포 카페", "반려견 놀이터"].map((p, i) => (
            <div key={p} className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1.5 text-xs font-medium text-brown">
              <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: 4,
    icon: Gift,
    title: "연말 요약 카드",
    description: "올해 가장 행복했던 순간을 카드로 받아보세요.",
    visual: (
      <div className="bg-gradient-to-br from-gold/20 to-coral/20 rounded-2xl p-6 h-48 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-[200px] text-center">
          <div className="text-2xl mb-2">✨</div>
          <div className="text-xs font-bold text-coral mb-1">2025 몽이 Wrapped</div>
          <div className="text-[10px] text-brown-light">총 47회 산책 · 12곳 방문</div>
          <div className="text-[10px] text-brown-light">최애 장소: 한강 잔디밭 🌿</div>
        </div>
      </div>
    ),
  },
];

export default function FlowSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="flow" className="py-24 paw-pattern">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-gold uppercase tracking-wider">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mt-2 mb-4">
            30초 만에 보는 발자국
          </h2>
          <p className="text-brown-light max-w-xl mx-auto">
            사진 한 장으로 시작하는 강아지 주인공 여행. 4단계로 완성되는 특별한 크로니클.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = active === i;
              return (
                <button
                  key={step.num}
                  onClick={() => setActive(i)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 ${
                    isActive
                      ? "bg-white shadow-lg border border-coral/20"
                      : "bg-white/50 hover:bg-white border border-transparent"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-coral text-white" : "bg-cream text-brown-light"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-coral">STEP {step.num}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-coral" />}
                    </div>
                    <h3 className="font-bold text-brown mb-1">{step.title}</h3>
                    <p className="text-sm text-brown-light">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {steps[active].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
