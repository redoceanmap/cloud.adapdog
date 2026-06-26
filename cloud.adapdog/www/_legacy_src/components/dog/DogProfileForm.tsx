import type { ActivityLevel } from '@/types';
import { BreedSelect } from '@/components/shared/BreedSelect';

const activityOptions: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'low', label: '낮음', description: '짧은 산책, 실내 위주' },
  { value: 'moderate', label: '보통', description: '하루 1~2회 산책' },
  { value: 'high', label: '높음', description: '활발한 운동, 야외 활동' },
];

export interface DogProfileFormData {
  name: string;
  age: string;
  activityLevel: ActivityLevel;
  breed: string;
  weightKg: string;
}

interface DogProfileFormProps {
  data: DogProfileFormData;
  onChange: (data: DogProfileFormData) => void;
  disabled?: boolean;
}

export function DogProfileForm({ data, onChange, disabled = false }: DogProfileFormProps) {
  const update = (patch: Partial<DogProfileFormData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="dog-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
          이름
        </label>
        <input
          id="dog-name"
          type="text"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="반려견 이름"
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dog-age" className="mb-1.5 block text-sm font-semibold text-slate-700">
            나이
          </label>
          <input
            id="dog-age"
            type="number"
            min={0}
            max={30}
            value={data.age}
            onChange={(e) => update({ age: e.target.value })}
            placeholder="살"
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
        </div>
        <div>
          <label htmlFor="dog-weight" className="mb-1.5 block text-sm font-semibold text-slate-700">
            체중 (kg)
          </label>
          <input
            id="dog-weight"
            type="number"
            min={0}
            step={0.1}
            value={data.weightKg}
            onChange={(e) => update({ weightKg: e.target.value })}
            placeholder="kg"
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="dog-breed" className="mb-1.5 block text-sm font-semibold text-slate-700">
          견종
        </label>
        <BreedSelect
          id="dog-breed"
          listId="profile-dog-breed-options"
          value={data.breed}
          onChange={(breed) => update({ breed })}
          disabled={disabled}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">활동량</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {activityOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col rounded-xl border-2 p-3 transition ${
                data.activityLevel === option.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-surface hover:border-slate-300'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                name="activityLevel"
                value={option.value}
                checked={data.activityLevel === option.value}
                onChange={() => update({ activityLevel: option.value })}
                disabled={disabled}
                className="sr-only"
              />
              <span className="font-semibold text-slate-800">{option.label}</span>
              <span className="mt-0.5 text-xs text-slate-500">{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
