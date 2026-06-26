"use client";

import { Plus, PawPrint } from "lucide-react";
import type { Pet } from "@/lib/planner-api";
import { resolveDecoratedPhoto } from "@/lib/wallet-api";
import type { PetPersona } from "@/lib/wallet-api";

interface DogPetSelectorProps {
  pets: Pet[];
  personas: Record<number, PetPersona | null>;
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function DogPetSelector({
  pets,
  personas,
  selectedId,
  onSelect,
}: DogPetSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {pets.map((pet) => {
        const active = pet.id === selectedId;
        const thumb = resolveDecoratedPhoto(pet, personas[pet.id] ?? null);

        return (
          <button
            key={pet.id}
            type="button"
            onClick={() => onSelect(pet.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-3 py-2 transition-all ${
              active
                ? "border-sage bg-sage/10 shadow-md shadow-sage/15"
                : "border-sage/15 bg-white hover:border-sage/30"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${
                active ? "ring-2 ring-sage ring-offset-1" : ""
              }`}
            >
              {thumb ? (
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-300 to-orange-400">
                  <PawPrint className="h-4 w-4 text-white" />
                </span>
              )}
            </span>
            <span className={`text-sm font-semibold ${active ? "text-sage" : "text-brown"}`}>
              {pet.name}
            </span>
          </button>
        );
      })}

      <a
        href="http://localhost:3000"
        target="_blank"
        rel="noreferrer"
        className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-dashed border-sage/25 px-4 py-2 text-sm font-medium text-brown-light transition hover:border-sage/40 hover:text-sage"
      >
        <Plus className="h-4 w-4" />
        앱에서 추가
      </a>
    </div>
  );
}
