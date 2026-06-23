import { ChevronDown } from 'lucide-react';
import { DOG_BREED_OPTIONS } from '@/data/dogBreeds';

interface BreedSelectProps {
  value: string;
  onChange: (breed: string) => void;
  disabled?: boolean;
  id?: string;
  listId?: string;
}

const inputClass =
  'w-full rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:bg-surface focus:ring-2 focus:ring-brand-100 disabled:opacity-50';

/** 견종 선택 + 직접 입력 (datalist + 빠른 선택 칩) */
export function BreedSelect({
  value,
  onChange,
  disabled = false,
  id = 'dog-breed',
  listId = 'dog-breed-options',
}: BreedSelectProps) {
  const isCustom =
    value.length > 0 && !(DOG_BREED_OPTIONS as readonly string[]).includes(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          type="text"
          list={listId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="견종을 선택하거나 직접 입력하세요"
          disabled={disabled}
          className={`${inputClass} pr-10`}
          autoComplete="off"
        />
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <datalist id={listId}>
          {DOG_BREED_OPTIONS.map((breed) => (
            <option key={breed} value={breed} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {DOG_BREED_OPTIONS.slice(0, 8).map((breed) => (
          <button
            key={breed}
            type="button"
            disabled={disabled}
            onClick={() => onChange(breed)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              value === breed
                ? 'bg-brand-500 text-white'
                : 'bg-surface-muted text-ink-muted hover:bg-brand-50 hover:text-brand-700'
            } disabled:opacity-50`}
          >
            {breed}
          </button>
        ))}
      </div>

      {isCustom && (
        <p className="text-[11px] text-brand-600">직접 입력: {value}</p>
      )}
    </div>
  );
}

export { inputClass as breedInputClass };
