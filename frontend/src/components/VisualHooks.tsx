"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, User } from "lucide-react";

const VLOG_SLIDES = [
  { src: "/images/vlog/jeonju-hanok-village.jpg", caption: "전주 한옥마을 왔다... 여기 분위기 뭐야 🏮" },
  { src: "/images/vlog/jeonju-hanok-cafe.jpg", caption: "한옥 카페 앞에서 잠깐 쉬는 중 ☕" },
  { src: "/images/vlog/jeonju-hanok-alley.jpg", caption: "기와집 골목 걸으니까 너무 행복해 🐾" },
];

function VlogPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % VLOG_SLIDES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const slide = VLOG_SLIDES[index];

  return (
    <div className="relative aspect-[9/16] max-w-[220px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-ink">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.src}
          src={slide.src}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shrink-0">
            <img
              src="/images/vlog/jeonju-hanok-village.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium drop-shadow">@몽이의여행</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="bg-black/50 rounded-lg px-3 py-2 text-xs backdrop-blur-sm"
            >
              &ldquo;{slide.caption}&rdquo;
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3 text-xs opacity-80">
            <span>❤️ 1.2k</span>
            <span>💬 89</span>
            <span>↗️ 234</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-10">
        {VLOG_SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-4 bg-white" : "w-1 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function VisualHooks() {
  return (
    <section className="py-24 bg-ink text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            눈길을 사로잡는 비주얼
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            AI 브이로그와 아바타 가이드로 여행이 콘텐츠가 됩니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-sage-light" />
                <span className="font-semibold">강아지 시점 AI 브이로그</span>
              </div>
              <VlogPreview />
              <p className="text-sm text-white/60 mt-4 text-center">
                여행 사진으로 자동 생성되는 릴스 스타일 영상
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-sage-light" />
                <span className="font-semibold">AI 아바타 가이드</span>
              </div>
              <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-lavender/30 to-sage/20 shadow-2xl">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
                  <path d="M20 100 Q60 40 100 100 T180 80" stroke="white" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                </svg>
                {[20, 50, 80].map((x, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-white/40"
                    style={{ left: `${x}%`, top: `${40 + i * 15}%` }}
                  />
                ))}
                <motion.div
                  animate={{ left: ["20%", "50%", "80%", "50%", "20%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: "20%" }}
                >
                  <div className="w-12 h-12 rounded-full bg-sage shadow-lg flex items-center justify-center text-xl border-2 border-white">
                    🐕
                  </div>
                </motion.div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur rounded-xl px-3 py-2 text-xs">
                  &ldquo;다음 목적지는 잔디밭이야! 50m 직진~&rdquo;
                </div>
              </div>
              <p className="text-sm text-white/60 mt-4 text-center">
                지도 위를 걸으며 안내하는 AI 아바타
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
