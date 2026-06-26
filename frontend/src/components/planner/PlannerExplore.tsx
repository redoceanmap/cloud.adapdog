"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, MapPin, Plus, X } from "lucide-react";
import type { CourseAddStop } from "@/lib/planner-live";
import {
  fetchFestivals,
  fetchTrails,
  searchPlaces,
  type Festival,
  type PetPlace,
  type WalkingTrail,
} from "@/lib/planner-api";

const CHIPS = ["전체", "문화시설", "관광", "맛집", "둘레길", "숙박", "축제"] as const;
type Chip = (typeof CHIPS)[number];

const GRADS = [
  "from-sky-200 to-sky-400",
  "from-amber-200 to-amber-400",
  "from-green-200 to-green-400",
  "from-orange-200 to-orange-400",
  "from-violet-200 to-violet-400",
  "from-blue-200 to-blue-400",
  "from-rose-200 to-rose-400",
];

const SLOTS = [
  { key: "morning", label: "아침", clock: "09:00" },
  { key: "lunch", label: "점심", clock: "12:30" },
  { key: "afternoon", label: "오후", clock: "14:30" },
  { key: "dinner", label: "저녁", clock: "18:30" },
] as const;

interface ExploreCard {
  group: Chip;
  name: string;
  sub: string;
  tag: string;
  grad: string;
  source: string;
  addable?: boolean;
  category?: string;
  latitude?: number;
  longitude?: number;
}

interface PlannerExploreProps {
  region: string;
  hasCourse: boolean;
  courseNames: string[];
  days?: number;
  onAdd: (stop: CourseAddStop) => void;
  onRemove: (name: string) => void;
  onSuggest: (text: string) => void;
}

export default function PlannerExplore({
  region,
  hasCourse,
  courseNames,
  days = 1,
  onAdd,
  onRemove,
  onSuggest,
}: PlannerExploreProps) {
  const [chip, setChip] = useState<Chip>("전체");
  const [picking, setPicking] = useState<{
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pickDay, setPickDay] = useState(1);
  const [pickSlot, setPickSlot] = useState<(typeof SLOTS)[number]["key"]>("afternoon");
  const [festivals, setFestivals] = useState<Festival[] | null>(null);
  const [trails, setTrails] = useState<WalkingTrail[] | null>(null);
  const [places, setPlaces] = useState<PetPlace[] | null>(null);

  const openPicker = (p: {
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  }) => {
    setPickDay(1);
    setPickSlot("afternoon");
    setPicking(p);
  };

  const confirmAdd = () => {
    if (!picking) return;
    const slot = SLOTS.find((s) => s.key === pickSlot)!;
    onAdd({
      ...picking,
      day: pickDay,
      time_slot: slot.key,
      clock: slot.clock,
      is_meal: false,
    });
    setPicking(null);
  };

  useEffect(() => {
    const r = region?.trim();
    if (!r) return;
    setFestivals(null);
    setTrails(null);
    setPlaces(null);
    void fetchFestivals(r).then(setFestivals);
    void fetchTrails(r).then(setTrails);
    void searchPlaces(r).then(setPlaces);
  }, [region]);

  const area = region?.trim() ?? "";
  const loading = area ? !festivals || !trails || !places : false;

  const cards = useMemo<ExploreCard[]>(() => {
    const out: ExploreCard[] = [];
    (festivals ?? []).forEach((f, i) =>
      out.push({
        group: "축제",
        name: f.name,
        sub: `${f.start_date} ~ ${f.end_date}${f.pet_allowed ? " · 동반 가능" : ""}`,
        tag: "축제",
        grad: GRADS[i % GRADS.length],
        source: f.source,
      }),
    );
    (trails ?? []).slice(0, 8).forEach((t, i) =>
      out.push({
        group: "둘레길",
        name: t.name,
        sub: `${t.distance_km}km · ${t.difficulty} · ${t.duration}`,
        tag: "둘레길",
        grad: GRADS[(i + 2) % GRADS.length],
        source: "한국관광공사 두루누비",
      }),
    );
    const pick = (cats: string[], group: Chip, n: number) => {
      (places ?? [])
        .filter((p) => cats.some((c) => p.category.includes(c)))
        .slice(0, n)
        .forEach((p, i) =>
          out.push({
            group,
            name: p.name,
            sub: `${p.category} · 펫 동반`,
            tag: p.category,
            grad: GRADS[(i + 4) % GRADS.length],
            source: "한국문화정보원 펫동반 문화시설",
            addable: true,
            category: p.category,
            latitude: p.latitude,
            longitude: p.longitude,
          }),
        );
    };
    pick(["박물관", "미술관", "문예회관"], "문화시설", 9);
    pick(["여행지"], "관광", 9);
    pick(["식당", "카페"], "맛집", 9);
    pick(["숙박", "펜션"], "숙박", 9);
    return out;
  }, [festivals, trails, places]);

  const shown = chip === "전체" ? cards : cards.filter((c) => c.group === chip);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8"
      style={{ background: "var(--pw-bg)" }}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--pw-text)" }}>
          둘러보기
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--pw-muted)" }}>
          {area || "여행지"} 공공 문화데이터를 둘러보고 코스에 담아 보세요.
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {CHIPS.map((ch) => {
            const on = chip === ch;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setChip(ch)}
                className="shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-colors"
                style={{
                  background: on ? "var(--pw-accent)" : "var(--pw-panel-2)",
                  color: on ? "#fff" : "var(--pw-muted)",
                  border: `1px solid ${on ? "var(--pw-accent)" : "var(--pw-border)"}`,
                }}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {!area ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--pw-muted)" }}>
            코스를 만든 뒤 목적지 기준으로 둘러보기 데이터를 불러옵니다.
          </p>
        ) : loading ? (
          <div
            className="flex items-center justify-center gap-2 py-16 text-sm"
            style={{ color: "var(--pw-muted)" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            공공데이터 불러오는 중...
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((card, i) => {
              const editable =
                hasCourse &&
                card.addable &&
                card.latitude != null &&
                card.longitude != null;
              const inCourse = editable && courseNames.includes(card.name);
              return (
                <div
                  key={`${card.name}-${i}`}
                  className="overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: "var(--pw-border)",
                    background: "var(--pw-panel)",
                    boxShadow: "var(--pw-shadow)",
                  }}
                >
                  <div className={`relative h-28 bg-gradient-to-br ${card.grad}`}>
                    <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="truncate text-[15px] font-bold" style={{ color: "var(--pw-text)" }}>
                      {card.name}
                    </div>
                    <div className="mt-1 truncate text-xs" style={{ color: "var(--pw-muted)" }}>
                      {card.sub}
                    </div>
                    <div className="mt-2 text-[10px]" style={{ color: "var(--pw-faint)" }}>
                      출처: {card.source}
                    </div>
                    {editable ? (
                      inCourse ? (
                        <button
                          type="button"
                          onClick={() => onRemove(card.name)}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-[12px] font-bold text-red-600"
                        >
                          <X className="h-4 w-4" />
                          코스에서 제외
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openPicker({
                              name: card.name,
                              category: card.category || card.tag,
                              latitude: card.latitude!,
                              longitude: card.longitude!,
                            })
                          }
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-bold text-white"
                          style={{ background: "var(--pw-accent)" }}
                        >
                          <Plus className="h-4 w-4" />
                          이 경로 추가하기
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onSuggest(
                            card.group === "축제"
                              ? "축제 넣어줘"
                              : card.group === "둘레길"
                                ? "산책 추가"
                                : card.group === "숙박"
                                  ? "1박"
                                  : `${card.group} 추가`,
                          )
                        }
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-semibold"
                        style={{ borderColor: "var(--pw-border)", color: "var(--pw-accent)" }}
                      >
                        <MapPin className="h-4 w-4" />
                        AI에게 추천 요청
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {shown.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm" style={{ color: "var(--pw-muted)" }}>
                이 종류의 데이터가 없어요.
              </p>
            )}
          </div>
        )}
      </div>

      {picking && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-5"
          onClick={() => setPicking(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: "var(--pw-panel)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 border-b px-4 py-4"
              style={{ borderColor: "var(--pw-border)" }}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold" style={{ color: "var(--pw-text)" }}>
                  {picking.name}
                </div>
                <div className="text-[11px]" style={{ color: "var(--pw-muted)" }}>
                  어느 날 · 언제 추가할까요?
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPicking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--pw-panel-2)", color: "var(--pw-muted)" }}
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              {days > 1 && (
                <>
                  <div className="mb-2 text-xs font-bold" style={{ color: "var(--pw-muted)" }}>
                    며칠째
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                      const on = pickDay === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPickDay(d)}
                          className="rounded-xl px-4 py-2 text-[13px] font-bold"
                          style={{
                            background: on ? "var(--pw-accent)" : "var(--pw-panel-2)",
                            color: on ? "#fff" : "var(--pw-muted)",
                            border: `1px solid ${on ? "var(--pw-accent)" : "var(--pw-border)"}`,
                          }}
                        >
                          Day {d}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="mb-2 text-xs font-bold" style={{ color: "var(--pw-muted)" }}>
                시간대
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => {
                  const on = pickSlot === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setPickSlot(s.key)}
                      className="rounded-xl px-3 py-2.5 text-left text-[13px] font-bold"
                      style={{
                        background: on ? "var(--pw-accent-soft)" : "var(--pw-panel-2)",
                        color: on ? "var(--pw-accent)" : "var(--pw-text)",
                        border: `1px solid ${on ? "var(--pw-accent)" : "var(--pw-border)"}`,
                      }}
                    >
                      {s.label}
                      <span className="ml-1 text-[11px] font-semibold" style={{ color: "var(--pw-faint)" }}>
                        {s.clock}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={confirmAdd}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
                style={{ background: "var(--pw-accent)" }}
              >
                <Check className="h-4 w-4" />
                {days > 1 ? `Day ${pickDay} ` : ""}
                {SLOTS.find((s) => s.key === pickSlot)!.label}에 추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
