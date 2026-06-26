// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { css } from "@/lib/css";
import {
  categoryStyle,
  categoryIcon,
  loadNaverMaps,
  getNaverMapErrorMessage,
  NAVER_MAP_SETUP_GUIDE,
} from "@/lib/naverMap";

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  order?: number;
  category?: string;
}

interface NaverMapProps {
  points: MapPoint[];
  path?: boolean;
  routePath?: { lat: number; lng: number }[];
  label?: string;
  fallback: ReactNode;
  onSelect?: (p: MapPoint) => void;
  flush?: boolean;
  activeOrder?: number;
}

const PIN_BLUE = "#3B5BFE";
const PICK_RADIUS_PX = 52;

function pawSvg(color: string, size = 14): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg>`;
}

function markerHtml(p: MapPoint, active = false): string {
  if (p.order != null) {
    const cs = categoryStyle(p.category);
    const ci = categoryIcon(p.category);
    const pin = active ? 42 : 34;
    const offset = active ? 21 : 17;
    const lift = active ? 44 : 40;
    const ring = active
      ? `box-shadow:0 0 0 4px rgba(59,91,254,.35), 0 8px 20px rgba(20,20,29,.38);`
      : "box-shadow:0 6px 16px rgba(20,20,29,.34);";
    return `<div style="position:relative;transform:translate(-${offset}px,-${lift}px);padding:10px;cursor:pointer;">
      <div style="width:${pin}px;height:${pin}px;border-radius:50% 50% 50% 4px;background:${active ? PIN_BLUE : cs.color};
        ${ring}display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;">
        <span class="msf" style="font-size:${active ? 20 : 18}px;color:#fff;line-height:1;">${ci}</span>
      </div>
      <div style="position:absolute;top:2px;right:2px;min-width:18px;height:18px;border-radius:9px;background:#1A1A1D;
        color:#fff;font:800 10.5px Pretendard;display:flex;align-items:center;justify-content:center;padding:0 4px;
        border:1.5px solid #fff;box-shadow:0 2px 5px rgba(20,20,29,.3);">${p.order}</div></div>`;
  }
  const st = categoryStyle(p.category);
  return `<div style="padding:8px;cursor:pointer;transform:translate(-13px,-13px);">
    <div style="width:26px;height:26px;border-radius:50%;background:#fff;border:2px solid ${st.color};
    box-shadow:0 3px 9px rgba(20,20,29,.28);display:flex;align-items:center;justify-content:center;">
    ${pawSvg(st.color, 14)}</div></div>`;
}

export default function NaverMap({
  points,
  path = false,
  routePath,
  label,
  fallback,
  onSelect,
  flush = false,
  activeOrder,
}: NaverMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [picker, setPicker] = useState<MapPoint[] | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const showPickerRef = useRef<(items: MapPoint[]) => void>(() => {});
  showPickerRef.current = (items) => setPicker(items);

  const valid = (points || []).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

  useEffect(() => {
    if (!valid.length) return;
    let map: { destroy: () => void; getProjection: () => { fromCoordToOffset: (ll: unknown) => { x: number; y: number } } } | undefined;
    let cancelled = false;

    loadNaverMaps()
      .then((naver: { maps: Record<string, unknown> }) => {
        if (cancelled || !ref.current) return;
        const bounds = new naver.maps.LatLngBounds();
        const latlngs = valid.map((p) => {
          const ll = new naver.maps.LatLng(p.lat, p.lng);
          bounds.extend(ll);
          return ll;
        });

        map = new naver.maps.Map(ref.current, {
          center: latlngs[0],
          zoom: 13,
          scaleControl: false,
          mapDataControl: false,
        });

        const fit = () => {
          if (latlngs.length < 2) return;
          map.fitBounds(bounds, { top: 72, right: 56, bottom: 112, left: 56 });
          const maxZoom = valid.length >= 7 ? 14 : 16;
          if (map.getZoom() > maxZoom) map.setZoom(maxZoom);
        };
        naver.maps.Event.once(map, "init", fit);

        const routeLL =
          routePath && routePath.length > 1
            ? routePath.map((p) => new naver.maps.LatLng(p.lat, p.lng))
            : null;
        if (routeLL) {
          routeLL.forEach((ll) => bounds.extend(ll));
          new naver.maps.Polyline({
            map,
            path: routeLL,
            strokeColor: PIN_BLUE,
            strokeWeight: 5,
            strokeOpacity: 0.92,
            strokeLineCap: "round",
            strokeLineJoin: "round",
          });
        } else if (path && latlngs.length > 1) {
          new naver.maps.Polyline({
            map,
            path: latlngs,
            strokeColor: PIN_BLUE,
            strokeWeight: 3,
            strokeOpacity: 0.7,
            strokeStyle: "shortdash",
            strokeLineCap: "round",
            strokeLineJoin: "round",
          });
        }

        const info = new naver.maps.InfoWindow({ borderWidth: 0, disableAnchor: true });

        const findNearby = (index: number) => {
          const proj = map.getProjection();
          const base = proj.fromCoordToOffset(latlngs[index]);
          const hits: MapPoint[] = [];
          valid.forEach((p, i) => {
            const off = proj.fromCoordToOffset(latlngs[i]);
            const dx = off.x - base.x;
            const dy = off.y - base.y;
            if (Math.hypot(dx, dy) <= PICK_RADIUS_PX) hits.push(p);
          });
          return hits;
        };

        const handlePick = (p: MapPoint, index: number) => {
          const nearby = findNearby(index);
          if (nearby.length > 1 && onSelectRef.current) {
            showPickerRef.current(
              [...nearby].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            );
            return;
          }
          setPicker(null);
          if (onSelectRef.current) {
            onSelectRef.current(p);
            return;
          }
          if (p.name) {
            const nameTip = `<div style="padding:6px 11px;font:700 12px Pretendard;color:#1A1A1D;white-space:nowrap;">${p.name}</div>`;
            info.setContent(nameTip);
            info.open(map, marker);
          }
        };

        const markers: { setIcon: (o: { content: string }) => void }[] = [];

        valid.forEach((p, i) => {
          const isActive = activeOrder != null && p.order === activeOrder;
          const marker = new naver.maps.Marker({
            map,
            position: latlngs[i],
            zIndex: isActive ? 200 + (p.order ?? 0) : 100 + (p.order ?? 0),
            icon: { content: markerHtml(p, isActive) },
          });
          markers.push(marker);

          if (p.name) {
            const nameTip = `<div style="padding:6px 11px;font:700 12px Pretendard;color:#1A1A1D;white-space:nowrap;">${p.name}</div>`;
            naver.maps.Event.addListener(marker, "mouseover", () => {
              info.setContent(nameTip);
              info.open(map, marker);
            });
            naver.maps.Event.addListener(marker, "mouseout", () => info.close());
            naver.maps.Event.addListener(marker, "click", () => handlePick(p, i));
          }
        });

        naver.maps.Event.addListener(map, "click", () => setPicker(null));
      })
      .catch((err) => {
        if (!cancelled) {
          setFailMessage(getNaverMapErrorMessage(err));
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
      if (map) map.destroy();
    };
  }, [JSON.stringify(valid), path, JSON.stringify(routePath), activeOrder]);

  if (!valid.length) return <>{fallback}</>;

  if (failed) {
    return (
      <div
        style={css(
          "height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:20px; text-align:center; background:#FAFAFB;",
        )}
      >
        <span className="msf" style={{ fontSize: 28, color: "#E0533F" }}>
          map
        </span>
        <p style={css("margin:0; font:600 13px Pretendard; color:#1A1A1D;")}>
          {failMessage || "네이버 지도를 불러오지 못했습니다."}
        </p>
        <ul style={css("margin:0; padding:0 0 0 16px; text-align:left; font:400 11px Pretendard; color:#5A5F68; line-height:1.6;")}>
          {NAVER_MAP_SETUP_GUIDE.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {fallback}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      style={css(
        flush
          ? "position:absolute; inset:0; overflow:hidden;"
          : "height:100%; overflow:hidden; position:relative;",
      )}
    >
      <div ref={ref} style={css("width:100%; height:100%;")} />
      {label ? (
        <div
          style={css(
            "position:absolute; left:14px; top:14px; z-index:1; font:600 11px ui-monospace,monospace; color:#5A5F68; background:rgba(255,255,255,.9); padding:6px 10px; border-radius:8px; box-shadow:0 2px 8px rgba(20,20,29,.1);",
          )}
        >
          {label}
        </div>
      ) : null}

      {picker && picker.length > 1 && (
        <div
          className="absolute inset-x-3 bottom-24 z-30 max-h-[40%] overflow-y-auto rounded-xl border p-2 shadow-xl"
          style={{
            borderColor: "var(--pw-border)",
            background: "var(--pw-panel)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-2 px-1 text-[11px] font-bold" style={{ color: "var(--pw-text)" }}>
            겹친 장소 {picker.length}곳 — 선택해 주세요
          </p>
          <div className="space-y-1">
            {picker.map((p) => (
              <button
                key={`${p.order}-${p.name}`}
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors hover:opacity-90"
                style={{
                  borderColor: p.order === activeOrder ? "var(--pw-accent)" : "var(--pw-border)",
                  background: p.order === activeOrder ? "var(--pw-accent-soft)" : "var(--pw-panel-2)",
                }}
                onClick={() => {
                  setPicker(null);
                  onSelectRef.current?.(p);
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    background:
                      p.order === activeOrder ? "var(--pw-accent)" : categoryStyle(p.category).color,
                  }}
                >
                  {p.order}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-semibold" style={{ color: "var(--pw-text)" }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
