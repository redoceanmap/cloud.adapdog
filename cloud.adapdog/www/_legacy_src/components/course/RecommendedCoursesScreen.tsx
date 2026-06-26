import { Accessibility, ChevronRight, MapPin, PawPrint, Route, Sparkles } from 'lucide-react';
import type { PersonalizedCourse } from '@/types';

const gradientMap: Record<PersonalizedCourse['gradient'], string> = {
  orange: 'from-orange-200 via-orange-100 to-amber-50',
  green: 'from-emerald-200 via-teal-100 to-cyan-50',
  sky: 'from-sky-200 via-blue-100 to-indigo-50',
  rose: 'from-rose-200 via-pink-100 to-orange-50',
  violet: 'from-violet-200 via-purple-100 to-fuchsia-50',
};

const badgeIcon = {
  recommended: PawPrint,
  'barrier-free': Accessibility,
  custom: Route,
} as const;

interface CourseCardProps {
  course: PersonalizedCourse;
  onSelect: (course: PersonalizedCourse) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  const BadgeIcon = badgeIcon[course.badge];
  const isTopPick = course.rank === 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(course)}
      className={`w-full overflow-hidden rounded-[28px] bg-surface text-left shadow-md shadow-stone-200/50 transition hover:shadow-lg active:scale-[0.99] ${
        isTopPick ? 'ring-2 ring-brand-400' : 'ring-1 ring-line'
      }`}
    >
      <div className={`relative h-36 bg-gradient-to-br ${gradientMap[course.gradient]}`}>
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-[11px] font-bold text-ink shadow-sm">
          <BadgeIcon size={13} className="text-brand-600" />
          {course.badgeLabel}
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
          <Sparkles size={11} />
          {course.matchScore}% 맞춤
        </span>
        {isTopPick && (
          <span className="absolute bottom-3 left-4 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold text-brand-700">
            1순위 추천
          </span>
        )}
      </div>

      <div className="space-y-3 px-5 py-4">
        <div>
          <h3 className="text-lg font-bold leading-snug text-ink">{course.title}</h3>
          <p className="mt-1 text-xs text-ink-muted">
            {course.region} · {course.course.totalDays}일 · {course.course.stops.length}곳
          </p>
        </div>

        <ul className="space-y-1.5">
          {course.highlights.map((line, index) => (
            <li
              key={`${line}-${index}`}
              className={`flex items-center gap-2 text-xs ${
                index === 0 ? 'font-semibold text-brand-700' : 'text-ink-muted'
              }`}
            >
              <MapPin size={12} className={`shrink-0 ${index === 0 ? 'text-brand-500' : 'text-brand-400'}`} />
              {line}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

interface RecommendedCoursesScreenProps {
  courses: PersonalizedCourse[];
  dogName?: string;
  dogBreed?: string;
  customStopCount?: number;
  onSelectCourse: (course: PersonalizedCourse) => void;
  onViewCustomCourse?: () => void;
}

export function RecommendedCoursesScreen({
  courses,
  dogName,
  dogBreed,
  customStopCount = 0,
  onSelectCourse,
  onViewCustomCourse,
}: RecommendedCoursesScreenProps) {
  return (
    <div className="mx-auto min-h-[calc(100dvh-4.5rem)] max-w-lg px-5 pb-28 pt-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {courses.length} 강릉 맞춤 추천 코스
          </h1>
          {dogName && (
            <p className="mt-1 text-sm text-ink-muted">
              {dogBreed ? `${dogName}(${dogBreed})` : dogName} · 강릉 여행 성격·활동량 기준
            </p>
          )}
        </div>
        <button type="button" className="flex items-center gap-0.5 text-sm text-ink-muted">
          전체
          <ChevronRight size={16} />
        </button>
      </header>

      {customStopCount > 0 && onViewCustomCourse && (
        <button
          type="button"
          onClick={onViewCustomCourse}
          className="mb-5 w-full overflow-hidden rounded-[28px] bg-surface text-left shadow-md ring-2 ring-brand-300 transition hover:shadow-lg"
        >
          <div className="relative h-28 bg-gradient-to-br from-brand-200 via-brand-100 to-orange-50">
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-[11px] font-bold text-brand-700 shadow-sm">
              <Route size={13} />
              내가 고른 코스
            </span>
          </div>
          <div className="px-5 py-4">
            <h3 className="text-lg font-bold text-ink">탐색에서 선택한 {customStopCount}곳</h3>
            <p className="mt-1 text-xs text-ink-muted">탐색 탭에서 고른 장소로 동선을 확인해 보세요</p>
          </div>
        </button>
      )}

      <div className="space-y-5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
        ))}
      </div>
    </div>
  );
}
