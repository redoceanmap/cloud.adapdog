"use client";

import { useMemo } from "react";
import { Info, MapPin, Trash2 } from "lucide-react";
import type { Pet, RoutePlanResponse, RouteStop, TripPlan } from "@/lib/planner-api";
import { categoryLabel } from "@/lib/planner-api";
import {
  itineraryStayLabel,
  itineraryTripDays,
  normalizeItineraryStops,
} from "@/lib/planner-itinerary";

const SLOT_ORDER = ["morning", "lunch", "afternoon", "dinner"] as const;
const SLOT_LABEL: Record<string, string> = {
  morning: "아침",
  lunch: "점심",
  afternoon: "오후",
  dinner: "저녁",
};

function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

interface PlannerItineraryProps {
  pet: Pet;
  course: RoutePlanResponse;
  courseTitle: string;
  nights?: number;
  lodging?: TripPlan["lodging"];
  onSelectStop: (index: number) => void;
  onRemoveStop: (name: string) => void;
  onEmergency: () => void;
  saved?: boolean;
}

function stopKey(stop: RouteStop, index: number): string {
  return `${stop.name}-${index}`;
}

export default function PlannerItinerary({
  pet,
  course,
  courseTitle,
  nights,
  lodging,
  onSelectStop,
  onRemoveStop,
  onEmergency,
  saved = false,
}: PlannerItineraryProps) {
  const rawStops = course.stops;
  const tripDays = useMemo(
    () => itineraryTripDays(rawStops, { nights, lodging }),
    [rawStops, nights, lodging],
  );
  const stops = useMemo(
    () => normalizeItineraryStops(rawStops, tripDays),
    [rawStops, tripDays],
  );
  const stayLabel = itineraryStayLabel(nights, lodging);
  const hasMock = stops.some((s) => s.is_mock);

  const grouped = useMemo(() => {
    const days = Array.from(new Set(stops.map((s) => s.day ?? 1))).sort((a, b) => a - b);
    return days.map((day) => {
      const dayStops = stops
        .map((s, i) => ({ stop: s, index: i }))
        .filter(({ stop }) => (stop.day ?? 1) === day);
      const slots = SLOT_ORDER.map((slot) => ({
        slot,
        label: SLOT_LABEL[slot],
        clock: dayStops.find(({ stop }) => stop.time_slot === slot)?.stop.clock ?? "",
        items: dayStops.filter(({ stop }) => (stop.time_slot ?? "morning") === slot),
      })).filter((s) => s.items.length > 0);
      return { day, slots };
    });
  }, [stops]);

  const renderStopCard = (stop: RouteStop, index: number) => (
    <div
      key={stopKey(stop, index)}
      role="button"
      tabIndex={0}
      onClick={() => onSelectStop(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectStop(index);
        }
      }}
      className="mb-3 flex-1 cursor-pointer rounded-2xl border p-4 text-left transition-shadow hover:shadow-md"
      style={{
        borderColor: stop.is_meal ? "rgba(217,138,0,.35)" : "var(--pw-border)",
        background: stop.is_meal ? "rgba(217,138,0,.06)" : "var(--pw-panel)",
        boxShadow: "var(--pw-shadow)",
      }}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold" style={{ color: "var(--pw-text)" }}>
              {stop.name}
            </span>
            {stop.is_mock && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                예시
              </span>
            )}
            {stop.similarity > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: "var(--pw-accent-soft)", color: "var(--pw-accent)" }}
              >
                닮은친구 {stop.similarity}%
              </span>
            )}
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--pw-muted)" }}>
            {categoryLabel(stop.category)}
            {stop.distance_from_prev_km > 0 &&
              ` · 이전 장소에서 ${formatKm(stop.distance_from_prev_km)}`}
          </p>
          {stop.reason && (
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "var(--pw-text)" }}>
              {stop.reason}
            </p>
          )}
          {stop.source && (
            <p className="mt-2 text-[10px]" style={{ color: "var(--pw-faint)" }}>
              출처: {stop.source}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveStop(stop.name);
          }}
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
          aria-label={`${stop.name} 제외`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          제외
        </button>
      </div>
    </div>
  );

  let stopNum = 0;

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8"
      style={{ background: "var(--pw-bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--pw-text)" }}>
              {courseTitle}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--pw-muted)" }}>
              {pet.name} · {pet.breed} · {course.region}
              {stayLabel ? ` · ${stayLabel}` : ""} · {stops.length}곳
            </p>
          </div>
          {saved && (
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: "rgba(34,165,101,.12)", color: "#1B8A55" }}
            >
              저장됨
            </span>
          )}
        </div>

        {course.summary && (
          <p
            className="mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed"
            style={{
              borderColor: "var(--pw-border)",
              background: "var(--pw-panel)",
              color: "var(--pw-muted)",
            }}
          >
            {course.summary}
          </p>
        )}

        {hasMock && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            일부 항목은 실데이터가 부족해 MVP 데모용 예시로 채웠어요.
          </div>
        )}

        <div className="relative mt-6">
          {grouped.map(({ day, slots }) => (
            <div key={day} className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-extrabold" style={{ color: "var(--pw-accent)" }}>
                  Day {day}
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--pw-muted)" }}>
                  {day}일차
                </span>
                <div className="h-px flex-1" style={{ background: "var(--pw-border)" }} />
              </div>
              {slots.map(({ slot, label, clock, items }) => (
                <div key={slot} className="mb-4">
                  <div className="mb-2 flex items-center gap-2 pl-11">
                    <span className="text-xs font-bold" style={{ color: "var(--pw-text)" }}>
                      {label}
                    </span>
                    {clock && (
                      <span className="text-[11px]" style={{ color: "var(--pw-faint)" }}>
                        {clock}
                      </span>
                    )}
                  </div>
                  {items.map(({ stop, index }) => {
                    if (!stop.is_meal) stopNum += 1;
                    return (
                      <div key={stopKey(stop, index)} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {!stop.is_meal ? (
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ background: "var(--pw-accent)" }}
                            >
                              {stopNum}
                            </div>
                          ) : (
                            <div className="h-8 w-8 shrink-0" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">{renderStopCard(stop, index)}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
              {tripDays > 1 && day < tripDays && course.lodging && course.lodging.length > 0 && (
                <div
                  className="mb-2 ml-11 rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: "var(--pw-border)",
                    background: "var(--pw-panel)",
                    color: "var(--pw-muted)",
                  }}
                >
                  <span className="font-semibold" style={{ color: "var(--pw-text)" }}>
                    {course.lodging[day - 1]?.name ?? course.lodging[0]?.name ?? "펫 동반 숙소"}
                  </span>
                  <span className="ml-2 text-xs">{day}박 · 체크인 후 휴식</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectStop(0)}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: "var(--pw-accent)" }}
          >
            <MapPin className="h-4 w-4" />
            지도에서 보기
          </button>
          <button
            type="button"
            onClick={onEmergency}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            응급 케어
          </button>
        </div>
      </div>
    </div>
  );
}
