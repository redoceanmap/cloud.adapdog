import { useCallback, useEffect, useState } from 'react';
import { fetchDogs, updateDog } from '@/api/dogs';
import { useFetch } from '@/hooks/useFetch';
import { getInitialDogs, loadStoredDogs, reconcileDogs, saveStoredDogs } from '@/utils/dogStorage';
import type { AuthUser } from '@/types/auth';
import type { RegisteredDog } from '@/types';
import { HomeScreen } from './HomeScreen';
import { WelcomeIntro } from './WelcomeIntro';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

async function loadDogs(): Promise<RegisteredDog[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getInitialDogs();
  }
  const fetched = await fetchDogs();
  return reconcileDogs(fetched, loadStoredDogs());
}

interface HomeContainerProps {
  user: AuthUser | null;
  onGoToProfile: () => void;
  onExploreCourse?: (dog: RegisteredDog) => void;
  onRecord?: (dog: RegisteredDog) => void;
  onDogUpdate?: (dog: RegisteredDog) => void;
}

export function HomeContainer(props: HomeContainerProps) {
  if (!props.user) {
    return <WelcomeIntro onStart={props.onGoToProfile} />;
  }

  return <HomeWallet {...props} user={props.user} />;
}

function HomeWallet({
  user,
  onExploreCourse,
  onRecord,
  onDogUpdate,
}: Omit<HomeContainerProps, 'onGoToProfile'> & { user: AuthUser }) {
  const fetcher = useCallback(() => loadDogs(), []);
  const { data, loading, error } = useFetch(fetcher, []);

  const [dogs, setDogs] = useState<RegisteredDog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    setDogs((prev) => (prev.length > 0 ? prev : data));
    setSelectedDogId((prev) =>
      prev && data.some((dog) => dog.id === prev) ? prev : (data[0]?.id ?? ''),
    );
  }, [data]);

  useEffect(() => {
    if (!saveNotice) return;
    const timer = window.setTimeout(() => setSaveNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [saveNotice]);

  const handleUpdateDog = async (updated: RegisteredDog) => {
    setSaveNotice(null);

    const persistDogs = (next: RegisteredDog[]) => {
      setDogs(next);
      saveStoredDogs(next);
    };

    if (USE_MOCK) {
      const next = dogs.map((dog) => (dog.id === updated.id ? updated : dog));
      const saved = saveStoredDogs(next);
      setDogs(next);

      setSaveNotice(
        saved
          ? '브라우저에 저장했어요 (localStorage)'
          : '저장에 실패했어요. 프로필 → 백엔드 연결 상태를 확인해 주세요.',
      );
    } else {
      try {
        const savedDog = await updateDog(updated.id, updated);
        const merged = { ...savedDog, photoUrl: updated.photoUrl };
        const next = dogs.map((dog) => (dog.id === merged.id ? merged : dog));
        persistDogs(next);
        setSaveNotice('서버에 저장했어요');
      } catch {
        setSaveNotice('서버 저장에 실패했어요. 프로필 → 백엔드 연결 상태를 확인해 주세요.');
      }
    }

    onDogUpdate?.(updated);
  };

  const handleAddDog = (dog: RegisteredDog) => {
    setSaveNotice(null);
    const next = [...dogs, dog];
    setDogs(next);
    saveStoredDogs(next);
    setSelectedDogId(dog.id);
    setSaveNotice(`${dog.name || '새 반려견'}을(를) 추가했어요`);
    onDogUpdate?.(dog);
  };

  const handleDeleteDog = (id: string) => {
    const target = dogs.find((dog) => dog.id === id);
    if (!target) return;

    const label = target.name || '이 반려견';
    if (!window.confirm(`${label}을(를) 목록에서 삭제할까요?`)) return;

    setSaveNotice(null);
    const next = dogs.filter((dog) => dog.id !== id);
    setDogs(next);
    saveStoredDogs(next);
    setSelectedDogId((prev) =>
      next.some((dog) => dog.id === prev) ? prev : (next[0]?.id ?? ''),
    );
    setSaveNotice(`${label}을(를) 삭제했어요`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-canvas">
        <p className="text-sm text-ink-muted">반려견 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error && dogs.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-canvas px-6">
        <p className="text-center text-sm text-ink-muted">{error}</p>
      </div>
    );
  }

  return (
    <>
      {saveNotice && (
        <div className="fixed inset-x-0 top-3 z-50 mx-auto max-w-lg px-5">
          <p className="rounded-2xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/30">
            {saveNotice}
          </p>
        </div>
      )}
      <HomeScreen
        dogs={dogs}
        selectedDogId={selectedDogId}
        onSelectDog={setSelectedDogId}
        onExploreCourse={onExploreCourse}
        onRecord={onRecord}
        onUpdateDog={handleUpdateDog}
        onAddDog={handleAddDog}
        onDeleteDog={handleDeleteDog}
        userName={user.name}
      />
    </>
  );
}
