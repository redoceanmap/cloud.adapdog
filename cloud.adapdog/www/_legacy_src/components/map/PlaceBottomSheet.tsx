import { MapPin, Plus, Star, X } from 'lucide-react';
import type { Place } from '@/types';
import { PolicyBadgeGroup } from '@/components/badges';
import { ReservationButton } from '@/components/shared/ReservationButton';

interface PlaceBottomSheetProps {
  place: Place | null;
  onClose: () => void;
  isInCourse?: boolean;
  onToggleCourse?: (place: Place) => void;
}

export function PlaceBottomSheet({
  place,
  onClose,
  isInCourse = false,
  onToggleCourse,
}: PlaceBottomSheetProps) {
  if (!place) return null;

  const isLodging = place.category === '숙소';

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="장소 상세 닫기"
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] w-full max-w-lg animate-slide-up overflow-hidden rounded-t-3xl bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-sheet-title"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 pt-2 pb-3">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {place.category}
            </span>
            <h2 id="place-sheet-title" className="mt-2 text-xl font-bold text-slate-900">
              {place.name}
            </h2>
            <p className="mt-1 flex items-start gap-1 text-sm text-slate-500">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              {place.address}
            </p>
            {place.rating !== undefined && (
              <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-amber-600">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {place.rating.toFixed(1)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">{place.description}</p>
          <PolicyBadgeGroup pettiquette={place.pettiquette} accessibility={place.accessibility} size="md" />
          {isLodging && (
            <div className="mt-5">
              <ReservationButton reservationUrl={place.reservationUrl} />
            </div>
          )}
          {onToggleCourse && (
            <button
              type="button"
              onClick={() => onToggleCourse(place)}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition ${
                isInCourse
                  ? 'bg-surface-muted text-ink-muted ring-2 ring-line'
                  : 'bg-brand-500 text-white shadow-md shadow-brand-500/25 hover:bg-brand-600'
              }`}
            >
              {isInCourse ? (
                <>
                  <X size={16} />
                  코스에서 빼기
                </>
              ) : (
                <>
                  <Plus size={16} />
                  코스에 추가
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
