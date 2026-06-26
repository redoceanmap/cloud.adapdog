import type { RouteStop } from "@/lib/planner-api";

type TimeSlot = NonNullable<RouteStop["time_slot"]>;

const SLOT_CYCLE: TimeSlot[] = ["morning", "lunch", "afternoon", "dinner"];

export function itineraryTripDays(
  stops: RouteStop[],
  options?: { nights?: number; lodging?: string },
): number {
  const fromStops = stops.reduce((max, s) => Math.max(max, s.day ?? 1), 1);
  const fromPlan =
    options?.lodging === "overnight" && (options.nights ?? 0) > 0
      ? (options.nights ?? 0) + 1
      : 0;
  return Math.max(1, fromPlan, fromStops);
}

/** 백엔드 day/time_slot이 없거나 하루로만 묶인 다박 코스를 여정 탭용으로 정규화한다. */
export function normalizeItineraryStops(
  stops: RouteStop[],
  tripDays: number,
): RouteStop[] {
  const base = stops.map((s) => ({
    ...s,
    day: s.day ?? 1,
    time_slot: (s.time_slot ?? "morning") as TimeSlot,
  }));

  if (tripDays <= 1) return base;

  const uniqueDays = new Set(base.map((s) => s.day));
  if (uniqueDays.size > 1) return base;

  const perDay = Math.max(1, Math.ceil(base.length / tripDays));
  return base.map((s, i) => {
    const day = Math.min(tripDays, Math.floor(i / perDay) + 1);
    const indexInDay = i - (day - 1) * perDay;
    const slot =
      s.time_slot && s.time_slot !== "morning"
        ? s.time_slot
        : SLOT_CYCLE[indexInDay % SLOT_CYCLE.length];
    return { ...s, day, time_slot: slot };
  });
}

export function itineraryStayLabel(
  nights?: number,
  lodging?: string,
): string | null {
  if (lodging === "overnight" && (nights ?? 0) > 0) {
    return `${nights}박 ${(nights ?? 0) + 1}일`;
  }
  if (lodging === "daytrip") return "당일치기";
  return null;
}
