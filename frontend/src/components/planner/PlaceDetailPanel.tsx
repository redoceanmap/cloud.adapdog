"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Map,
  MapPin,
  Route,
  Shield,
  Star,
  Wallet,
  XCircle,
} from "lucide-react";
import type { EntryVerdictResult, Pet, Review, RouteStop, TripPlan } from "@/lib/planner-api";
import { categoryLabel, checkEntry, fetchReviews, sizeLabel } from "@/lib/planner-api";
import {
  buildDescription,
  buildIntercityLeg,
  buildPopularSpots,
  buildStopLeg,
  formatDuration,
  estimateDriveMinutes,
  haversineKm,
  placeHeroGrad,
  placeHeroIcon,
  placeHoursHint,
  placeLocationHint,
  placePriceHint,
  stopScheduleLabel,
  type TravelLeg,
} from "@/lib/planner-journey";
import { fetchDrivingLegMinutes } from "@/lib/routing";

const DETAIL_TABS = ["개요", "입장 정책", "위치", "후기"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

const VERDICT_STYLE = {
  allowed: { label: "입장 가능", className: "text-green-700", bg: "bg-green-50 border-green-100", icon: CheckCircle2 },
  conditional: { label: "조건부 가능", className: "text-amber-700", bg: "bg-amber-50 border-amber-100", icon: CheckCircle2 },
  denied: { label: "동반 불가", className: "text-red-600", bg: "bg-red-50 border-red-100", icon: XCircle },
} as const;

function Msf({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`msf leading-none ${className}`}>{name}</span>;
}

function TravelLegCard({ leg, highlight }: { leg: TravelLeg; highlight?: boolean }) {
  return (
    <div
      className="flex gap-2.5 rounded-xl border px-3 py-2.5"
      style={{
        borderColor: highlight ? "var(--pw-accent)" : "var(--pw-border)",
        background: highlight ? "var(--pw-accent-soft)" : "var(--pw-panel-2)",
      }}
    >
      <Route
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: highlight ? "var(--pw-accent)" : "var(--pw-muted)" }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold" style={{ color: "var(--pw-text)" }}>
          {leg.from} → {leg.to} · {leg.mode}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--pw-muted)" }}>
          {leg.detail}
        </p>
      </div>
    </div>
  );
}

interface PlaceDetailPanelProps {
  stop: RouteStop | null;
  prevStop: RouteStop | null;
  nextStop: RouteStop | null;
  pet: Pet;
  region: string;
  tripPlan: TripPlan | null;
  hasCourse: boolean;
  stopIndex: number;
  onRemoveFromCourse?: () => void;
}

export default function PlaceDetailPanel({
  stop,
  prevStop,
  nextStop,
  pet,
  region,
  tripPlan,
  hasCourse,
  stopIndex,
  onRemoveFromCourse,
}: PlaceDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("개요");
  const [verdict, setVerdict] = useState<EntryVerdictResult | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [toNextLeg, setToNextLeg] = useState<TravelLeg | null>(null);

  const transport = tripPlan?.transport ?? "unset";

  useEffect(() => {
    setActiveTab("개요");
    if (!stop || !hasCourse) {
      setVerdict(null);
      setReviews([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setVerdict(null);
    setReviews([]);

    Promise.all([
      checkEntry(region, stop.name, pet).catch(() => null),
      fetchReviews(stop.name).catch(() => [] as Review[]),
    ]).then(([v, r]) => {
      if (cancelled) return;
      if (v) setVerdict(v);
      setReviews(r);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [stop?.name, hasCourse, pet, region]);

  useEffect(() => {
    if (!stop || !nextStop) {
      setToNextLeg(null);
      return;
    }
    let cancelled = false;
    const km =
      nextStop.distance_from_prev_km ||
      haversineKm(
        { lat: stop.latitude, lng: stop.longitude },
        { lat: nextStop.latitude, lng: nextStop.longitude },
      );
    const fallback = buildStopLeg(stop, nextStop, km);
    setToNextLeg(fallback);

    fetchDrivingLegMinutes(
      { lat: stop.latitude, lng: stop.longitude },
      { lat: nextStop.latitude, lng: nextStop.longitude },
    ).then((minutes) => {
      if (cancelled || minutes == null) return;
      setToNextLeg({
        from: stop.name,
        to: nextStop.name,
        mode: "자차",
        detail: `${km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`} · ${formatDuration(minutes)}`,
        minutes,
        km,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [stop, nextStop]);

  if (!hasCourse) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: "var(--pw-panel-2)" }}
      >
        <Map className="mb-3 h-10 w-10" style={{ color: "var(--pw-faint)" }} />
        <p className="text-sm font-bold" style={{ color: "var(--pw-text)" }}>
          아직 코스가 없어요
        </p>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--pw-muted)" }}>
          채팅에서 가고 싶은 지역을 말하면
          <br />
          실제 공공데이터로 코스를 짜드려요.
        </p>
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        장소를 선택해 주세요.
      </div>
    );
  }

  const grad = placeHeroGrad(stopIndex);
  const heroIcon = placeHeroIcon(stop.category);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.6";
  const verdictStyle = verdict ? VERDICT_STYLE[verdict.verdict] : null;
  const VerdictIcon = verdictStyle?.icon ?? CheckCircle2;

  const intercityLeg = stopIndex === 0 ? buildIntercityLeg(tripPlan, region) : null;
  const fromPrevLeg =
    prevStop && stopIndex > 0
      ? buildStopLeg(
          prevStop,
          stop,
          stop.distance_from_prev_km ||
            haversineKm(
              { lat: prevStop.latitude, lng: prevStop.longitude },
              { lat: stop.latitude, lng: stop.longitude },
            ),
        )
      : null;

  const entryLabel = verdictStyle?.label ?? "확인 중";
  const entryNote =
    verdict?.conditions.slice(0, 3).join(" · ") ||
    verdict?.message ||
    `${sizeLabel(pet.size)} 동반 규정 확인 중`;
  const popular = buildPopularSpots(
    stop,
    verdict?.alternatives?.map((a) => ({ name: a.name, category: a.category })),
  );
  const description = buildDescription(stop, pet.name, verdict?.message);
  const schedule = stopScheduleLabel(stopIndex, transport);
  const dataSource = stop.source || "한국문화정보원 펫동반 문화시설";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: "var(--pw-border)" }}
      >
        <span className="text-[12px] font-bold" style={{ color: "var(--pw-text)" }}>
          {schedule} · {region} 코스
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 px-4 pt-3">
          {(intercityLeg || fromPrevLeg) && (
            <div className="space-y-2">
              {intercityLeg && <TravelLegCard leg={intercityLeg} />}
              {fromPrevLeg && <TravelLegCard leg={fromPrevLeg} />}
            </div>
          )}

          <div
            className="relative flex aspect-[5/3] max-h-44 items-center justify-center overflow-hidden rounded-2xl"
            style={{ background: grad }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(255,255,255,.12) 0 12px, transparent 12px 24px)",
              }}
            />
            <Msf name={heroIcon} className="text-[52px] text-white/60" />
            <span className="absolute bottom-2.5 left-3 rounded-lg bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white">
              {stop.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--pw-text)" }}>
              {stop.name}
            </h3>
            <span className="inline-flex items-center gap-0.5 text-[13px] font-bold text-orange-500">
              <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
              {avgRating}
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold"
            style={{ color: "var(--pw-muted)" }}
          >
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" />
              {placePriceHint(stop.category)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {placeHoursHint(stop.category)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {placeLocationHint(region, stop.category)}
            </span>
          </div>

          {toNextLeg && (
            <div>
              <p className="mb-1.5 text-[11px] font-bold text-gray-500">다음 장소까지</p>
              <TravelLegCard leg={toNextLeg} highlight />
            </div>
          )}

          <div className="flex gap-4 border-b" style={{ borderColor: "var(--pw-border)" }}>
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pw-tab -mb-px pb-2.5 text-[12px] font-bold ${activeTab === tab ? "pw-tab--active" : ""}`}
                style={{
                  color: activeTab === tab ? "var(--pw-accent)" : "var(--pw-muted)",
                  borderBottom:
                    activeTab === tab ? "2px solid var(--pw-accent)" : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-4 py-3">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              입장 정책·후기 불러오는 중...
            </div>
          )}

          {activeTab === "개요" && (
            <div className="space-y-4">
              {verdictStyle && (
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700">
                  <Msf name="verified" className="text-[15px]" />
                  {pet.name} {entryLabel} · {entryNote}
                </div>
              )}

              <div>
                <p className="mb-1.5 text-[13px] font-extrabold" style={{ color: "var(--pw-text)" }}>
                  설명
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--pw-muted)" }}>
                  {description}
                </p>
              </div>

              <div>
                <p className="mb-2.5 text-[13px] font-extrabold text-gray-900">함께 가기 좋은 곳</p>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {popular.map((p) => (
                    <div
                      key={p.name}
                      className="w-28 shrink-0 overflow-hidden rounded-xl border"
                      style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
                    >
                      <div className="h-16 opacity-90" style={{ background: grad }} />
                      <div className="px-2.5 py-2">
                        <p className="text-[11px] font-bold text-gray-800">{p.name}</p>
                        <p className="mt-0.5 text-[10px] text-gray-500">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-gray-400">데이터: {dataSource}</p>
            </div>
          )}

          {activeTab === "입장 정책" && (
            <div className="space-y-3">
              {verdict && verdictStyle ? (
                <>
                  <div
                    className={`rounded-2xl border border-l-4 border-l-green-500 px-3.5 py-3 ${verdictStyle.bg}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <VerdictIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`text-[13px] font-extrabold ${verdictStyle.className}`}>
                          {pet.name} · {verdictStyle.label}
                        </p>
                        <p className="mt-1 text-[12px] leading-relaxed text-gray-700">{verdict.message}</p>
                      </div>
                    </div>
                  </div>

                  {verdict.conditions.length > 0 && (
                    <div>
                      <p className="mb-2 text-[13px] font-extrabold text-gray-900">동반 규정</p>
                      <div className="flex flex-wrap gap-2">
                        {verdict.conditions.map((cond) => (
                          <span
                            key={cond}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verdict.alternatives && verdict.alternatives.length > 0 && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                      <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-blue-700">
                        <Msf name="alt_route" className="text-[16px]" />
                        {pet.name}가 못 들어가요 · 대신 가까운 곳
                      </p>
                      <div className="mt-2 space-y-2">
                        {verdict.alternatives.map((a) => (
                          <div
                            key={a.name}
                            className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2"
                          >
                            <Msf name="pets" className="text-[16px] text-blue-500" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-bold text-gray-800">{a.name}</p>
                              <p className="text-[10px] text-gray-500">{a.category}</p>
                            </div>
                            <span className="shrink-0 text-[11px] font-semibold text-gray-600">
                              {a.distance_km < 1
                                ? `${Math.round(a.distance_km * 1000)}m`
                                : `${a.distance_km}km`}
                              {" · "}
                              {formatDuration(estimateDriveMinutes(a.distance_km))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-gray-500">
                  {sizeLabel(pet.size)} 동반 입장 정보를 확인 중이에요.
                </p>
              )}

              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                <Shield className="h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-[11px] font-semibold leading-snug text-gray-700">
                  입장 판정은 규칙(EntryJudgement)으로 결정해요. AI가 임의로 바꾸지 않습니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === "위치" && (
            <div className="space-y-3">
              <div className="relative h-40 overflow-hidden rounded-xl bg-[#eef1f5]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 180">
                  <path
                    d="M20 60 H300 M60 10 V170 M180 10 V170 M20 120 H300"
                    stroke="#dde3ea"
                    strokeWidth="6"
                    fill="none"
                  />
                </svg>
                <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-full">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full rounded-bl-sm bg-blue-500 shadow-lg">
                    <Msf name={heroIcon} className="text-[18px] text-white" />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white px-4">
                <div className="flex justify-between py-3 text-[12px]">
                  <span className="text-gray-500">위치</span>
                  <span className="max-w-[60%] text-right font-bold text-gray-800">
                    {placeLocationHint(region, stop.category)}
                  </span>
                </div>
                <div className="flex justify-between py-3 text-[12px]">
                  <span className="text-gray-500">운영</span>
                  <span className="font-bold text-gray-800">{placeHoursHint(stop.category)}</span>
                </div>
                <div className="flex justify-between py-3 text-[12px]">
                  <span className="text-gray-500">좌표</span>
                  <span className="font-mono text-[11px] text-gray-600">
                    {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                  </span>
                </div>
                {fromPrevLeg && (
                  <div className="flex justify-between py-3 text-[12px]">
                    <span className="text-gray-500">이전 장소에서</span>
                    <span className="font-bold text-gray-800">{fromPrevLeg.detail}</span>
                  </div>
                )}
                {toNextLeg && (
                  <div className="flex justify-between py-3 text-[12px]">
                    <span className="text-gray-500">다음 장소까지</span>
                    <span className="font-bold text-blue-600">{toNextLeg.detail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "후기" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold text-gray-900">{avgRating}</div>
                <div>
                  <div className="flex gap-0.5 text-orange-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">보호자 리뷰 {reviews.length}건</p>
                </div>
              </div>
              {reviews.length === 0 && (
                <p className="text-[12px] text-gray-400">아직 등록된 후기가 없어요.</p>
              )}
              {reviews.map((rv) => (
                <div
                  key={rv.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-[12px] font-bold text-gray-800">{rv.title}</p>
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span className="text-[11px] font-bold">{rv.rating}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{rv.body}</p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {rv.author} · {rv.source}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {onRemoveFromCourse && (
        <div className="border-t p-4" style={{ borderColor: "var(--pw-border)" }}>
          <button
            type="button"
            onClick={onRemoveFromCourse}
            className="pw-btn-accent flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
            style={{ background: "var(--pw-accent)" }}
          >
            <Msf name="remove_circle_outline" className="text-[18px]" />
            코스에서 제외
          </button>
        </div>
      )}
    </div>
  );
}
