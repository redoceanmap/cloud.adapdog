"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EmergencyChatPanel from "@/components/emergency/EmergencyChatPanel";
import { loadAuthUser } from "@/lib/auth";
import type { Pet } from "@/lib/planner-api";
import { fetchMyPets } from "@/lib/planner-api";

const GUEST_PET: Pet = {
  id: 0,
  account_id: 0,
  name: "반려견",
  breed: "믹스견",
  photo_url: "",
  size: "medium",
  traits: [],
  temperament: "정보 없음",
  gender: "",
};

function EmergencyViewInner() {
  const searchParams = useSearchParams();
  const [pet, setPet] = useState<Pet>(GUEST_PET);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (!lat || !lng) return null;
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    return Number.isFinite(parsedLat) && Number.isFinite(parsedLng)
      ? { lat: parsedLat, lng: parsedLng }
      : null;
  });

  const region = searchParams.get("region") ?? "";

  useEffect(() => {
    const user = loadAuthUser();
    if (!user) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void fetchMyPets()
        .then((pets) => {
          if (!cancelled && pets[0]) setPet(pets[0]);
        })
        .catch(() => {});
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (coords || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, [coords]);

  return (
    <div
      className="planner-workbench flex w-full max-w-5xl flex-col overflow-hidden rounded-[22px] border shadow-2xl"
      style={{
        borderColor: "var(--pw-border)",
        background: "var(--pw-panel)",
        boxShadow: "var(--pw-shadow)",
        minHeight: "min(720px, calc(100vh - 7rem))",
        maxHeight: "min(948px, 95vh)",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--pw-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          앱 소개
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/planner"
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
            style={{ background: "var(--pw-chip)", color: "var(--pw-text)" }}
          >
            AI 플래너
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <EmergencyChatPanel
          pet={pet}
          region={region}
          latitude={coords?.lat}
          longitude={coords?.lng}
          layout="page"
        />
      </div>
    </div>
  );
}

export default function EmergencyView() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm" style={{ color: "var(--pw-muted)" }}>
          응급 상담을 준비하는 중...
        </div>
      }
    >
      <EmergencyViewInner />
    </Suspense>
  );
}
