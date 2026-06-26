import {
  AlertTriangle,
  CheckCircle2,
  Home,
  Link2,
  Package,
  Trash2,
  TreePine,
} from 'lucide-react';
import type { CourseStop, CourseStopStatus } from '@/types';

const statusStyles: Record<
  CourseStopStatus,
  { bg: string; border: string; text: string; icon: typeof CheckCircle2 }
> = {
  allowed: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
  },
  conditional: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: AlertTriangle,
  },
  denied: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    icon: AlertTriangle,
  },
};

const tagIcons = {
  leash: Link2,
  indoor: Home,
  outdoor: TreePine,
  carrier: Package,
  bag: Trash2,
};

interface DogEntryBadgeProps {
  dogName: string;
  status: CourseStopStatus;
  message: string;
  compact?: boolean;
}

export function DogEntryBadge({ dogName, status, message, compact = false }: DogEntryBadgeProps) {
  const style = statusStyles[status];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border ${style.bg} ${style.border} ${style.text} ${
        compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <Icon size={compact ? 12 : 14} />
      <span className="font-medium">
        {dogName}는 {message}
      </span>
    </div>
  );
}

interface CourseStopCardProps {
  stop: CourseStop;
  dogName: string;
  isLast?: boolean;
}

export function CourseStopCard({ stop, dogName, isLast = false }: CourseStopCardProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-sm">
          {stop.order}
        </div>
        {!isLast && <div className="mt-1 w-0.5 flex-1 rounded-full bg-brand-200" />}
      </div>

      <div className="mb-5 min-w-0 flex-1 rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-ink">{stop.name}</h3>
            <p className="text-xs text-ink-muted">{stop.category}</p>
          </div>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          체류 {stop.stayDuration} · 다음 {stop.distanceToNext}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {stop.tags.map((tag) => {
            const TagIcon = tagIcons[tag.icon];
            return (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-ink-muted"
              >
                <TagIcon size={11} />
                {tag.label}
              </span>
            );
          })}
        </div>

        <div className="mt-3">
          <DogEntryBadge dogName={dogName} status={stop.status} message={stop.statusMessage} />
        </div>
      </div>
    </div>
  );
}
