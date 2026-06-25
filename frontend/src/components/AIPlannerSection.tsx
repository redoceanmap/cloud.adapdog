"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Car, Home, MapPin, Send } from "lucide-react";

type Step = "destination" | "transport" | "accommodation" | "complete";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  options?: string[];
}

const STEPS: Record<Step, ChatMessage[]> = {
  destination: [
    { id: "d1", role: "ai", text: "어디로 여행 가고 싶으세요? 목적지를 알려주세요 🗺️" },
    { id: "d2", role: "user", text: "전주 한옥마을이요! 체리랑 같이 가요 🐕" },
  ],
  transport: [
    { id: "t1", role: "ai", text: "좋아요! 어떤 이동 수단을 이용하실 예정인가요?" },
    {
      id: "t2",
      role: "ai",
      text: "",
      options: ["🚗 자차", "🚄 KTX", "🚌 고속버스"],
    },
    { id: "t3", role: "user", text: "자차로 갈게요" },
  ],
  accommodation: [
    { id: "a1", role: "ai", text: "숙소는 어떤 스타일을 원하시나요?" },
    {
      id: "a2",
      role: "ai",
      text: "",
      options: ["🏠 한옥 스테이", "🏨 펫 호텔", "⛺ 글램핑"],
    },
    { id: "a3", role: "user", text: "한옥 스테이로 부탁해요" },
  ],
  complete: [
    {
      id: "c1",
      role: "ai",
      text: "체리(말티즈 · 5kg) 정보를 반영해 펫프렌들리 일정을 완성했어요! 🎉",
    },
  ],
};

const STEP_ORDER: Step[] = ["destination", "transport", "accommodation", "complete"];

const STEP_LABELS = [
  { icon: MapPin, label: "목적지 입력" },
  { icon: Car, label: "이동 수단" },
  { icon: Home, label: "숙소 선택" },
  { icon: Bot, label: "일정 완성" },
];

export default function AIPlannerSection() {
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  const currentStep = STEP_ORDER[stepIndex];
  const messages = STEPS[currentStep];

  useEffect(() => {
    const messages = STEPS[STEP_ORDER[stepIndex]];
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    messages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), (i + 1) * 1200),
      );
    });

    const nextStepDelay = messages.length * 1200 + 1800;
    timers.push(
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % STEP_ORDER.length);
      }, nextStepDelay),
    );

    return () => timers.forEach(clearTimeout);
  }, [stepIndex]);

  const visibleMessages = messages.slice(0, visibleCount);

  return (
    <section id="ai-planner" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-sage bg-sage/10 px-4 py-1.5 rounded-full mb-4">
            AI 여행 플래너
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mb-4">
            채팅만 하면 끝나는
            <br />
            <span className="gradient-text">맞춤 여행 설계</span>
          </h2>
          <p className="text-brown-light max-w-xl mx-auto leading-relaxed">
            목적지를 입력하면 AI가 이동 수단과 숙소를 순서대로 물어보고,
            반려동물 정보를 반영한 일정을 자동으로 완성해요.
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 sm:gap-6 mb-10">
          {STEP_LABELS.map((item, i) => {
            const Icon = item.icon;
            const active = i === stepIndex;
            const done = i < stepIndex;
            return (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    active
                      ? "bg-sage text-white shadow-lg shadow-sage/30 scale-110"
                      : done
                        ? "bg-sage/20 text-sage"
                        : "bg-cream text-brown-light"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-medium text-center ${
                    active ? "text-sage" : "text-brown-light"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-md mx-auto w-full"
        >
            <div className="absolute -inset-3 bg-gradient-to-br from-sage/10 to-cream rounded-3xl blur-lg" />
            <div className="relative bg-warm-white rounded-3xl border border-sage/15 shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-sage/10 bg-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sage flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-brown">코코 AI</div>
                  <div className="text-xs text-sage">여행 플래너 대화 중...</div>
                </div>
              </div>

              <div className="p-5 min-h-[320px] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {visibleMessages.map((msg) => (
                    <motion.div
                      key={`${currentStep}-${msg.id}`}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.options ? (
                        <div className="flex flex-wrap gap-2">
                          {msg.options.map((opt, i) => (
                            <motion.span
                              key={opt}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.15 }}
                              className={`text-sm px-3.5 py-2 rounded-full border ${
                                i === 0 && currentStep === "transport"
                                  ? "bg-sage text-white border-sage"
                                  : i === 0 && currentStep === "accommodation"
                                    ? "bg-sage text-white border-sage"
                                    : "bg-white text-brown border-sage/20"
                              }`}
                            >
                              {opt}
                            </motion.span>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-sage text-white rounded-tr-sm"
                              : "bg-white text-brown border border-sage/15 rounded-tl-sm shadow-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {currentStep === "complete" && visibleCount >= messages.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 rounded-xl bg-sage/10 border border-sage/20"
                  >
                    <div className="text-xs font-bold text-sage mb-2">📋 전주 2박 3일 일정</div>
                    <div className="space-y-1.5 text-xs text-brown">
                      <div>Day 1 · 한옥마을 산책 & 감성 카페</div>
                      <div>Day 2 · 자차 경유 반려견 공원</div>
                      <div>Day 3 · 근교 잔디밭 피크닉</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-sage/15">
                  <span className="flex-1 text-sm text-brown-light">메시지를 입력하세요...</span>
                  <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
}
