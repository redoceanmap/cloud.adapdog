"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Volume2, Footprints, Map } from "lucide-react";

const sensoryPoints = [
  {
    id: "grass",
    x: 25,
    y: 35,
    icon: Footprints,
    label: "부드러운 잔디",
    detail: "발바닥에 포근한 잔디밭 — 몽이가 가장 좋아하는 텍스처!",
    sense: "촉감",
    color: "sage",
  },
  {
    id: "bakery",
    x: 65,
    y: 25,
    icon: Wind,
    label: "빵 냄새 가득",
    detail: "근처 베이커리에서 갓 구운 빵 향이 솔솔~ 코를 간지럽혀요.",
    sense: "후각",
    color: "coral",
  },
  {
    id: "crowd",
    x: 50,
    y: 60,
    icon: Volume2,
    label: "시끌벅적한 광장",
    detail: "사람이 많아 소음이 높아요. 소심한 강아지는 피하는 게 좋아요.",
    sense: "청각",
    color: "gold",
  },
  {
    id: "river",
    x: 80,
    y: 55,
    icon: Footprints,
    label: "시원한 강변 산책로",
    detail: "물소리와 함께하는 시원한 바람 — 더위 많이 타는 강아지에게 최고!",
    sense: "촉감",
    color: "sage",
  },
  {
    id: "cafe",
    x: 35,
    y: 70,
    icon: Wind,
    label: "커피 향 카페거리",
    detail: "다양한 향이 섞인 거리. 호기심 많은 강아지에게 탐험의 즐거움!",
    sense: "후각",
    color: "coral",
  },
];

const senseFilters = ["전체", "후각", "청각", "촉감"];

export default function SensoryMap() {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("전체");

  const filtered =
    filter === "전체"
      ? sensoryPoints
      : sensoryPoints.filter((p) => p.sense === filter);

  const activePoint = sensoryPoints.find((p) => p.id === active);

  return (
    <section id="sensory-map" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage uppercase tracking-wider">
            <Map className="w-4 h-4" />
            Signature Feature
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mt-2 mb-4">
            강아지 감각 지도
          </h2>
          <p className="text-brown-light max-w-xl mx-auto">
            일반 지도가 아닌, <strong className="text-brown">강아지의 감각</strong>으로 그린 세상.
            냄새, 소리, 발바닥 촉감 — 강아지가 느끼는 대로 여행하세요.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {senseFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-sage text-white shadow-md"
                  : "bg-cream text-brown-light hover:bg-sage/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-sage/10">
              <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-cream to-sage-light/30" />
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
                <path d="M0 150 Q100 100 200 150 T400 150" stroke="#2e9bff" strokeWidth="2" fill="none" />
                <path d="M50 0 Q150 100 100 200 T50 300" stroke="#2e9bff" strokeWidth="1.5" fill="none" />
                <path d="M350 0 Q250 120 300 250 T350 300" stroke="#2e9bff" strokeWidth="1.5" fill="none" />
              </svg>

              <div className="absolute top-4 left-4 bg-white/90 rounded-xl px-3 py-2 text-xs font-medium text-brown shadow">
                🐾 몽이의 감각 지도
              </div>

              {filtered.map((point) => {
                const Icon = point.icon;
                const isActive = active === point.id;
                return (
                  <button
                    key={point.id}
                    onClick={() => setActive(isActive ? null : point.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                        isActive
                          ? "bg-sage text-white"
                          : "bg-white text-sage group-hover:bg-sage group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span
                      className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full ${
                        isActive ? "bg-sage text-white" : "bg-white/90 text-brown"
                      }`}
                    >
                      {point.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {activePoint ? (
                <motion.div
                  key={activePoint.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-cream rounded-2xl p-6 border border-sage/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold bg-sage/15 text-sage px-2 py-0.5 rounded-full">
                      {activePoint.sense}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brown mb-2">{activePoint.label}</h3>
                  <p className="text-brown-light leading-relaxed">{activePoint.detail}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-cream rounded-2xl p-6 border border-dashed border-sage/30 text-center"
                >
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-brown-light text-sm">
                    지도 위의 포인트를 클릭하면
                    <br />
                    강아지가 느끼는 감각 정보를 볼 수 있어요
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {filtered.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setActive(point.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm ${
                    active === point.id
                      ? "bg-sage/10 border border-sage/30"
                      : "bg-white border border-brown/5 hover:border-sage/20"
                  }`}
                >
                  <span className="font-medium text-brown">{point.label}</span>
                  <span className="text-brown-light ml-2">· {point.sense}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
