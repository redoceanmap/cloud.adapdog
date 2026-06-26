import { useMemo, useState } from 'react';
import { Bookmark, ChevronLeft, Plus, Route } from 'lucide-react';
import { mockCourse } from '@/data/mockCourse';
import { useWeather } from '@/hooks/useWeather';
import type { RegisteredDog, TravelCourse } from '@/types';
import type { WeatherLocation } from '@/types/weather';
import { DEFAULT_WEATHER_LOCATION } from '@/types/weather';
import { CourseMap } from './CourseMap';
import { CourseStopCard } from './CourseStopCard';
import { WeatherWidget, calculateWalkRisk } from './WeatherWidget';

export interface CoursePageProps {
  course?: TravelCourse;
  dog?: RegisteredDog | null;
  weatherLocation?: WeatherLocation;
  onBack?: () => void;
}

/** 코스 상세 — 날씨·지도·타임라인 통합 페이지 */
export function CoursePage({
  course = mockCourse,
  dog,
  weatherLocation = DEFAULT_WEATHER_LOCATION,
  onBack,
}: CoursePageProps) {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [barrierFreeOnly, setBarrierFreeOnly] = useState(false);

  const dogName = dog?.name ?? '반려견';

  const { data: weather, loading: weatherLoading, error: weatherError, refetch } =
    useWeather(weatherLocation);

  const walkRisk = useMemo(
    () => (weather ? calculateWalkRisk(weather) : null),
    [weather],
  );

  const dayStops = useMemo(
    () => course.stops.filter((stop) => stop.day === activeDay).sort((a, b) => a.order - b.order),
    [course.stops, activeDay],
  );

  const dayDistance =
    activeDay === 1 ? course.totalDistanceKm : course.totalDistanceKm * 0.6;

  return (
    <div className="min-h-[calc(100dvh-4.5rem)] bg-canvas pb-28">
      <header className="sticky top-0 z-20 bg-canvas/90 px-4 pb-3 pt-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-sm"
            aria-label="뒤로"
          >
            <ChevronLeft size={20} className="text-ink-muted" />
          </button>
          <h1 className="text-base font-bold text-ink">
            {dogName}랑 {course.title}
          </h1>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-sm"
            aria-label="저장"
          >
            <Bookmark size={18} className="text-ink-muted" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-4 px-4">
        <WeatherWidget
          weather={weather}
          walkRisk={walkRisk}
          loading={weatherLoading}
          error={weatherError}
          onRetry={refetch}
          dogName={dogName}
        />

        <div>
          <CourseMap
            stops={course.stops}
            activeDay={activeDay}
            barrierFreeOnly={barrierFreeOnly}
          />
          <label className="mt-0 flex items-center justify-between rounded-b-3xl border border-t-0 border-line bg-surface px-4 py-3">
            <span className="text-sm text-ink-muted">이동약자 배려 시설만 보기</span>
            <button
              type="button"
              role="switch"
              aria-checked={barrierFreeOnly}
              onClick={() => setBarrierFreeOnly((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition ${barrierFreeOnly ? 'bg-brand-500' : 'bg-line'}`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${barrierFreeOnly ? 'left-5' : 'left-0.5'}`}
              />
            </button>
          </label>
        </div>

        <div className="flex rounded-full bg-line/60 p-1">
          {([1, 2] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                activeDay === day
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {day}일차
            </button>
          ))}
        </div>

        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Route size={15} className="text-brand-500" />
          {activeDay}일차 동선 · {dayStops.length}곳 · 총 {dayDistance.toFixed(1)} km
        </p>

        <div>
          {dayStops.map((stop, index) => (
            <CourseStopCard
              key={stop.id}
              stop={stop}
              dogName={dogName}
              isLast={index === dayStops.length - 1}
            />
          ))}
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-surface py-4 text-sm font-semibold text-ink-muted transition hover:border-brand-300 hover:text-brand-600"
        >
          <Plus size={18} />
          장소 추가하기
        </button>
      </div>
    </div>
  );
}
