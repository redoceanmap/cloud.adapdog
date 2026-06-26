"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  Camera,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Shield,
  Volume2,
} from "lucide-react";

const VOICE_FLOW = [
  { icon: Mic, label: "말하기", desc: "음성으로 물어보기" },
  { icon: MessageCircle, label: "이해하기", desc: "말의 뜻 파악" },
  { icon: Shield, label: "맞춤 안내", desc: "상황에 맞는 답변" },
  { icon: Volume2, label: "들려주기", desc: "음성으로 설명" },
];

interface EmergencyMsg {
  id: string;
  role: "user" | "ai" | "system" | "action";
  text: string;
  variant?: "warning" | "blocked" | "hospital";
}

const EMERGENCY_SCRIPT: EmergencyMsg[] = [
  {
    id: "s1",
    role: "system",
    text: "본 안내는 참고용이며 진단이 아닙니다. 반드시 수의사 진료를 받으세요.",
    variant: "warning",
  },
  {
    id: "a1",
    role: "ai",
    text: "지금 위치에서 가장 가까운 24시간 동물병원 3곳을 먼저 보여드릴게요. 동시에 몇 가지만 확인할게요.",
  },
  {
    id: "a2",
    role: "ai",
    text: "토한 횟수는 몇 번이고, 시간 간격은 어떻게 되나요?\n토 내용물 색이나 형태가 어땠나요? (사진 첨부 가능)\n다른 증상이 있나요? (무기력·설사·떨림·식욕 없음 등)",
  },
  {
    id: "u1",
    role: "user",
    text: "강아지가 갑자기 토를 했어요 어떻게 하죠",
  },
  {
    id: "u2",
    role: "user",
    text: "30분 사이에 3번이고 노란 거품이 나와요. 사진 첨부했어요",
  },
  {
    id: "act1",
    role: "action",
    text: "30분 안에 여러 번 토했다면 응급일 수 있어요. 가능한 빨리 동물병원에 가 주세요.",
    variant: "warning",
  },
  {
    id: "act2",
    role: "action",
    text: "보내주신 사진을 참고해 증상을 확인했어요. 정확한 진단은 수의사와 상담해 주세요.",
    variant: "hospital",
  },
  {
    id: "blocked",
    role: "system",
    text: "약이나 스스로 치료하는 방법은 안내하지 않아요. 꼭 동물병원을 방문해 주세요.",
    variant: "blocked",
  },
];

const ORDERED_EMERGENCY: EmergencyMsg[] = [
  EMERGENCY_SCRIPT.find((m) => m.id === "u1")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "s1")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "a1")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "a2")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "u2")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "act1")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "act2")!,
  EMERGENCY_SCRIPT.find((m) => m.id === "blocked")!,
];

const HOSPITALS = [
  { name: "○○ 24시 동물메디컬센터", dist: "1.2km", open: true },
  { name: "△△ 응급동물병원", dist: "2.8km", open: true },
  { name: "□□ 야간동물병원", dist: "4.1km", open: true },
];

export default function AIVoiceEmergencySection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showHospitals, setShowHospitals] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    setShowHospitals(false);
    const timers: ReturnType<typeof setTimeout>[] = [];

    ORDERED_EMERGENCY.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), (i + 1) * 1400));
    });

    timers.push(
      setTimeout(() => setShowHospitals(true), ORDERED_EMERGENCY.length * 1400 + 600),
    );

    timers.push(
      setTimeout(() => setLoopKey((k) => k + 1), ORDERED_EMERGENCY.length * 1400 + 9000),
    );

    return () => timers.forEach(clearTimeout);
  }, [loopKey]);

  const visible = ORDERED_EMERGENCY.slice(0, visibleCount);

  return (
    <section id="ai-voice" className="py-24 bg-ink text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-sage-light bg-sage/20 px-4 py-1.5 rounded-full mb-4">
            AI 음성 상담 · 응급 도움
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            말하면 듣고, 위급하면
            <br />
            <span className="text-sage-light">즉시 안전하게</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            말로 물어보면 코코가 듣고, 상황에 맞게 답해 드려요.
            밤늦은 응급 상황에서는 안전 안내와 가까운 24시 동물병원 연결을 먼저 도와드립니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-3 md:gap-2 mb-14"
        >
          {VOICE_FLOW.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 md:gap-3">
                <div className="flex flex-col items-center gap-2 bg-white/10 rounded-2xl px-4 py-3 border border-white/10 min-w-[100px]">
                  <div className="w-10 h-10 rounded-xl bg-sage/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sage-light" />
                  </div>
                  <span className="text-xs font-bold">{step.label}</span>
                  <span className="text-[10px] text-white/50 text-center">{step.desc}</span>
                </div>
                {i < VOICE_FLOW.length - 1 && (
                  <span className="text-sage-light text-lg hidden sm:block">→</span>
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-coral-light" />
              <span className="text-sm font-bold">예시 · 밤늦은 응급 상황</span>
            </div>

            <div className="space-y-3 min-h-[360px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((msg) => (
                  <motion.div
                    key={`${loopKey}-${msg.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      msg.role === "user"
                        ? "flex justify-end"
                        : msg.role === "system" || msg.role === "action"
                          ? "w-full"
                          : "flex justify-start"
                    }
                  >
                    {msg.variant === "warning" && (
                      <div className="w-full bg-coral/20 border border-coral/40 text-coral-light text-xs px-4 py-3 rounded-xl leading-relaxed">
                        <AlertTriangle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                        {msg.text}
                      </div>
                    )}
                    {msg.variant === "blocked" && (
                      <div className="w-full bg-red-500/15 border border-red-400/30 text-red-200 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
                        <Shield className="w-4 h-4 shrink-0" />
                        {msg.text}
                      </div>
                    )}
                    {msg.variant === "hospital" && (
                      <div className="w-full bg-sage/15 border border-sage/30 text-sage-light text-xs px-4 py-3 rounded-xl flex items-start gap-2">
                        <Camera className="w-4 h-4 shrink-0 mt-0.5" />
                        {msg.text}
                      </div>
                    )}
                    {!msg.variant && msg.role === "user" && (
                      <div className="max-w-[85%] bg-sage text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm">
                        {msg.text}
                      </div>
                    )}
                    {!msg.variant && msg.role === "ai" && (
                      <div className="max-w-[90%] bg-white/10 text-white/90 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <AnimatePresence initial={false}>
              {showHospitals && (
                <motion.div
                  key={`hospitals-${loopKey}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white/5 rounded-3xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-sage-light" />
                    <span className="text-sm font-bold">가까운 24시 동물병원</span>
                    <span className="text-[10px] text-white/40 ml-auto">내 주변 병원 정보</span>
                  </div>
                  <div className="space-y-2">
                    {HOSPITALS.map((h, i) => (
                      <div
                        key={h.name}
                        className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {i + 1}. {h.name}
                          </div>
                          <div className="text-xs text-white/50">{h.dist} · 24시간 운영</div>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 bg-sage text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          전화
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "내 주변 병원", desc: "가까운 곳부터 안내", icon: MapPin },
                { label: "사진 확인", desc: "보내주신 사진 참고", icon: Camera },
                { label: "안전한 안내", desc: "위험한 조언은 하지 않아요", icon: Shield },
                { label: "응급 우선", desc: "위급하면 병원 연결 먼저", icon: AlertTriangle },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-xl p-3 border border-white/10"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sage-light">
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </div>
                  <div className="text-[11px] text-white/50 mt-1">{item.desc}</div>
                </div>
              );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
