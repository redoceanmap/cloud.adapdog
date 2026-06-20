import { Plus, X } from 'lucide-react';
import { DogPhoto } from '@/components/shared/DogPhoto';
import type { RegisteredDog } from '@/types';

const activityLabels = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
} as const;

interface DogSelectorProps {
  dogs: RegisteredDog[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
}

export function DogSelector({ dogs, selectedId, onSelect, onAdd, onDelete }: DogSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {dogs.map((dog) => {
        const isSelected = dog.id === selectedId;

        return (
          <div key={dog.id} className="relative shrink-0">
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dog.id);
                }}
                className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md ring-2 ring-canvas transition hover:bg-rose-600"
                aria-label={`${dog.name || '반려견'} 삭제`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelect(dog.id)}
              className={`flex flex-col items-center gap-2 rounded-3xl px-3 py-2.5 transition ${
                isSelected
                  ? 'bg-brand-100/80 ring-2 ring-brand-400 ring-offset-2 ring-offset-canvas dark:bg-brand-900/40 dark:ring-brand-500'
                  : 'bg-surface/70 hover:bg-surface'
              }`}
              aria-pressed={isSelected}
              aria-label={`${dog.name} 선택`}
            >
              <div
                className={`h-14 w-14 overflow-hidden rounded-full border-2 ${
                  isSelected ? 'border-brand-400' : 'border-line'
                }`}
              >
                <DogPhoto
                  src={dog.photoUrl}
                  alt={dog.name}
                  className="h-full w-full object-cover"
                  iconSize={20}
                />
              </div>
              <span
                className={`max-w-[4.5rem] truncate text-xs font-semibold ${
                  isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-ink-muted'
                }`}
              >
                {dog.name || '이름 없음'}
              </span>
            </button>
          </div>
        );
      })}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand-300 bg-surface/50 px-3 py-2.5 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-brand-700 dark:hover:bg-brand-900/20"
          aria-label="반려견 추가"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-brand-300 bg-brand-50/80 text-brand-600 dark:border-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
            <Plus size={22} strokeWidth={2.2} />
          </div>
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">추가</span>
        </button>
      )}
    </div>
  );
}

export { activityLabels };
