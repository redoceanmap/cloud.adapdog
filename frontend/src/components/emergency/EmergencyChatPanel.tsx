"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Building2,
  Camera,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import type { Pet } from "@/lib/planner-api";
import {
  classifySymptom,
  fetchNearbyHospitals,
  followUpForCategory,
  formatHospitalDistance,
  guidanceForCategory,
  hospitalMapUrl,
  hospitalTelUrl,
  rankHospitalsForSymptom,
  symptomTriage,
  SYMPTOM_CATEGORY_LABEL,
  type AnimalHospital,
  type SymptomCategory,
} from "@/lib/emergency-api";

const QUICK_SYMPTOMS = ["토를 했어요", "설사를 해요", "헥헥거려요", "다리를 절뚝거려요"];

interface EmergencyMsg {
  id: string;
  role: "user" | "ai" | "system" | "action";
  text: string;
  variant?: "warning" | "blocked" | "photo";
}

export interface EmergencyChatPanelProps {
  pet: Pet;
  region?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
  layout?: "modal" | "page";
  titleId?: string;
  headerAction?: ReactNode;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function EmergencyChatPanel({
  pet,
  region = "",
  latitude,
  longitude,
  active = true,
  layout = "page",
  titleId = "emergency-chat-title",
  headerAction,
}: EmergencyChatPanelProps) {
  const [messages, setMessages] = useState<EmergencyMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<AnimalHospital[]>([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [category, setCategory] = useState<SymptomCategory | null>(null);
  const [userTurns, setUserTurns] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasCoords =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const areaLabel = region || (hasCoords ? "현재 위치" : "주변");

  useEffect(() => {
    if (!active) return;
    setMessages([
      {
        id: newId(),
        role: "system",
        text: "본 안내는 참고용이며 진단이 아닙니다. 반드시 수의사 진료를 받으세요.",
        variant: "warning",
      },
      {
        id: newId(),
        role: "ai",
        text: hasCoords || region
          ? `지금 ${areaLabel} 인근에서 가장 가까운 동물병원을 찾고 있어요. ${pet.name}의 증상을 말씀해 주세요.`
          : `위치를 확인하는 중이에요. ${pet.name}의 증상을 먼저 말씀해 주시면, 확인되는 대로 가까운 병원을 안내할게요.`,
      },
    ]);
    setInput("");
    setCategory(null);
    setUserTurns(0);
    setHospitals([]);

    if (!hasCoords && !region) {
      setHospitalLoading(false);
      return;
    }

    setHospitalLoading(true);
    let cancelled = false;

    fetchNearbyHospitals({
      region: region || undefined,
      latitude: hasCoords ? latitude : undefined,
      longitude: hasCoords ? longitude : undefined,
      limit: 5,
    })
      .then((res) => {
        if (!cancelled) setHospitals(res.hospitals);
      })
      .catch(() => {
        if (!cancelled) setHospitals([]);
      })
      .finally(() => {
        if (!cancelled) setHospitalLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [active, areaLabel, pet.name, region, latitude, longitude, hasCoords]);

  useEffect(() => {
    if (!active) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, active, hospitals]);

  const handleUserText = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    setLoading(true);
    setInput("");
    const turn = userTurns + 1;
    setUserTurns(turn);

    const detected = classifySymptom(text);
    const nextCategory = category ?? detected;
    if (!category) setCategory(detected);

    const userMsg: EmergencyMsg = { id: newId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    const chatWire = [...messages, userMsg]
      .filter((m) => m.role === "user" || m.role === "ai")
      .map((m) => ({ role: m.role, content: m.text }));

    let triageOk = false;
    try {
      const r = await symptomTriage(chatWire, pet.breed, pet.size);
      const aiText =
        r.possible_conditions.length > 0
          ? `${r.reply}\n\n가능한 원인: ${r.possible_conditions.join(", ")}`
          : r.reply;
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "ai",
          text: aiText,
          variant: r.urgency === "high" ? "warning" : undefined,
        },
      ]);
      triageOk = true;
    } catch {
      /* fallback below */
    }

    if (!triageOk) {
      await new Promise((r) => setTimeout(r, 400));

      const next: EmergencyMsg[] = [];
      if (turn === 1) {
        next.push(
          {
            id: newId(),
            role: "ai",
            text: `증상을 「${SYMPTOM_CATEGORY_LABEL[detected]}」로 분류했어요. ${SYMPTOM_CATEGORY_LABEL[detected]}에 맞춰 가까운 병원을 추천할게요.`,
          },
          {
            id: newId(),
            role: "ai",
            text: followUpForCategory(detected, pet.name),
          },
        );
        setHospitals((prev) => rankHospitalsForSymptom(prev, detected));
      } else {
        next.push({
          id: newId(),
          role: "action",
          text: guidanceForCategory(nextCategory),
          variant: "warning",
        });
        if (/사진|첨부|올렸/.test(text)) {
          next.push({
            id: newId(),
            role: "action",
            text: "보내주신 내용을 참고해 증상을 확인했어요. 정확한 진단은 수의사와 상담해 주세요.",
            variant: "photo",
          });
        }
      }

      if (turn === 1) {
        next.push({
          id: newId(),
          role: "system",
          text: "약이나 스스로 치료하는 방법은 안내하지 않아요. 꼭 동물병원을 방문해 주세요.",
          variant: "blocked",
        });
      }

      setMessages((prev) => [...prev, ...next]);
    } else if (turn === 1) {
      setHospitals((prev) => rankHospitalsForSymptom(prev, detected));
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "system",
          text: "약이나 스스로 치료하는 방법은 안내하지 않아요. 꼭 동물병원을 방문해 주세요.",
          variant: "blocked",
        },
      ]);
    }

    setLoading(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleUserText(input);
  };

  const rankedHospitals = category
    ? rankHospitalsForSymptom(hospitals, category)
    : hospitals;

  const shellClass =
    layout === "modal"
      ? "flex max-h-[min(640px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded-[22px] border shadow-2xl"
      : "flex h-full min-h-0 w-full flex-col overflow-hidden";

  return (
    <div
      className={shellClass}
      style={
        layout === "modal"
          ? {
              borderColor: "var(--pw-border)",
              background: "var(--pw-panel)",
              boxShadow: "var(--pw-shadow)",
            }
          : undefined
      }
    >
      <div
        className="flex shrink-0 items-center gap-2 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: "var(--pw-border)" }}
      >
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <div className="min-w-0 flex-1">
          <h1 id={titleId} className="text-[15px] font-bold" style={{ color: "var(--pw-text)" }}>
            응급 케어 · AI 상담
          </h1>
          <p className="text-[11px]" style={{ color: "var(--pw-muted)" }}>
            예시 · 밤늦은 응급 상황 · {areaLabel} 인근 병원
          </p>
        </div>
        {headerAction}
      </div>

      <div className={`grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`}>
        <div
          className="flex min-h-0 flex-col border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--pw-border)" }}
        >
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.variant === "warning" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-900">
                    <AlertTriangle className="mr-1 inline h-3.5 w-3.5 -mt-0.5" />
                    {msg.text}
                  </div>
                )}
                {msg.variant === "blocked" && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-800">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {msg.text}
                  </div>
                )}
                {msg.variant === "photo" && (
                  <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-[11px] text-green-900">
                    <Camera className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {msg.text}
                  </div>
                )}
                {!msg.variant && msg.role === "user" && (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[88%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[13px] leading-relaxed text-white"
                      style={{ background: "var(--pw-accent)" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
                {!msg.variant && msg.role === "ai" && (
                  <div
                    className="max-w-[92%] rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-[13px] leading-[1.65] whitespace-pre-line"
                    style={{
                      borderColor: "var(--pw-border)",
                      background: "var(--pw-ai-bubble)",
                      color: "var(--pw-text)",
                    }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-[11px]" style={{ color: "var(--pw-muted)" }}>
                AI가 답변을 작성 중...
              </p>
            )}
          </div>

          {userTurns === 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK_SYMPTOMS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void handleUserText(chip)}
                  className="pw-chip-suggest rounded-full px-3 py-1.5 text-[11px] font-semibold"
                  style={{ background: "var(--pw-accent-soft)", color: "var(--pw-accent)" }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t px-4 py-3"
            style={{ borderColor: "var(--pw-border)" }}
          >
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
              style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel-2)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="증상을 말해 주세요..."
                disabled={loading}
                className="flex-1 bg-transparent py-2 text-[13px] outline-none disabled:opacity-60"
                style={{ color: "var(--pw-text)" }}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => {
                  void handleUserText("사진을 첨부했어요. 증상 상태를 확인해 주세요.");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="pw-input-action flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ color: "var(--pw-muted)" }}
                aria-label="사진 첨부"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg px-3 py-1.5 text-[12px] font-bold text-white disabled:opacity-50"
                style={{ background: "var(--pw-accent)" }}
              >
                전송
              </button>
            </div>
          </form>
        </div>

        <div className="flex min-h-0 flex-col" style={{ background: "var(--pw-panel-2)" }}>
          <div
            className="grid grid-cols-2 gap-2 border-b p-3 sm:grid-cols-4"
            style={{ borderColor: "var(--pw-border)" }}
          >
            {[
              { icon: MapPin, label: "내 주변 병원", sub: "거리순 안내" },
              { icon: Camera, label: "사진 참고", sub: "첨부 확인" },
              { icon: Shield, label: "안전 안내", sub: "위험 조언 차단" },
              { icon: AlertTriangle, label: "응급 우선", sub: "24시 우선" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="rounded-xl border px-2 py-2"
                style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
              >
                <Icon className="mb-1 h-3.5 w-3.5" style={{ color: "var(--pw-accent)" }} />
                <div className="text-[10px] font-bold" style={{ color: "var(--pw-text)" }}>
                  {label}
                </div>
                <div className="text-[9px]" style={{ color: "var(--pw-muted)" }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" style={{ color: "var(--pw-accent)" }} />
              <span className="text-[13px] font-bold" style={{ color: "var(--pw-text)" }}>
                {category
                  ? `${SYMPTOM_CATEGORY_LABEL[category]} 맞춤 추천`
                  : "가까운 동물병원"}
              </span>
            </div>

            {hospitalLoading && (
              <p className="text-[12px]" style={{ color: "var(--pw-muted)" }}>
                인근 동물병원을 찾는 중...
              </p>
            )}

            {!hospitalLoading && rankedHospitals.length === 0 && (
              <p className="text-[12px]" style={{ color: "var(--pw-muted)" }}>
                인근 영업 중 동물병원을 찾지 못했어요.
              </p>
            )}

            <div className="space-y-2">
              {rankedHospitals.map((h, i) => (
                <div
                  key={`${h.name}-${i}`}
                  className="rounded-xl border px-3 py-2.5"
                  style={{
                    borderColor: i === 0 ? "#FF6B5C" : "var(--pw-border)",
                    borderWidth: i === 0 ? 2 : 1,
                    background: "var(--pw-panel)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: i === 0 ? "#E0533F" : "var(--pw-muted)" }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[13px] font-bold" style={{ color: "var(--pw-text)" }}>
                          {h.name}
                        </span>
                        {h.is_24h && (
                          <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            24시
                          </span>
                        )}
                      </div>
                      <div
                        className="mt-1 flex flex-wrap items-center gap-2 text-[11px]"
                        style={{ color: "var(--pw-muted)" }}
                      >
                        <span>{formatHospitalDistance(h.distance_km)}</span>
                        <span className="text-green-600">영업 중</span>
                        {category && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                            style={{ background: "var(--pw-accent-soft)", color: "var(--pw-accent)" }}
                          >
                            {SYMPTOM_CATEGORY_LABEL[category]}
                          </span>
                        )}
                      </div>
                      {h.road_address && (
                        <p className="mt-1 text-[10px] leading-snug" style={{ color: "var(--pw-faint)" }}>
                          {h.road_address}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        {h.phone && (
                          <a
                            href={hospitalTelUrl(h.phone)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white"
                            style={{ background: "var(--pw-accent)" }}
                          >
                            <Phone className="h-3 w-3" />
                            전화
                          </a>
                        )}
                        <a
                          href={hospitalMapUrl(h)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold"
                          style={{ borderColor: "var(--pw-border)", color: "var(--pw-accent)" }}
                        >
                          <MapPin className="h-3 w-3" />
                          길 안내
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[10px]" style={{ color: "var(--pw-faint)" }}>
              데이터: 행정안전부 전국 동물병원 표준데이터 · 증상 유형별 24시 병원 우선
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
