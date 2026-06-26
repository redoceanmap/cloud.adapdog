import type { Pet } from "@/lib/planner-api";
import { sizeLabel } from "@/lib/planner-api";

const TRAIT_LABELS: Record<string, string> = {
  brachycephalic: "더위 취약",
};

const ACTIVITY_LABELS: Record<string, string> = {
  low: "활동량 적음",
  moderate: "활동량 보통",
  high: "활동량 많음",
};

export interface ParsedPetExtras {
  tags: string[];
  weightKg?: number;
  activityLabel?: string;
  intro?: string;
  frameStyle?: string;
}

export function traitLabel(trait: string): string {
  return TRAIT_LABELS[trait] ?? trait;
}

export function petAgeLabel(birthYear?: number | null): string | null {
  if (!birthYear) return null;
  const age = new Date().getFullYear() - birthYear;
  if (age < 1) return "1살 미만";
  return `${age}살`;
}

export function parsePetExtras(features?: string | null): ParsedPetExtras {
  if (!features?.trim()) return { tags: [] };

  try {
    const parsed = JSON.parse(features) as Record<string, unknown>;
    const tags = Array.isArray(parsed.traits)
      ? parsed.traits.map(String)
      : Array.isArray(parsed.tags)
        ? parsed.tags.map(String)
        : [];

    const weightRaw = parsed.weight_kg ?? parsed.weightKg;
    const weightKg =
      typeof weightRaw === "number"
        ? weightRaw
        : typeof weightRaw === "string" && weightRaw
          ? Number(weightRaw)
          : undefined;

    const activity = String(parsed.activity_level ?? parsed.activityLevel ?? "");
    const activityLabel = ACTIVITY_LABELS[activity] ?? (activity || undefined);

    const introRaw = typeof parsed.intro === "string" ? parsed.intro.trim() : "";
    const intro = introRaw || undefined;
    const frameStyle =
      typeof parsed.frame_style === "string"
        ? parsed.frame_style
        : typeof parsed.frameStyle === "string"
          ? parsed.frameStyle
          : undefined;

    return {
      tags,
      weightKg: Number.isFinite(weightKg) ? weightKg : undefined,
      activityLabel,
      intro,
      frameStyle,
    };
  } catch {
    return {
      tags: features
        .split(/[,，]/)
        .map((part) => part.trim())
        .filter(Boolean),
    };
  }
}

export function buildTraitChips(pet: Pet, extras: ParsedPetExtras): string[] {
  const chips = new Set<string>();

  if (extras.activityLabel) chips.add(extras.activityLabel);
  for (const trait of pet.traits) chips.add(traitLabel(trait));
  for (const tag of extras.tags) chips.add(tag);

  if (pet.temperament && pet.temperament !== "정보 없음") {
    const short = pet.temperament.split(/[.,]/)[0]?.trim();
    if (short && short.length <= 12) chips.add(short);
  }

  return [...chips].slice(0, 6);
}

export function buildPersonalityText(
  pet: Pet,
  extras: ParsedPetExtras,
  personaIntro?: string,
): string {
  const intro = extras.intro?.trim();
  if (intro) return intro;

  const persona = personaIntro?.trim();
  if (persona) return persona;

  const rawFeatures = pet.features?.trim();
  if (rawFeatures) {
    try {
      JSON.parse(rawFeatures);
    } catch {
      return rawFeatures;
    }
  }

  if (pet.temperament && pet.temperament !== "정보 없음") return pet.temperament;
  return `안녕! 나는 ${pet.name}야. 같이 여행 가볼까?`;
}

export function petStats(pet: Pet, extras: ParsedPetExtras) {
  return [
    { label: "크기", value: sizeLabel(pet.size) },
    extras.weightKg ? { label: "체중", value: `${extras.weightKg}kg` } : null,
    petAgeLabel(pet.birth_year) ? { label: "나이", value: petAgeLabel(pet.birth_year)! } : null,
  ].filter(Boolean) as { label: string; value: string }[];
}
