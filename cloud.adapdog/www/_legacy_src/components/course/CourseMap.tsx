import { useEffect, useMemo, useRef, useState } from 'react';
import { Accessibility, Loader2, MapPin } from 'lucide-react';
import type { CourseStop } from '@/types';
import { loadNaverMapScript, getNaverMapErrorMessage, NAVER_MAP_SETUP_GUIDE } from '@/utils/loadNaverMap';

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

interface CourseMapProps {
  stops: CourseStop[];
  activeDay: 1 | 2;
  barrierFreeOnly?: boolean;
  height?: string;
}

export function CourseMap({
  stops,
  activeDay,
  barrierFreeOnly = false,
  height = 'h-56',
}: CourseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const overlaysRef = useRef<Array<naver.maps.Marker | naver.maps.Polyline>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dayStops = useMemo(
    () => stops.filter((stop) => stop.day === activeDay).sort((a, b) => a.order - b.order),
    [stops, activeDay],
  );

  useEffect(() => {
    if (!mapRef.current || dayStops.length === 0) {
      setLoading(false);
      return;
    }

    if (!NAVER_CLIENT_ID) {
      setError('VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      setLoading(true);
      setError(null);

      try {
        await loadNaverMapScript(NAVER_CLIENT_ID);
        if (cancelled || !mapRef.current) return;

        overlaysRef.current.forEach((overlay) => overlay.setMap(null));
        overlaysRef.current = [];

        const first = dayStops[0];
        const map =
          mapInstanceRef.current ??
          new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(first.lat, first.lng),
            zoom: 12,
            zoomControl: true,
          });

        mapInstanceRef.current = map;

        const bounds = new naver.maps.LatLngBounds(
          new naver.maps.LatLng(first.lat, first.lng),
          new naver.maps.LatLng(first.lat, first.lng),
        );

        const path: naver.maps.LatLng[] = [];

        dayStops.forEach((stop) => {
          const position = new naver.maps.LatLng(stop.lat, stop.lng);
          bounds.extend(position);
          path.push(position);

          const marker = new naver.maps.Marker({
            position,
            map,
            icon: {
              content: `
                <div style="
                  display:flex;flex-direction:column;align-items:center;
                  transform:translate(-50%,-100%);
                ">
                  <div style="
                    width:28px;height:28px;border-radius:9999px;
                    background:#1fa876;color:#fff;font-weight:700;font-size:12px;
                    display:flex;align-items:center;justify-content:center;
                    box-shadow:0 2px 8px rgba(0,0,0,.2);border:2px solid #fff;
                  ">${stop.order}</div>
                  <div style="
                    margin-top:4px;padding:2px 6px;border-radius:9999px;
                    background:rgba(255,255,255,.95);font-size:10px;font-weight:600;
                    color:#444;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.12);
                  ">${stop.name}</div>
                </div>
              `,
              anchor: new naver.maps.Point(14, 28),
            },
          });

          overlaysRef.current.push(marker);
        });

        if (path.length > 1) {
          const polyline = new naver.maps.Polyline({
            map,
            path,
            strokeColor: '#f87171',
            strokeWeight: 4,
            strokeOpacity: 0.85,
            strokeStyle: 'shortdash',
          });
          overlaysRef.current.push(polyline);
        }

        map.fitBounds(bounds, 48);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(getNaverMapErrorMessage(err));
          setLoading(false);
        }
      }
    };

    void initMap();

    return () => {
      cancelled = true;
    };
  }, [dayStops, activeDay]);

  if (dayStops.length === 0) {
    return (
      <div className={`flex ${height} items-center justify-center rounded-3xl bg-surface-muted text-sm text-ink-muted`}>
        {activeDay}일차 장소가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line">
      <div className={`relative ${height} w-full`}>
        {barrierFreeOnly && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-[10px] font-medium text-ink-muted shadow-sm">
            <Accessibility size={12} />
            이동약자 배려만
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/80">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-surface-muted px-4 py-5 text-left">
            <div className="flex flex-col items-center text-center">
              <MapPin size={24} className="text-rose-400" />
              <p className="mt-2 text-sm font-semibold text-ink">{error}</p>
            </div>
            <div className="mt-4 rounded-2xl bg-surface p-3 ring-1 ring-line">
              <p className="mb-2 text-xs font-bold text-brand-700">네이버 지도 401 오류 해결 체크리스트</p>
              <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-ink-muted">
                {NAVER_MAP_SETUP_GUIDE.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
              <p className="mt-2 text-[10px] text-ink-muted">
                현재 키: {NAVER_CLIENT_ID ? `${NAVER_CLIENT_ID.slice(0, 4)}...` : '미설정'} ·
                접속 URL: {typeof window !== 'undefined' ? window.location.origin : ''}
              </p>
            </div>
          </div>
        )}

        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}
