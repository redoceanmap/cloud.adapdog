import { MapPin } from 'lucide-react';
import type { Place } from '@/types';

interface MapMarkerProps {
  place: Place;
  position: { top: string; left: string };
  isSelected: boolean;
  onSelect: (place: Place) => void;
}

export function MapMarker({ place, position, isSelected, onSelect }: MapMarkerProps) {
  const pinColor =
    place.pettiquette.level === 'allowed'
      ? 'bg-emerald-500 border-emerald-600'
      : place.pettiquette.level === 'restricted'
        ? 'bg-amber-500 border-amber-600'
        : 'bg-rose-500 border-rose-600';

  return (
    <button
      type="button"
      className={`absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${isSelected ? 'scale-125' : ''}`}
      style={{ top: position.top, left: position.left }}
      onClick={() => onSelect(place)}
      aria-label={`${place.name} 선택`}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-white shadow-lg ${pinColor} ${isSelected ? 'ring-4 ring-white' : ''}`}
        >
          <MapPin size={18} className="fill-current" />
        </div>
        <span
          className={`mt-1.5 max-w-[88px] truncate rounded-full border border-orange-100/60 bg-surface/95 px-2 py-0.5 text-[10px] font-medium shadow-sm ${isSelected ? 'text-brand-700' : 'text-slate-600'}`}
        >
          {place.name}
        </span>
      </div>
    </button>
  );
}

interface MapViewProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
}

/** 지도 API 연동 전 UI용 플레이스홀더 지도 */
export function MapView({ places, selectedPlaceId, onSelectPlace }: MapViewProps) {
  const positions = [
    { top: '35%', left: '45%' },
    { top: '55%', left: '30%' },
    { top: '42%', left: '62%' },
    { top: '68%', left: '55%' },
    { top: '28%', left: '72%' },
    { top: '75%', left: '38%' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-canvas via-brand-900/5 to-surface-muted">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(rgba(31,168,118,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31,168,118,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }}
      />
      <div className="absolute inset-0">
        <svg className="h-full w-full opacity-15" viewBox="0 0 400 400" preserveAspectRatio="none">
          <path d="M0,200 Q100,150 200,180 T400,160" fill="none" stroke="#7ec8b8" strokeWidth="3" />
          <path d="M50,0 Q150,100 100,250 T80,400" fill="none" stroke="#1fa876" strokeWidth="2" />
        </svg>
      </div>

      {places.map((place, index) => (
        <MapMarker
          key={place.id}
          place={place}
          position={positions[index % positions.length]}
          isSelected={selectedPlaceId === place.id}
          onSelect={onSelectPlace}
        />
      ))}
    </div>
  );
}
