"use client";

import { motion } from "framer-motion";
import { Video, MapPin, Subtitles, BookOpen, Heart, Mic } from "lucide-react";

const features = [
  {
    icon: SparklesIcon,
    tag: "핵심",
    title: "AI 페르소나 & 여행 크로니클",
    description:
      "견종, 성격, 표정 데이터로 강아지만의 고유한 '목소리'를 만들어요. 자기소개, 코스 추천, 여행 일기, 발자국 지도, 연말 요약 카드까지.",
    color: "coral",
    highlights: ["자기소개", "코스 추천", "여행 일기", "발자국 지도", "연말 요약"],
  },
  {
    icon: Video,
    tag: "바이럴",
    title: "강아지 시점 AI 브이로그",
    description:
      "여행 경로와 촬영 사진으로 인스타 릴스 스타일의 세로형 영상을 자동 생성. SNS 공유에 최적화된 콘텐츠.",
    color: "lavender",
    highlights: ["릴스 자동 생성", "여행 하이라이트", "SNS 공유"],
  },
  {
    icon: MapPin,
    tag: "가이드",
    title: "AI 아바타 가이드",
    description:
      "강아지 사진 한 장으로 AI 아바타를 생성하고, 디지털 지도 위에서 아바타가 코스를 따라 걸으며 안내해요.",
    color: "sage",
    highlights: ["사진 1장 업로드", "3D 아바타", "실시간 안내"],
  },
  {
    icon: Heart,
    tag: "케어",
    title: "표정·컨디션 인식",
    description:
      "AI-Hub 행동/표정 데이터로 강아지 컨디션을 실시간 파악하고, 피곤해 보이면 산책 코스를 자동으로 조절해요.",
    color: "gold",
    highlights: ["실시간 표정 분석", "코스 자동 조절", "안전 여행"],
  },
  {
    icon: Subtitles,
    tag: "MZ",
    title: "AI 더빙 & 속마음 자막",
    description:
      "여행 영상 속 강아지 표정과 행동을 분석해 '속마음' 자막을 생성. '이 카페 별로야...' '여기 그늘 최고!'",
    color: "coral",
    highlights: ["표정 분석", "유머 자막", "바이럴 콘텐츠"],
  },
  {
    icon: BookOpen,
    tag: "굿즈",
    title: "AI 여행 그림책 & 인생네컷",
    description:
      "여행 기록으로 AI 그림책이나 인생네컷을 자동 생성. 실물 포토북·굿즈 주문도 가능해요.",
    color: "lavender",
    highlights: ["AI 그림책", "인생네컷", "실물 굿즈"],
  },
  {
    icon: Heart,
    tag: "재미",
    title: "보호자 MBTI × 강아지 케미",
    description:
      "보호자 MBTI와 강아지 성격 테스트로 케미 점수를 계산하고, 맞춤 여행 코스를 추천. 커플 테스트처럼 공유하세요!",
    color: "sage",
    highlights: ["MBTI 테스트", "케미 점수", "맞춤 코스"],
  },
  {
    icon: Mic,
    tag: "오디오",
    title: "AI 보이스 가이드",
    description:
      "견종과 크기에 맞춘 AI 음성으로 여행 가이드와 일기를 들려줘요. 시각이 아닌 청각 경험에 집중.",
    color: "gold",
    highlights: ["견종별 음성", "여행 가이드", "일기 낭독"],
  },
];

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" />
    </svg>
  );
}

const colorMap: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  coral: { bg: "bg-coral/10", text: "text-coral", border: "border-coral/20", tag: "bg-coral/15 text-coral" },
  sage: { bg: "bg-sage/10", text: "text-sage", border: "border-sage/20", tag: "bg-sage/15 text-sage" },
  gold: { bg: "bg-gold/10", text: "text-yellow-700", border: "border-gold/30", tag: "bg-gold/15 text-yellow-700" },
  lavender: { bg: "bg-lavender/10", text: "text-purple-600", border: "border-lavender/30", tag: "bg-lavender/15 text-purple-600" },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-coral uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mt-2 mb-4">
            강아지 눈으로 보는 여행의 모든 것
          </h2>
          <p className="text-brown-light max-w-xl mx-auto">
            AI가 만드는 반려동물 중심 여행 경험. 기억은 유지, 굿즈는 수익 — 감성과 기술이 만나는 플랫폼.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl p-6 border ${colors.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.tag}`}>
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-brown mb-2">{feature.title}</h3>
                    <p className="text-sm text-brown-light leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {feature.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-cream text-brown-light px-2 py-0.5 rounded-full"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
