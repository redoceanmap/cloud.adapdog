"use client";

import { motion } from "framer-motion";
import { Car, Filter, MapPin, PawPrint, Shield, TreePine } from "lucide-react";

const features = [
  {
    icon: Filter,
    title: "반려동물 정보 기반 자동 필터링",
    description:
      "견종, 체중, 성격 데이터를 등록해 두면 AI가 펫프렌들리 숙소·식당·관광지만 자동으로 골라줘요. 몸무게 제한이나 견종 제한이 있는 곳은 미리 걸러드립니다.",
    highlights: ["견종·체중 제한 자동 확인", "성격 맞춤 장소 추천", "위험 요소 사전 경고"],
    visual: (
      <div className="space-y-2">
        {[
          { label: "말티즈 · 4kg · 활발함", status: "등록됨", ok: true },
          { label: "○○ 펫 호텔", status: "적합 ✓", ok: true },
          { label: "△△ 리조트", status: "견종 제한", ok: false },
          { label: "□□ 카페", status: "적합 ✓", ok: true },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${
              item.ok ? "bg-sage/10 text-brown" : "bg-coral/10 text-brown-light line-through"
            }`}
          >
            <span className="font-medium">{item.label}</span>
            <span className={item.ok ? "text-sage font-semibold" : "text-coral-dark"}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Car,
    title: "자차 이용 시 맞춤 경로 추천",
    description:
      "자차를 선택하면 반려견 산책이 가능한 휴게 구간, 펫프렌들리 카페, 잔디밭을 경유하는 최적 경로를 추천해요. 장거리 이동도 강아지 스트레스를 줄여줍니다.",
    highlights: ["휴게·산책 구간 자동 삽입", "펫 동반 카페 경유", "실시간 교통 반영"],
    visual: (
      <div className="relative h-36 bg-cream rounded-xl overflow-hidden border border-sage/15">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 140">
          <path
            d="M30 100 Q80 40 140 70 T250 50"
            stroke="#3B5BFE"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6 4"
          />
          {[
            { x: 30, y: 100, label: "출발" },
            { x: 100, y: 55, label: "🌿 산책" },
            { x: 170, y: 72, label: "☕ 카페" },
            { x: 250, y: 50, label: "도착" },
          ].map((pt) => (
            <g key={pt.label}>
              <circle cx={pt.x} cy={pt.y} r="6" fill="#3B5BFE" />
              <text x={pt.x} y={pt.y - 12} textAnchor="middle" fontSize="9" fill="#334155">
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 bg-white/90 rounded-lg px-2 py-1.5 text-[10px] text-brown">
          <Car className="w-3 h-3 text-sage" />
          <span>서울 → 전주 · 휴게 2회 · 산책 1회 포함</span>
        </div>
      </div>
    ),
  },
];

export default function DifferentiatorsSection() {
  return (
    <section id="features" className="py-24 bg-cream paw-pattern">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-sage bg-sage/10 px-4 py-1.5 rounded-full mb-4">
            발자국만의 차별점
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mb-4">
            강아지를 위한 여행,
            <br />
            <span className="gradient-text">진짜 맞춤 설계</span>
          </h2>
          <p className="text-brown-light max-w-xl mx-auto leading-relaxed">
            일반 여행 앱과 달리, 발자국은 반려동물 데이터를 핵심으로
            필터링과 경로까지 자동으로 최적화합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-3xl p-6 md:p-8 border border-sage/10 shadow-lg shadow-sage/5"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brown mb-2">{feature.title}</h3>
                    <p className="text-sm text-brown-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="mb-5">{feature.visual}</div>

                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium text-sage bg-sage/10 px-3 py-1.5 rounded-full"
                    >
                      <Shield className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { icon: PawPrint, label: "반려동물 중심" },
            { icon: TreePine, label: "자연 친화 코스" },
            { icon: MapPin, label: "실시간 장소 DB" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center p-4 rounded-2xl bg-white/60 border border-sage/10"
              >
                <Icon className="w-5 h-5 text-sage mx-auto mb-2" />
                <span className="text-xs font-medium text-brown">{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
