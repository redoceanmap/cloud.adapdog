import { useState } from 'react';
import { Loader2, Map, RefreshCw, Search } from 'lucide-react';
import type { Place } from '@/types';
import { MapView } from './MapView';
import { PlaceBottomSheet } from './PlaceBottomSheet';

interface MapScreenProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function MapScreen({ places, loading = false, error = null, onRetry }: MapScreenProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = places.filter(
    (place) =>
      place.name.includes(searchQuery) ||
      place.category.includes(searchQuery) ||
      place.address.includes(searchQuery),
  );

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-4rem)] flex-col bg-canvas">
      <header className="absolute inset-x-0 top-0 z-20 px-5 pt-5">
        <div className="mx-auto flex max-w-lg items-center">
          <div className="flex w-full items-center gap-3 rounded-full border border-orange-100/80 bg-surface/95 px-5 py-3.5 shadow-md shadow-orange-100/60 backdrop-blur-sm">
            <Search size={18} className="shrink-0 text-brand-400" />
            <input
              type="search"
              placeholder="강아지와 함께 가고 싶은 곳을 검색해 보세요!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      <div className="relative flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center bg-canvas">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2 size={32} className="animate-spin text-brand-500" />
              <p className="text-sm">장소 정보를 불러오는 중이에요...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
            <Map size={40} className="text-orange-200" />
            <p className="text-sm text-slate-600">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600"
              >
                <RefreshCw size={16} />
                다시 시도
              </button>
            )}
          </div>
        ) : (
          <MapView
            places={filteredPlaces}
            selectedPlaceId={selectedPlace?.id ?? null}
            onSelectPlace={setSelectedPlace}
          />
        )}
      </div>

      {!loading && !error && filteredPlaces.length > 0 && (
        <div className="absolute inset-x-0 bottom-5 z-20 px-5">
          <div className="mx-auto flex max-w-lg gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedPlace(place)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-medium transition ${
                  selectedPlace?.id === place.id
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'border border-orange-100 bg-surface/95 text-slate-600 shadow-sm hover:bg-surface'
                }`}
              >
                {place.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <PlaceBottomSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}
