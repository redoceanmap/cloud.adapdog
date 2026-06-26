"use client";

import { categoryStyle } from "@/lib/naverMap";
import type { RouteStop } from "@/lib/planner-api";

interface MapStopStripProps {
  stops: RouteStop[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function MapStopStrip({ stops, activeIndex, onSelect }: MapStopStripProps) {
  if (stops.length === 0) return null;

  return (
    <div
      className="absolute bottom-12 left-2 right-14 z-20"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="rounded-xl border px-2 py-2 shadow-lg"
        style={{
          pointerEvents: "auto",
          borderColor: "var(--pw-border)",
          background: "color-mix(in srgb, var(--pw-panel) 94%, transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p className="mb-1.5 px-1 text-[10px] font-semibold" style={{ color: "var(--pw-muted)" }}>
          코스 장소 — 탭해서 선택
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {stops.map((stop, index) => {
            const active = index === activeIndex;
            const color = categoryStyle(stop.category).color;
            return (
              <button
                key={`${stop.order}-${stop.name}`}
                type="button"
                onClick={() => onSelect(index)}
                className="flex max-w-[140px] shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-transform active:scale-[0.98]"
                style={{
                  borderColor: active ? "var(--pw-accent)" : "var(--pw-border)",
                  background: active ? "var(--pw-accent-soft)" : "var(--pw-panel)",
                  boxShadow: active ? "0 0 0 1px var(--pw-accent)" : undefined,
                }}
                title={stop.name}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                  style={{ background: active ? "var(--pw-accent)" : color }}
                >
                  {stop.order}
                </span>
                <span
                  className="truncate text-[11px] font-semibold leading-tight"
                  style={{ color: active ? "var(--pw-accent)" : "var(--pw-text)" }}
                >
                  {stop.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
