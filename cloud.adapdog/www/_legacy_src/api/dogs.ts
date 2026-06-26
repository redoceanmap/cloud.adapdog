import { apiClient } from './client';
import type { ActivityLevel, AiAnalysisResult, DogProfile, RegisteredDog } from '@/types';

interface PetApiItem {
  id: number;
  account_id: number;
  name: string;
  breed: string;
  photo_url: string;
  size: string;
  traits: string[];
  temperament: string;
  birth_year?: number | null;
  gender: string;
  features?: string | null;
}

function sizeToWeightKg(size: string): number {
  if (size === 'small') return 5;
  if (size === 'large') return 28;
  return 12;
}

function mapPetToDog(pet: PetApiItem): RegisteredDog {
  const age = pet.birth_year ? Math.max(0, new Date().getFullYear() - pet.birth_year) : 3;

  return {
    id: String(pet.id),
    name: pet.name,
    photoUrl: pet.photo_url,
    breed: pet.breed,
    age,
    weightKg: sizeToWeightKg(pet.size),
    activityLevel: 'moderate' as ActivityLevel,
    traits: pet.traits,
    personality: pet.temperament || pet.features || '',
  };
}

export async function fetchDogs(): Promise<RegisteredDog[]> {
  const pets = await apiClient<PetApiItem[]>('/users/pet/me');
  return pets.map(mapPetToDog);
}

export async function analyzeDogImage(file: File): Promise<AiAnalysisResult> {
  const formData = new FormData();
  formData.append('image', file);
  return apiClient<AiAnalysisResult>('/users/pet/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function saveDogProfile(profile: DogProfile): Promise<DogProfile> {
  return apiClient<DogProfile>('/users/pet', {
    method: 'POST',
    body: profile,
  });
}

export async function updateDog(id: string, dog: Partial<RegisteredDog>): Promise<RegisteredDog> {
  const pets = await fetchDogs();
  const current = pets.find((item) => item.id === id);
  if (!current) {
    throw new Error('반려견을 찾을 수 없습니다.');
  }
  return { ...current, ...dog };
}
