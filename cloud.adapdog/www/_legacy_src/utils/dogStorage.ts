import type { RegisteredDog } from '@/types';

const STORAGE_KEY = 'pawprint_registered_dogs';

/** 예전 데모용 목업 반려견 ID */
const LEGACY_MOCK_IDS = new Set(['dog-1', 'dog-2', 'dog-3']);

/** 예전 기본 목업 사진 (Unsplash) */
const LEGACY_STOCK_PHOTOS = new Set([
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596495577886-4e097d7c9244?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1611004669182-8740a63e0c7c?w=400&h=400&fit=crop',
]);

export function createDefaultDog(): RegisteredDog {
  return {
    id: `dog-${crypto.randomUUID()}`,
    name: '',
    photoUrl: '',
    breed: '',
    age: 3,
    weightKg: 5,
    activityLevel: 'moderate',
    traits: [],
    personality: '',
  };
}

function sanitizeDogPhoto(dog: RegisteredDog): RegisteredDog {
  let photoUrl = dog.photoUrl;
  if (photoUrl.startsWith('blob:')) {
    photoUrl = '';
  } else if (LEGACY_STOCK_PHOTOS.has(photoUrl)) {
    photoUrl = '';
  }
  return photoUrl === dog.photoUrl ? dog : { ...dog, photoUrl };
}

function stripLegacyMockDogs(dogs: RegisteredDog[]): RegisteredDog[] {
  return dogs.filter((dog) => !LEGACY_MOCK_IDS.has(dog.id));
}

export function loadStoredDogs(): RegisteredDog[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as RegisteredDog[];
    const withoutLegacy = stripLegacyMockDogs(parsed);
    const sanitized = withoutLegacy.map(sanitizeDogPhoto);
    const needsSave =
      withoutLegacy.length !== parsed.length ||
      parsed.some(
        (dog) =>
          dog.photoUrl.startsWith('blob:') || LEGACY_STOCK_PHOTOS.has(dog.photoUrl),
      );

    if (needsSave) {
      saveStoredDogs(sanitized);
    }

    return sanitized.length > 0 ? sanitized : null;
  } catch {
    return null;
  }
}

export function saveStoredDogs(dogs: RegisteredDog[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dogs));
    return true;
  } catch {
    return false;
  }
}

export function getInitialDogs(): RegisteredDog[] {
  return loadStoredDogs() ?? [];
}

/** 저장된 목록을 기준으로 API 데이터와 맞춤 (추가·삭제 반영) */
export function reconcileDogs(
  fetched: RegisteredDog[],
  stored: RegisteredDog[] | null,
): RegisteredDog[] {
  if (!stored?.length) return fetched;

  const fetchedById = new Map(fetched.map((dog) => [dog.id, dog]));
  const reconciled = stored.map((local) => {
    const remote = fetchedById.get(local.id);
    const merged = remote ? { ...remote, ...local } : local;
    return sanitizeDogPhoto(merged);
  });

  const storedIds = new Set(stored.map((dog) => dog.id));
  const newFromServer = fetched.filter((dog) => !storedIds.has(dog.id));

  return [...reconciled, ...newFromServer];
}

/** @deprecated reconcileDogs 사용 */
export function mergeStoredDogs(fetched: RegisteredDog[]): RegisteredDog[] {
  return reconcileDogs(fetched, loadStoredDogs());
}
