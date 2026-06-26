"use client";

import { Activity, Heart, PawPrint, Scale, Sparkles } from "lucide-react";
import type { Pet } from "@/lib/planner-api";
import { sizeLabel } from "@/lib/planner-api";
import {
  buildPersonalityText,
  buildTraitChips,
  parsePetExtras,
  petStats,
} from "@/lib/pet-display";
import type { PetPersona } from "@/lib/wallet-api";
import { resolveDecoratedPhoto } from "@/lib/wallet-api";
import { getFrameStyle } from "@/lib/photo-decorator";

interface DogWalletCardProps {
  pet: Pet;
  persona: PetPersona | null;
}

const STAT_ICONS = [Sparkles, Scale, Activity] as const;

function traitTone(chip: string): string {
  if (/더위|취약|민감/.test(chip)) {
    return "bg-red-50 text-red-600 ring-red-100";
  }
  if (/활동|활발|많음/.test(chip)) {
    return "bg-blue-50 text-blue-600 ring-blue-100";
  }
  if (/사람|사교|좋아/.test(chip)) {
    return "bg-sage/10 text-sage ring-sage/20";
  }
  return "bg-cream text-brown ring-sage/10";
}

export default function DogWalletCard({ pet, persona }: DogWalletCardProps) {
  const photoUrl = resolveDecoratedPhoto(pet, persona);
  const extras = parsePetExtras(pet.features);
  const chips = buildTraitChips(pet, extras);
  const stats = petStats(pet, extras);
  const intro = buildPersonalityText(pet, extras, persona?.intro_text);
  const frame = getFrameStyle(extras.frameStyle);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-gradient-to-b from-stone-200/90 to-stone-100/80 shadow-sm" />

      <article
        className="relative overflow-hidden rounded-[2rem] p-[3px] shadow-xl shadow-sage/20"
        style={{
          background: `linear-gradient(135deg, ${frame.colors[0]}, ${frame.colors[1]})`,
        }}
      >
        <div className="overflow-hidden rounded-[calc(2rem-3px)] bg-white">
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-white sm:min-h-80">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${pet.name} 꾸민 프로필`}
                className="max-h-80 w-full object-contain object-center"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-cream sm:h-80">
                <PawPrint className="h-16 w-16 text-sage/30" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

            <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
              PHOTO · {pet.name} 실사 컷
            </span>

            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm font-medium text-white/85">
                {pet.breed} · {sizeLabel(pet.size)}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{pet.name}</h2>
            </div>
          </div>

          <div className="relative -mt-3 rounded-t-[1.75rem] bg-white px-5 pb-6 pt-6">
            <div className="mb-5 flex justify-center">
              <p className="relative max-w-[90%] rounded-2xl bg-ink px-4 py-3 text-center text-sm font-medium leading-relaxed text-white shadow-lg">
                {intro}
                <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-ink" />
              </p>
            </div>

            {stats.length > 0 && (
              <div className="mb-5 grid grid-cols-3 gap-2">
                {stats.map((stat, index) => {
                  const Icon = STAT_ICONS[index] ?? Sparkles;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-cream/80 px-2 py-2.5 text-center ring-1 ring-sage/10"
                    >
                      <Icon className="mx-auto h-3.5 w-3.5 text-sage" />
                      <p className="mt-1 text-[10px] text-brown-light">{stat.label}</p>
                      <p className="text-xs font-bold text-brown">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {chips.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-sage">
                  <Heart className="h-3.5 w-3.5 fill-sage/30 text-sage" />
                  강아지 특징
                </p>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${traitTone(chip)}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pet.temperament && pet.temperament !== "정보 없음" && (
              <p className="rounded-2xl bg-cream/60 px-4 py-3 text-sm leading-relaxed text-brown-light ring-1 ring-sage/10">
                {pet.temperament}
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
