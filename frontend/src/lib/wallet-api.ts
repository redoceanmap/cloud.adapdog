import { apiFetch, parseApiError } from "@/lib/api";
import type { Pet } from "@/lib/planner-api";
import { fetchMyPets } from "@/lib/planner-api";

export type { Pet };
export { fetchMyPets };

export interface PetPersona {
  pet_id: number;
  intro_text: string;
  hero_image_url: string;
  mascot_image_url: string;
  tone: string;
  created_at: string;
}

export async function fetchPetPersona(petId: number): Promise<PetPersona | null> {
  const res = await apiFetch(`/users/pet-persona?pet_id=${petId}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(await parseApiError(res));
  }
  const data = (await res.json()) as PetPersona | null;
  return data ?? null;
}

/** 앱에서 저장한 사진 → 페르소나 히어로 → 마스코트 순으로 꾸민 사진 URL을 고른다. */
export function resolveDecoratedPhoto(pet: Pet, persona: PetPersona | null): string {
  const skip = (url: string) =>
    !url?.trim() || url.includes("example.com") || url.includes("adapdog.example");

  for (const url of [pet.photo_url, persona?.hero_image_url, persona?.mascot_image_url]) {
    if (url && !skip(url)) return url;
  }
  return "";
}

export interface PetProfileExtras {
  intro?: string;
  traits?: string[];
  weightKg?: number;
  activityLevel?: "low" | "moderate" | "high";
  frameStyle?: string;
}

export function serializePetFeatures(extras: PetProfileExtras): string {
  return JSON.stringify({
    intro: extras.intro ?? "",
    traits: extras.traits ?? [],
    weight_kg: extras.weightKg,
    activity_level: extras.activityLevel,
    frame_style: extras.frameStyle,
  });
}

export async function updatePetProfile(
  petId: number,
  body: {
    name?: string;
    breed?: string;
    photo_url?: string;
    birth_year?: number;
    features?: string;
  },
): Promise<Pet> {
  const res = await apiFetch(`/users/pet/${petId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  return res.json() as Promise<Pet>;
}
