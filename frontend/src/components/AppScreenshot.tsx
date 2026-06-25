"use client";

import { motion } from "framer-motion";
import { MapPin, MessageCircle, PawPrint, Sparkles } from "lucide-react";

interface AppScreenshotProps {
  className?: string;
  variant?: "planner" | "itinerary";
}

export default function AppScreenshot({
  className = "",
  variant = "planner",
}: AppScreenshotProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-4 bg-gradient-to-br from-sage/15 via-emerald-100/30 to-cream rounded-[2.75rem] blur-xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto w-full max-w-[280px] rounded-[2.25rem] border-[6px] border-brown/10 bg-brown shadow-2xl overflow-hidden"
      >
        <div className="h-6 bg-brown flex items-center justify-center gap-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="bg-warm-white min-h-[480px] flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between border-b border-sage/10 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sage flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-brown">발자국</span>
            </div>
            <Sparkles className="w-4 h-4 text-sage" />
          </div>

          {variant === "planner" ? (
            <div className="flex-1 p-4 space-y-3">
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-1.5 bg-sage/10 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                  <MessageCircle className="w-3 h-3" />
                  AI 여행 플래너
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-sage text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
                  전주 한옥마을 가고 싶어요 🏮
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white border border-sage/15 text-brown text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[90%] leading-relaxed shadow-sm">
                  좋아요! 어떤 이동 수단을 이용하실 예정인가요?
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pl-1">
                {["🚗 자차", "🚄 KTX", "🚌 버스"].map((opt) => (
                  <span
                    key={opt}
                    className={`text-[10px] px-2.5 py-1 rounded-full border ${
                      opt.includes("자차")
                        ? "bg-sage text-white border-sage"
                        : "bg-white text-brown-light border-sage/20"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>

              <div className="flex justify-end">
                <div className="bg-sage text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm">
                  자차로 갈게요
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white border border-sage/15 text-brown text-xs px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                  몽이(말티즈) 정보를 반영해 펫프렌들리 숙소를 찾고 있어요 🐾
                </div>
              </div>

              <div className="mt-auto pt-2">
                <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2 border border-sage/10">
                  <div className="flex-1 h-2 rounded-full bg-white" />
                  <div className="w-7 h-7 rounded-full bg-sage flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">↑</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 space-y-3">
              <div className="bg-sage/10 rounded-xl p-3 border border-sage/15">
                <div className="text-xs font-bold text-sage mb-1">맞춤 일정 완성 ✨</div>
                <div className="text-[11px] text-brown-light">전주 2박 3일 · 자차 이동</div>
              </div>

              {[
                { day: "1일차", place: "한옥마을 산책", icon: "🐾" },
                { day: "2일차", place: "강아지 동반 카페", icon: "☕" },
                { day: "3일차", place: "근교 잔디 공원", icon: "🌿" },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-sage/10 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-sm">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-sage font-semibold">{item.day}</div>
                    <div className="text-xs font-medium text-brown">{item.place}</div>
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-sage ml-auto" />
                </div>
              ))}

              <div className="bg-emerald-50 rounded-xl p-3 border border-sage/20">
                <div className="text-[10px] text-sage font-semibold mb-1">자차 경로 추천</div>
                <div className="text-[11px] text-brown-light leading-relaxed">
                  휴게소 2곳 · 반려견 산책 구간 포함
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
