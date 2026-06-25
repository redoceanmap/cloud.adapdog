"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  Building2,
  Camera,
  Mic,
  Phone,
  Shield,
  Volume2,
} from "lucide-react";

const VOICE_FLOW = [
  { icon: Mic, label: "STT", desc: "사용자 음성 입력" },
  { icon: Brain, label: "NLP / NLU", desc: "자연어 이해" },
  { icon: Shield, label: "AI 답변", desc: "맞춤 응답 생성" },
  { icon: Volume2, label: "TTS", desc: "음성으로 안내" },
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
    text: "30분 내 반복 구토는 응급 신호일 수 있습니다. 즉시 동물병원 방문 권장",
    variant: "warning",
  },
  {
    id: "act2",
    role: "action",
    text: "비전 모델 사진 분석 결과 (신뢰도 78%) — 참고용, 진단 아님",
    variant: "hospital",
  },
  {
    id: "blocked",
    role: "system",
    text: "약·용량 안내 차단 · 보호자 자가 처치 절대 권장 안 함",
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
            AI 음성 · 응급 대응
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            말하면 듣고, 위급하면
            <br />
            <span className="text-sage-light">즉시 안전하게</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            음성 입력(STT)부터 자연어 이해(NLU), AI 답변, 음성 안내(TTS)까지.
            야간 응급 상황에서는 안전 문구와 24시 동물병원을 최우선으로 연결합니다.
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
              <span className="text-sm font-bold">페르소나: 30대 1인 가구 · 야간 응급</span>
            </div>

            <div className="space-y-3 min-h-[360px]">
              <AnimatePresence mode="popLayout">
                {visible.map((msg) => (
                  <motion.div
                    key={msg.id}
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
            <AnimatePresence>
              {showHospitals && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-3xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-sage-light" />
                    <span className="text-sm font-bold">가까운 24시 동물병원</span>
                    <span className="text-[10px] text-white/40 ml-auto">행정안전부 표준데이터</span>
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
                { label: "위치 정보", desc: "GPS 기반 병원 검색" },
                { label: "비전 분석", desc: "사진 참고 (진단 아님)" },
                { label: "약물 차단", desc: "시스템 레벨 안전장치" },
                { label: "응급 우선", desc: "안전 문구 최우선 표시" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-xl p-3 border border-white/10"
                >
                  <div className="text-xs font-bold text-sage-light">{item.label}</div>
                  <div className="text-[11px] text-white/50 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
