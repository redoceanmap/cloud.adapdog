"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass, Loader2, Sparkles, Wallet } from "lucide-react";
import DogPetSelector from "@/components/wallet/DogPetSelector";
import DogWalletCard from "@/components/wallet/DogWalletCard";
import PhotoDecorateModal from "@/components/wallet/PhotoDecorateModal";
import { useAuthSession } from "@/lib/use-auth-session";
import type { Pet } from "@/lib/planner-api";
import {
  fetchMyPets,
  fetchPetPersona,
  type PetPersona,
} from "@/lib/wallet-api";

export default function DogWalletView() {
  const router = useRouter();
  const { user, ready } = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [personas, setPersonas] = useState<Record<number, PetPersona | null>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [decorateOpen, setDecorateOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function load() {
      if (!user) {
        setLoading(false);
        router.replace("/login?next=/wallet");
        return;
      }

      try {
        const loadedPets = await fetchMyPets();
        if (loadedPets.length === 0) {
          throw new Error("등록된 반려견이 없습니다. 앱에서 프로필을 먼저 등록해 주세요.");
        }

        const personaEntries = await Promise.all(
          loadedPets.map(async (pet) => {
            try {
              const persona = await fetchPetPersona(pet.id);
              return [pet.id, persona] as const;
            } catch {
              return [pet.id, null] as const;
            }
          }),
        );

        if (cancelled) return;

        setPets(loadedPets);
        setPersonas(Object.fromEntries(personaEntries));
        setSelectedId(loadedPets[0].id);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "지갑을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ready, user, router]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedId) ?? pets[0] ?? null,
    [pets, selectedId],
  );

  return (
    <div className="wallet-page min-h-screen bg-cream pt-24 pb-16 paw-pattern">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm text-brown-light transition-colors hover:text-sage"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
          <div className="flex items-center gap-2 text-sage">
            <Wallet className="h-6 w-6" />
            <span className="text-sm font-semibold">강아지 지갑</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-brown md:text-4xl">
            {user?.name ?? "회원"}님의 반려견 카드
          </h1>
          <p className="mt-2 text-brown-light">
            사진을 업로드하고 프레임을 골라 지갑 카드를 꾸밀 수 있어요. 앱과 자동으로 동기화됩니다.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-24 text-brown-light">
            <Loader2 className="h-5 w-5 animate-spin" />
            지갑을 불러오는 중...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-8 text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex px-6 py-3"
              >
                앱에서 프로필 등록
              </a>
              <Link href="/" className="btn-secondary inline-flex px-6 py-3">
                홈으로
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && selectedPet && (
          <div className="space-y-8">
            {pets.length > 1 && (
              <section aria-label="반려견 선택">
                <p className="mb-3 text-sm font-medium text-brown-light">누구의 지갑을 볼까요?</p>
                <DogPetSelector
                  pets={pets}
                  personas={personas}
                  selectedId={selectedPet.id}
                  onSelect={setSelectedId}
                />
              </section>
            )}

            <section aria-label="반려견 지갑 카드">
              <DogWalletCard
                pet={selectedPet}
                persona={personas[selectedPet.id] ?? null}
              />
            </section>

            <section className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDecorateOpen(true)}
                className="btn-primary flex flex-1 items-center justify-center gap-2 px-6 py-4"
              >
                <Sparkles className="h-5 w-5" />
                사진 꾸미기
              </button>
              <Link
                href="/planner"
                className="btn-secondary flex flex-1 items-center justify-center gap-2 px-6 py-4"
              >
                <Compass className="h-5 w-5" />
                AI 플래너 보기
              </Link>
            </section>

            <PhotoDecorateModal
              pet={selectedPet}
              open={decorateOpen}
              onClose={() => setDecorateOpen(false)}
              onSaved={(updated) => {
                setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
