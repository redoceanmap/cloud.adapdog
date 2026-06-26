// @ts-nocheck
// 코스·발자국을 실제 네이버 지도에 마커(핀) + 경로선으로 표시하는 재사용 컴포넌트.
// 키 미설정/로드 실패/좌표 0개면 fallback(기존 SVG 목업)을 그대로 렌더한다.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { css } from '../lib/css';
import { categoryStyle, categoryIcon, loadNaverMaps } from '../lib/naverMap';

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  order?: number; // 코스 경유지 순번(있으면 번호 핀)
  category?: string;
  role?: 'origin' | 'stopover' | 'transit' | 'dest'; // 여정 앵커(서울 출발/경유지/역·터미널/전주 도착)
  caption?: string; // 핀 아래 라벨(여정 앵커명)
  icon?: string; // 역/터미널 등 Material Symbol(transit 핀용)
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
  routePath?: { lat: number; lng: number }[]; // 실 도로 경로(있으면 직선 대신 이걸로 폴리라인)
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

/** 핀 아래 흰 라벨 캡션(여정 앵커명). */
function captionHtml(text?: string): string {
  if (!text) return '';
  return `<div style="position:absolute;top:calc(100% + 5px);left:50%;transform:translateX(-50%);white-space:nowrap;
    font:700 10.5px Pretendard;color:#1A1A1D;background:rgba(255,255,255,.94);padding:3px 8px;border-radius:8px;
    box-shadow:0 2px 7px rgba(20,20,29,.16);pointer-events:none;">${text}</div>`;
}

/** 여정 앵커(출발/경유지/도착) / 내 위치 / 번호 핀(코스) / 업종 발바닥 핀 HTML 마커. */
function markerHtml(p: MapPoint): string {
  // ── 여정 앵커: 서울 출발(검은 원) / 경유지(파란 테 점) / 전주 도착(큰 발바닥 핀) ──
  if (p.role === 'origin') {
    return `<div style="position:relative;transform:translate(-16px,-16px);">
      <div style="width:32px;height:32px;border-radius:50%;background:#1A1A1D;border:3px solid #fff;
        box-shadow:0 5px 14px rgba(20,20,29,.32);display:flex;align-items:center;justify-content:center;
        color:#fff;font:800 11px Pretendard;">출발</div>${captionHtml(p.caption)}</div>`;
  }
  if (p.role === 'stopover') {
    return `<div style="position:relative;transform:translate(-9px,-9px);">
      <div style="width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid ${PIN_BLUE};
        box-shadow:0 3px 9px rgba(20,20,29,.22);"></div>${captionHtml(p.caption)}</div>`;
  }
  if (p.role === 'transit') {
    return `<div style="position:relative;transform:translate(-15px,-15px);">
      <div style="width:30px;height:30px;border-radius:9px;background:#fff;border:2.5px solid ${PIN_BLUE};
        box-shadow:0 4px 11px rgba(20,20,29,.22);display:flex;align-items:center;justify-content:center;">
        <span class="msf" style="font-size:17px;color:${PIN_BLUE};">${p.icon || 'train'}</span></div>${captionHtml(p.caption)}</div>`;
  }
  if (p.role === 'dest') {
    return `<div style="position:relative;transform:translate(-20px,-40px);">
      <div style="width:40px;height:40px;border-radius:50% 50% 50% 5px;background:${PIN_BLUE};
        box-shadow:0 7px 18px rgba(59,91,254,.45);display:flex;align-items:center;justify-content:center;
        border:3px solid #fff;">${pawSvg('#fff', 19)}</div>${captionHtml(p.caption)}</div>`;
  }
  if ((p as any).me) {
    return `<div style="width:20px;height:20px;border-radius:50%;background:${PIN_BLUE};border:3px solid #fff;
      box-shadow:0 0 0 6px rgba(59,91,254,.18),0 4px 10px rgba(20,20,29,.25);transform:translate(-10px,-10px);"></div>`;
  }
  if (p.order != null) {
    // 카테고리 색·아이콘 물방울 핀 + 우상단 번호 배지(숙소/음식점/카페/공원/박물관 + 순서).
    const cs = categoryStyle(p.category);
    const ci = categoryIcon(p.category);
    return `<div style="position:relative;transform:translate(-17px,-40px);">
      <div style="width:34px;height:34px;border-radius:50% 50% 50% 4px;background:${cs.color};
        box-shadow:0 6px 16px rgba(20,20,29,.34);display:flex;align-items:center;justify-content:center;
        border:2.5px solid #fff;"><span class="msf" style="font-size:18px;color:#fff;line-height:1;">${ci}</span></div>
      <div style="position:absolute;top:-6px;right:-7px;min-width:18px;height:18px;border-radius:9px;background:#1A1A1D;
        color:#fff;font:800 10.5px Pretendard;display:flex;align-items:center;justify-content:center;padding:0 4px;
        border:1.5px solid #fff;box-shadow:0 2px 5px rgba(20,20,29,.3);">${p.order}</div>${captionHtml(p.caption)}</div>`;
  }
  // 업종별 색의 작은 발바닥 핀 — 색으로 카테고리를 한눈에 구별.
  const st = categoryStyle(p.category);
  return `<div style="width:26px;height:26px;border-radius:50%;background:#fff;border:2px solid ${st.color};
    box-shadow:0 3px 9px rgba(20,20,29,.28);display:flex;align-items:center;justify-content:center;
    transform:translate(-13px,-13px);">${pawSvg(st.color, 14)}</div>`;
}

export function NaverMap({ points, path = false, routePath, label, height = 420, fallback, onSelect, legend, flush = false }: NaverMapProps) {
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
          zoom: 13,
          scaleControl: false,
          mapDataControl: false,
        });

        // 코스 전체가 한눈에 보이도록 bounds에 맞춤 — 단, 컨테이너 크기가 확정된
        // init 시점에 호출해야 정확하다(flush=absolute라 생성 즉시 호출하면 1핀에 과확대됨).
        const fit = () => {
          if (latlngs.length < 2) return;
          map.fitBounds(bounds, { top: 56, right: 56, bottom: 56, left: 56 });
          if (map.getZoom() > 16) map.setZoom(16); // 좁은 클러스터가 거리 단위까지 확대되는 것 방지
        };
        naver.maps.Event.once(map, 'init', fit);

        // 실 도로 경로가 있으면 그걸로(도로 따라), 없으면 점들을 직선 연결.
        const routeLL = routePath && routePath.length > 1
          ? routePath.map((p) => new naver.maps.LatLng(p.lat, p.lng))
          : null;
        if (routeLL) {
          routeLL.forEach((ll: any) => bounds.extend(ll));
          new naver.maps.Polyline({
            map, path: routeLL, strokeColor: PIN_BLUE, strokeWeight: 5,
            strokeOpacity: 0.92, strokeLineCap: 'round', strokeLineJoin: 'round',
          });
        } else if (path && latlngs.length > 1) {
          // 시내 코스 순서 동선 — 얇은 점선으로 "방문 순서"임을 표현(도로 경로 아님).
          new naver.maps.Polyline({
            map,
            path: latlngs,
            strokeColor: PIN_BLUE,
            strokeWeight: 3,
            strokeOpacity: 0.7,
            strokeStyle: 'shortdash',
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
            // 호버 시 핀 이름 툴팁(겹친 핀 구분에 유용).
            const nameTip = `<div style="padding:6px 11px;font:700 12px Pretendard;color:#1A1A1D;white-space:nowrap;">${p.name}</div>`;
            naver.maps.Event.addListener(marker, 'mouseover', () => { info.setContent(nameTip); info.open(map, marker); });
            naver.maps.Event.addListener(marker, 'mouseout', () => info.close());
            naver.maps.Event.addListener(marker, 'click', () => {
              if (onSelectRef.current) {
                onSelectRef.current(p); // 앱의 상세 시트로 전달
                return;
              }
              info.setContent(nameTip);
              info.open(map, marker);
            });
          }
        });

      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (map) map.destroy();
    };
    // points 또는 도로경로가 바뀌면 재생성.
  }, [JSON.stringify(valid), path, JSON.stringify(routePath)]);

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
