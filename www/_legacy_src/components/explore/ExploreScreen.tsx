import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Accessibility,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Grid3X3,
  Loader2,
  MapPin,
  RefreshCw,
  Route,
  Search,
  SlidersHorizontal,
  Waves,
} from 'lucide-react';
import { DogEntryBadge } from '@/components/course/CourseStopCard';
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet';
import { NaverPlaceMap } from '@/components/map/NaverPlaceMap';
import { mockPlaces } from '@/data/mockPlaces';
import type { CourseStopStatus, Place, PlaceCategory, RegisteredDog } from '@/types';
import { APP_REGION, isGangneungPlace } from '@/utils/region';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const categories: { id: PlaceCategory; label: string; icon: typeof Grid3X3 }[] = [
  { id: 'all', label: '전체', icon: Grid3X3 },
  { id: 'cafe', label: '카페', icon: Coffee },
  { id: 'beach', label: '해변', icon: Waves },
  { id: 'lodging', label: '숙소', icon: BedDouble },
];

const categoryMap: Record<string, PlaceCategory> = {
  카페: 'cafe',
  해변: 'beach',
  공원: 'park',
  숙소: 'lodging',
};

function placeToStatus(place: Place): CourseStopStatus {
  if (place.pettiquette.level === 'allowed') return 'allowed';
  if (place.pettiquette.level === 'restricted') return 'conditional';
  return 'denied';
}

function statusMessage(place: Place): string {
  if (place.pettiquette.level === 'allowed') return '입장 가능';
  if (place.pettiquette.level === 'restricted') return place.pettiquette.description ?? '일부 제한';
  return '입장 불가';
}

interface ExploreScreenProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  dog?: RegisteredDog | null;
  selectedPlaceIds?: string[];
  onTogglePlace?: (placeId: string, place: Place) => void;
  onViewCustomCourse?: () => void;
}

export function ExploreScreen({
  places,
  loading = false,
  error = null,
  onRetry,
  dog,
  selectedPlaceIds = [],
  onTogglePlace,
  onViewCustomCourse,
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('all');
  const [barrierFreeOnly, setBarrierFreeOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const cardsScrollRef = useRef<HTMLDivElement>(null);

  const dogName = dog?.name ?? '반려견';
  const selectedSet = useMemo(() => new Set(selectedPlaceIds), [selectedPlaceIds]);

  const isPlaceSelected = (placeId: string) => selectedSet.has(placeId);

  const placeSource = useMemo(
    () => (places.length > 0 ? places : USE_MOCK ? mockPlaces : []),
    [places],
  );

  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim();

    return placeSource.filter((place) => {
      const matchesSearch =
        !query ||
        place.name.includes(query) ||
        place.category.includes(query) ||
        place.address.includes(query);

      const matchesDefaultRegion = query.length > 0 || isGangneungPlace(place);

      const placeCat = categoryMap[place.category] ?? 'all';
      const matchesCategory = activeCategory === 'all' || placeCat === activeCategory;

      const matchesBarrier =
        !barrierFreeOnly ||
        place.accessibility.level === 'full' ||
        place.accessibility.level === 'partial';

      return matchesSearch && matchesDefaultRegion && matchesCategory && matchesBarrier;
    });
  }, [placeSource, searchQuery, activeCategory, barrierFreeOnly]);

  const placePages = useMemo(() => {
    const pages: Place[][] = [];
    for (let i = 0; i < filteredPlaces.length; i += 2) {
      pages.push(filteredPlaces.slice(i, i + 2));
    }
    return pages;
  }, [filteredPlaces]);

  const updateScrollButtons = useCallback(() => {
    const el = cardsScrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = cardsScrollRef.current;
    if (!el) return;

    el.scrollTo({ left: 0 });
    updateScrollButtons();
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);
    return () => observer.disconnect();
  }, [placePages, updateScrollButtons]);

  const scrollCards = (direction: 'left' | 'right') => {
    const el = cardsScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth : el.clientWidth,
      behavior: 'smooth',
    });
  };

  const renderPlaceCard = (place: Place) => {
    const selected = isPlaceSelected(place.id);

    return (
      <div
        key={place.id}
        className={`relative min-w-0 rounded-3xl bg-surface p-4 shadow-lg transition ${
          selected ? 'ring-2 ring-brand-400' : 'ring-1 ring-line'
        }`}
      >
        <button
          type="button"
          onClick={() => setSelectedPlace(place)}
          className="w-full text-left"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-canvas text-brand-600">
            <MapPin size={18} />
          </div>
          <p className="truncate font-bold text-ink">{place.name}</p>
          <p className="text-xs text-ink-muted">{place.category}</p>
          <div className="mt-2">
            <DogEntryBadge
              dogName={dogName}
              status={placeToStatus(place)}
              message={statusMessage(place)}
              compact
            />
          </div>
        </button>
        {onTogglePlace && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlace(place.id, place);
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
              selected
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-surface text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50'
            }`}
            aria-label={selected ? '코스에서 제거' : '코스에 추가'}
          >
            {selected ? <Check size={14} /> : <span>+</span>}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-4.5rem)] max-w-lg flex-col overflow-y-auto bg-canvas px-4 pb-28 pt-5">
      <header className="shrink-0 space-y-3">
        <div className="flex items-center gap-2 rounded-full border border-line/60 bg-surface/95 px-4 py-3 shadow-lg shadow-black/5 dark:shadow-black/20">
          <Search size={18} className="shrink-0 text-brand-400" />
          <input
            type="search"
            placeholder="강릉 · 서울 · 제주 등 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
          <button type="button" className="text-ink-muted" aria-label="필터">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-surface/90 text-ink-muted shadow-sm'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setBarrierFreeOnly((v) => !v)}
            className={`mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
              barrierFreeOnly
                ? 'bg-sky-100 text-sky-800 ring-2 ring-sky-300'
                : 'bg-surface/80 text-ink-muted'
            }`}
          >
            <Accessibility size={13} />
            이동약자 배려 시설만
          </button>
          {!searchQuery.trim() && (
            <p className="mt-2 text-[11px] text-ink-muted">
              기본 지도는 {APP_REGION} 중심 · 다른 지역은 검색해 보세요
            </p>
          )}
        </div>
      </header>

      <section className="relative mt-4 h-[38dvh] min-h-[220px] max-h-[320px] shrink-0 overflow-hidden rounded-3xl bg-surface shadow-lg ring-1 ring-line">
        <NaverPlaceMap
          places={filteredPlaces}
          selectedPlaceId={selectedPlace?.id ?? null}
          onSelectPlace={setSelectedPlace}
        />

        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-canvas/60">
            <div className="flex items-center gap-2 rounded-full bg-surface/95 px-4 py-2 text-sm text-ink-muted shadow-md">
              <Loader2 size={16} className="animate-spin text-brand-500" />
              장소 불러오는 중...
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-3 top-3 z-10 rounded-2xl bg-surface/95 px-3 py-2.5 shadow-lg ring-1 ring-rose-100">
            <p className="text-xs text-rose-700">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-600"
              >
                <RefreshCw size={12} />
                다시 시도
              </button>
            )}
          </div>
        )}
      </section>

      {selectedPlaceIds.length > 0 && onViewCustomCourse && (
        <button
          type="button"
          onClick={onViewCustomCourse}
          className="mt-4 flex w-full shrink-0 items-center justify-between rounded-2xl bg-brand-600 px-5 py-3.5 text-white shadow-lg shadow-brand-600/25"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <Route size={16} />
            {selectedPlaceIds.length}곳 선택됨
          </span>
          <span className="text-xs font-semibold text-brand-100">코스 보기 →</span>
        </button>
      )}

      {placePages.length > 0 && (
        <section className="relative mt-4 shrink-0">
          {placePages.length > 1 && canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCards('left')}
              className="absolute -left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-brand-700 shadow-lg ring-1 ring-line transition hover:bg-brand-50"
              aria-label="이전 장소"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {placePages.length > 1 && canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCards('right')}
              className="absolute -right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-brand-700 shadow-lg ring-1 ring-line transition hover:bg-brand-50"
              aria-label="다음 장소"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div
            ref={cardsScrollRef}
            onScroll={updateScrollButtons}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {placePages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full shrink-0 snap-start grid-cols-2 gap-3"
              >
                {page.map((place) => renderPlaceCard(place))}
              </div>
            ))}
          </div>
        </section>
      )}

      <PlaceBottomSheet
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isInCourse={selectedPlace ? isPlaceSelected(selectedPlace.id) : false}
        onToggleCourse={
          onTogglePlace && selectedPlace
            ? (place) => onTogglePlace(place.id, place)
            : undefined
        }
      />
    </div>
  );
}
