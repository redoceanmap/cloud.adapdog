import { useState } from 'react';
import { Compass, PawPrint, PenLine, Plus } from 'lucide-react';
import type { RegisteredDog } from '@/types';
import { createDefaultDog } from '@/utils/dogStorage';
import { DogCard } from './DogCard';
import { DogEditModal } from './DogEditModal';
import { DogSelector } from './DogSelector';

interface HomeScreenProps {
  dogs: RegisteredDog[];
  selectedDogId: string;
  onSelectDog: (id: string) => void;
  onExploreCourse?: (dog: RegisteredDog) => void;
  onRecord?: (dog: RegisteredDog) => void;
  onUpdateDog?: (dog: RegisteredDog) => void;
  onAddDog?: (dog: RegisteredDog) => void;
  onDeleteDog?: (id: string) => void;
  userName?: string;
}

export function HomeScreen({
  dogs,
  selectedDogId,
  onSelectDog,
  onExploreCourse,
  onRecord,
  onUpdateDog,
  onAddDog,
  onDeleteDog,
  userName,
}: HomeScreenProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editDog, setEditDog] = useState<RegisteredDog | null>(null);

  const selectedDog = dogs.find((dog) => dog.id === selectedDogId) ?? dogs[0] ?? null;

  const openEdit = (dog: RegisteredDog) => {
    setEditDog(dog);
    setEditOpen(true);
  };

  const openAdd = () => {
    setEditDog(createDefaultDog());
    setEditOpen(true);
  };

  const handleSave = (dog: RegisteredDog) => {
    if (dogs.some((item) => item.id === dog.id)) {
      onUpdateDog?.(dog);
    } else {
      onAddDog?.(dog);
      onSelectDog(dog.id);
    }
  };

  return (
    <div className="mx-auto min-h-[calc(100dvh-4rem)] max-w-lg px-5 pb-28 pt-8">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-brand-600">
          <PawPrint size={22} />
          <span className="text-sm font-semibold">발자국</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {userName ? `${userName}님, 오늘은 누구와 함께 갈까요?` : '오늘은 누구와 함께 갈까요?'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">반려견을 선택하면 맞춤 정보가 표시돼요</p>
      </header>

      <section className="mb-8" aria-label="반려견 선택">
        {dogs.length === 0 ? (
          <div className="rounded-3xl bg-surface-muted/60 px-4 py-8 text-center ring-1 ring-line">
            <p className="text-sm text-ink-muted">등록된 반려견이 없어요</p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
            >
              <Plus size={16} />
              반려견 추가하기
            </button>
          </div>
        ) : (
          <DogSelector
            dogs={dogs}
            selectedId={selectedDogId}
            onSelect={onSelectDog}
            onAdd={openAdd}
            onDelete={onDeleteDog}
          />
        )}
      </section>

      {selectedDog && (
        <>
          <section className="mb-6" aria-label="반려견 지갑 카드">
            <DogCard dog={selectedDog} onEdit={() => openEdit(selectedDog)} />
          </section>

          <section className="flex gap-3" aria-label="빠른 실행">
            <button
              type="button"
              onClick={() => onExploreCourse?.(selectedDog)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-[0.98]"
            >
              <Compass size={18} />
              코스 탐색
            </button>
            <button
              type="button"
              onClick={() => onRecord?.(selectedDog)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-200 bg-surface py-4 text-sm font-bold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]"
            >
              <PenLine size={18} />
              기록하기
            </button>
          </section>
        </>
      )}

      <DogEditModal
        dog={editDog}
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditDog(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
