import { Activity, Heart, Pencil, Scale, Sparkles } from 'lucide-react';
import { DogPhoto } from '@/components/shared/DogPhoto';
import type { RegisteredDog } from '@/types';
import { activityLabels } from './DogSelector';

interface DogCardProps {
  dog: RegisteredDog;
  onEdit?: (dog: RegisteredDog) => void;
}

/** 에메랄드·베이지 톤의 둥근 지갑 카드 */
export function DogCard({ dog, onEdit }: DogCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-gradient-to-b from-stone-200/90 to-stone-100/80 shadow-sm" />

      <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-400 p-[1px] shadow-xl shadow-brand-900/15">
        <div className="overflow-hidden rounded-[calc(2rem-1px)] bg-gradient-to-br from-surface-muted via-canvas to-brand-50/30">
          <div className="relative h-44 overflow-hidden bg-line">
            <DogPhoto
              src={dog.photoUrl}
              alt={`${dog.name} 프로필 사진`}
              className="h-full w-full object-cover"
              iconSize={40}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(dog)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink-muted shadow-md backdrop-blur-sm transition hover:bg-surface hover:text-brand-600"
                aria-label={`${dog.name} 정보 편집`}
              >
                <Pencil size={16} />
              </button>
            )}

            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-xs font-medium text-white/80">{dog.breed}</p>
              <h2 className="text-2xl font-bold tracking-tight text-white">{dog.name}</h2>
            </div>
          </div>

          <div className="space-y-4 px-5 pb-6 pt-5">
            <div className="grid grid-cols-3 gap-2">
              <StatChip icon={Sparkles} label="나이" value={`${dog.age}살`} />
              <StatChip icon={Scale} label="체중" value={`${dog.weightKg}kg`} />
              <StatChip
                icon={Activity}
                label="활동량"
                value={activityLabels[dog.activityLevel]}
              />
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-brand-700">
                <Heart size={13} className="fill-brand-400 text-brand-400" />
                특징
              </p>
              <div className="flex flex-wrap gap-2">
                {dog.traits.map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-ink shadow-sm ring-1 ring-line/60"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <p className="rounded-2xl bg-surface/70 px-4 py-3 text-sm leading-relaxed text-ink-muted ring-1 ring-line/50">
              {dog.personality}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-surface/80 px-2 py-2.5 text-center shadow-sm ring-1 ring-line/50">
      <Icon size={14} className="mx-auto text-brand-500" />
      <p className="mt-1 text-[10px] text-ink-muted">{label}</p>
      <p className="text-xs font-bold text-ink">{value}</p>
    </div>
  );
}
