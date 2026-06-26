import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Place, PettiquetteLevel } from '@/types';
import { getNaverMapErrorMessage, loadNaverMapScript } from '@/utils/loadNaverMap';
import { MapView } from './MapView';

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

const DEFAULT_CENTER = { lat: 37.7519, lng: 128.8761 }; // 강릉

function pinColor(level: PettiquetteLevel): string {
  if (level === 'allowed') return '#1fa876';
  if (level === 'restricted') return '#f59e0b';
  return '#f43f5e';
}

function buildMarkerHtml(place: Place, isSelected: boolean): string {
  const color = pinColor(place.pettiquette.level);
  const scale = isSelected ? 1.15 : 1;
  const ring = isSelected ? 'box-shadow:0 0 0 4px rgba(31,168,118,.35);' : '';

  return `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%) scale(${scale});cursor:pointer;">
      <div style="
        width:32px;height:32px;border-radius:9999px;
        background:${color};color:#fff;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,.25);border:2px solid #fff;
        ${ring}
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
        </svg>
      </div>
      <div style="
        margin-top:4px;max-width:96px;padding:2px 8px;border-radius:9999px;
        background:rgba(255,255,255,.96);font-size:10px;font-weight:700;
        color:${isSelected ? '#126e4f' : '#444'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        box-shadow:0 1px 4px rgba(0,0,0,.12);border:1px solid rgba(255,237,213,.8);
      ">${place.name}</div>
    </div>
  `;
}

interface NaverPlaceMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
}

export function NaverPlaceMap({ places, selectedPlaceId, onSelectPlace }: NaverPlaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const listenersRef = useRef<naver.maps.MapEventListener[]>([]);

  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!NAVER_CLIENT_ID) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        await loadNaverMapScript(NAVER_CLIENT_ID);
        if (cancelled || !mapRef.current) return;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
            zoom: 11,
            zoomControl: true,
          });
          window.requestAnimationFrame(() => {
            if (mapInstanceRef.current) {
              naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
            }
          });
        }

        setMapReady(true);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(getNaverMapErrorMessage(err));
          setLoading(false);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = mapRef.current;
    const map = mapInstanceRef.current;
    if (!mapReady || !el || !map) return;

    const resizeMap = () => {
      naver.maps.Event.trigger(map, 'resize');
    };

    resizeMap();
    const observer = new ResizeObserver(resizeMap);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;

    listenersRef.current.forEach((listener) => naver.maps.Event.removeListener(listener));
    listenersRef.current = [];
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (places.length === 0) {
      map.setCenter(new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
      map.setOptions({ zoom: 11 });
      return;
    }

    const bounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(places[0].lat, places[0].lng),
      new naver.maps.LatLng(places[0].lat, places[0].lng),
    );

    places.forEach((place) => {
      const position = new naver.maps.LatLng(place.lat, place.lng);
      bounds.extend(position);

      const marker = new naver.maps.Marker({
        position,
        map,
        icon: {
          content: buildMarkerHtml(place, selectedPlaceId === place.id),
          anchor: new naver.maps.Point(16, 32),
        },
      });

      const listener = naver.maps.Event.addListener(marker, 'click', () => {
        onSelectPlace(place);
      });

      listenersRef.current.push(listener);
      markersRef.current.push(marker);
    });

    map.fitBounds(bounds, 80);
  }, [places, selectedPlaceId, mapReady, onSelectPlace]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map || !selectedPlaceId) return;

    const place = places.find((item) => item.id === selectedPlaceId);
    if (!place) return;

    map.panTo(new naver.maps.LatLng(place.lat, place.lng));
  }, [selectedPlaceId, places, mapReady]);

  if (!NAVER_CLIENT_ID) {
    return (
      <MapView
        places={places}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={onSelectPlace}
      />
    );
  }

  if (error) {
    return (
      <div className="relative h-full w-full">
        <MapView
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
        />
        <div className="absolute inset-x-4 top-4 z-10 mx-auto max-w-sm rounded-2xl bg-surface/95 p-3 shadow-lg ring-1 ring-rose-100">
          <p className="text-xs font-semibold text-rose-700">{error}</p>
          <p className="mt-1 text-[11px] text-ink-muted">
            네이버 지도 연결 전에도 미리보기 지도로 장소를 확인할 수 있어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/80">
          <Loader2 size={32} className="animate-spin text-brand-500" />
        </div>
      )}

      {mapReady && places.length === 0 && (
        <div className="absolute inset-x-0 top-1/3 z-10 mx-auto w-fit rounded-full bg-surface/95 px-4 py-2 text-sm font-medium text-ink-muted shadow-md">
          표시할 장소가 없습니다
        </div>
      )}

      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
