// @ts-nocheck
// 코스·발자국을 실제 네이버 지도에 마커(핀) + 경로선으로 표시하는 재사용 컴포넌트.
// 키 미설정/로드 실패/좌표 0개면 fallback(기존 SVG 목업)을 그대로 렌더한다.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { css } from '../lib/css';
import { categoryStyle, loadNaverMaps } from '../lib/naverMap';

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  order?: number; // 코스 경유지 순번(있으면 번호 핀)
  category?: string;
  // 상세 패널용(있으면 표시).
  facilityId?: number;
  distanceKm?: number;
  similarity?: number;
  region?: string;
  roadAddress?: string;
  visitCount?: number;
  firstVisited?: string;
  allowedSizes?: string[];
}

interface NaverMapProps {
  points: MapPoint[];
  path?: boolean; // 점들을 순서대로 폴리라인 연결(코스)
  label?: string; // 좌상단 칩 텍스트
  height?: number;
  fallback: ReactNode; // 키없음/실패/좌표0개 시 렌더
  onSelect?: (p: MapPoint) => void; // 핀 클릭 시 상세 패널로 전달
  legend?: { label: string; color: string }[]; // 업종별 핀 색 범례(있으면 좌하단 표시)
  flush?: boolean; // 부모를 꽉 채움(헤더 배너용) — margin/라운드 제거
}

const PIN_BLUE = '#3B5BFE';

/** 강아지 발바닥 SVG(색·크기 지정). 업종 핀 안에 채운다. */
function pawSvg(color: string, size = 14): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg>`;
}

/** 내 위치(GPS) / 번호 핀(코스) / 업종별 강아지 발바닥 핀(그 외) HTML 마커. */
function markerHtml(p: MapPoint): string {
  if ((p as any).me) {
    return `<div style="width:20px;height:20px;border-radius:50%;background:${PIN_BLUE};border:3px solid #fff;
      box-shadow:0 0 0 6px rgba(59,91,254,.18),0 4px 10px rgba(20,20,29,.25);transform:translate(-10px,-10px);"></div>`;
  }
  if (p.order != null) {
    return `<div style="width:30px;height:30px;border-radius:50% 50% 50% 3px;background:${PIN_BLUE};
      box-shadow:0 6px 16px rgba(59,91,254,.4);display:flex;align-items:center;justify-content:center;
      color:#fff;font:800 13px Pretendard;transform:translate(-15px,-30px);">${p.order}</div>`;
  }
  // 업종별 색의 작은 발바닥 핀 — 색으로 카테고리를 한눈에 구별.
  const st = categoryStyle(p.category);
  return `<div style="width:26px;height:26px;border-radius:50%;background:#fff;border:2px solid ${st.color};
    box-shadow:0 3px 9px rgba(20,20,29,.28);display:flex;align-items:center;justify-content:center;
    transform:translate(-13px,-13px);">${pawSvg(st.color, 14)}</div>`;
}

export function NaverMap({ points, path = false, label, height = 420, fallback, onSelect, legend, flush = false }: NaverMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // onSelect는 렌더마다 새 함수일 수 있어 ref로 최신값 유지(지도 재생성 방지).
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const valid = (points || []).filter(
    (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng),
  );

  useEffect(() => {
    if (!valid.length) return;
    let map: any;
    let cancelled = false;

    loadNaverMaps()
      .then((naver) => {
        if (cancelled || !ref.current) return;
        const bounds = new naver.maps.LatLngBounds();
        const latlngs = valid.map((p) => {
          const ll = new naver.maps.LatLng(p.lat, p.lng);
          bounds.extend(ll);
          return ll;
        });

        map = new naver.maps.Map(ref.current, {
          center: latlngs[0],
          zoom: 14,
          scaleControl: false,
          mapDataControl: false,
        });

        if (path && latlngs.length > 1) {
          new naver.maps.Polyline({
            map,
            path: latlngs,
            strokeColor: PIN_BLUE,
            strokeWeight: 4,
            strokeOpacity: 0.9,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
          });
        }

        const info = new naver.maps.InfoWindow({ borderWidth: 0, disableAnchor: true });
        valid.forEach((p, i) => {
          const marker = new naver.maps.Marker({
            map,
            position: latlngs[i],
            icon: { content: markerHtml(p) },
          });
          if (p.name && !(p as any).me) {
            naver.maps.Event.addListener(marker, 'click', () => {
              if (onSelectRef.current) {
                onSelectRef.current(p); // 앱의 상세 시트로 전달
                return;
              }
              info.setContent(
                `<div style="padding:7px 11px;font:700 12px Pretendard;color:#1A1A1D;">${p.name}</div>`,
              );
              info.open(map, marker);
            });
          }
        });

        if (latlngs.length > 1) map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (map) map.destroy();
    };
    // points 내용이 바뀌면 재생성.
  }, [JSON.stringify(valid), path]);

  if (!valid.length || failed) return <>{fallback}</>;

  return (
    <div
      style={css(
        flush
          ? 'position:absolute; inset:0; overflow:hidden;'
          : `margin-top:14px; height:${height}px; border-radius:20px; overflow:hidden; position:relative; box-shadow:0 6px 20px rgba(20,20,29,.06);`,
      )}
    >
      <div ref={ref} style={css('width:100%; height:100%;')} />
      {label ? (
        <div
          style={css(
            "position:absolute; left:14px; top:14px; z-index:1; font:600 11px ui-monospace,monospace; color:#5A5F68; background:rgba(255,255,255,.9); padding:6px 10px; border-radius:8px; box-shadow:0 2px 8px rgba(20,20,29,.1);",
          )}
        >
          {label}
        </div>
      ) : null}
      {legend && legend.length ? (
        <div
          style={css(
            "position:absolute; left:14px; bottom:14px; z-index:1; background:rgba(255,255,255,.92); border-radius:11px; padding:9px 11px; box-shadow:0 2px 8px rgba(20,20,29,.12); display:flex; flex-direction:column; gap:5px;",
          )}
        >
          {legend.map((l) => (
            <div key={l.label} style={css('display:flex; align-items:center; gap:6px; font:600 10px Pretendard; color:#5A5F68;')}>
              <span style={css(`width:9px; height:9px; border-radius:50%; background:${l.color}; flex:none;`)} />
              {l.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
