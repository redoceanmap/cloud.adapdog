"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, PawPrint, Sparkles, X } from "lucide-react";
import type { Pet } from "@/lib/planner-api";
import { parsePetExtras } from "@/lib/pet-display";
import {
  FRAME_STYLES,
  type FrameStyleId,
  readFileAsDataUrl,
  prepareWalletPhoto,
} from "@/lib/photo-decorator";
import { serializePetFeatures, updatePetProfile } from "@/lib/wallet-api";

const ACTIVITY_OPTIONS = [
  { value: "low" as const, label: "적음" },
  { value: "moderate" as const, label: "보통" },
  { value: "high" as const, label: "많음" },
];

interface PhotoDecorateModalProps {
  pet: Pet;
  open: boolean;
  onClose: () => void;
  onSaved: (pet: Pet) => void;
}

export default function PhotoDecorateModal({
  pet,
  open,
  onClose,
  onSaved,
}: PhotoDecorateModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const extras = parsePetExtras(pet.features);

  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [intro, setIntro] = useState(extras.intro ?? "");
  const [traitsInput, setTraitsInput] = useState(extras.tags.join(", "));
  const [weightKg, setWeightKg] = useState(
    extras.weightKg ? String(extras.weightKg) : "",
  );
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">(
    extras.activityLabel?.includes("많음")
      ? "high"
      : extras.activityLabel?.includes("적음")
        ? "low"
        : "moderate",
  );
  const [frameStyle, setFrameStyle] = useState<FrameStyleId>(
    (extras.frameStyle as FrameStyleId) || "gold",
  );
  const [rawPhoto, setRawPhoto] = useState("");
  const [previewUrl, setPreviewUrl] = useState(pet.photo_url);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const parsed = parsePetExtras(pet.features);
    setName(pet.name);
    setBreed(pet.breed);
    setIntro(parsed.intro ?? "");
    setTraitsInput(parsed.tags.join(", "));
    setWeightKg(parsed.weightKg ? String(parsed.weightKg) : "");
    setActivityLevel(
      parsed.activityLabel?.includes("많음")
        ? "high"
        : parsed.activityLabel?.includes("적음")
          ? "low"
          : "moderate",
    );
    setFrameStyle((parsed.frameStyle as FrameStyleId) || "gold");
    setRawPhoto("");
    setPreviewUrl(pet.photo_url);
    setError("");
  }, [open, pet]);

  useEffect(() => {
    if (!open) return;
    setPreviewUrl(rawPhoto || pet.photo_url);
  }, [open, rawPhoto, pet.photo_url]);

  if (!open) return null;

  const handleFile = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setRawPhoto(dataUrl);
      setError("");
    } catch {
      setError("사진을 불러오지 못했습니다.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const source = rawPhoto || pet.photo_url;
      const photoToSave = source ? await prepareWalletPhoto(source) : pet.photo_url;

      const traits = traitsInput
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const updated = await updatePetProfile(pet.id, {
        name: name.trim() || pet.name,
        breed: breed.trim() || pet.breed,
        photo_url: photoToSave,
        features: serializePetFeatures({
          intro: intro.trim(),
          traits,
          weightKg: weightKg ? Number(weightKg) : undefined,
          activityLevel,
          frameStyle,
        }),
      });

      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="decorate-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sage" />
            <h2 id="decorate-title" className="text-lg font-bold text-brown">
              사진 꾸미기
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-brown-light hover:bg-sage/10"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl ring-1 ring-sage/15">
            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="max-h-56 w-full object-contain object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cream">
                  <PawPrint className="h-12 w-12 text-sage/30" />
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                PHOTO · {name || pet.name} 실사 컷
              </span>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-sage/25 bg-brand-soft py-3 text-sm font-semibold text-sage transition hover:bg-sage/10"
          >
            <Camera className="h-4 w-4" />
            사진 업로드
          </button>

          <Field label="프레임 색상">
            <p className="mb-2 text-xs text-brown-light">카드 테두리 포인트 색이에요. 사진 위에 색 띠는 넣지 않습니다.</p>
            <div className="grid grid-cols-3 gap-2">
              {FRAME_STYLES.map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setFrameStyle(frame.id)}
                  className={`rounded-2xl p-1 ring-2 transition ${
                    frameStyle === frame.id ? "ring-sage" : "ring-transparent"
                  }`}
                >
                  <div
                    className="h-10 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${frame.colors[0]}, ${frame.colors[1]})`,
                    }}
                  />
                  <p className="mt-1 text-center text-[11px] font-medium text-brown-light">
                    {frame.label}
                  </p>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="이름">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="견종">
              <input
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="인사말">
            <textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="안녕! 나는 체리야. 같이 다닐 준비 됐어?"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="체중 (kg)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="활동량">
              <div className="grid grid-cols-3 gap-1.5">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setActivityLevel(opt.value)}
                    className={`rounded-xl py-2 text-xs font-semibold transition ${
                      activityLevel === opt.value
                        ? "bg-sage text-white"
                        : "bg-cream text-brown-light"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="특징 (쉼표로 구분)">
            <input
              value={traitsInput}
              onChange={(e) => setTraitsInput(e.target.value)}
              placeholder="사람 좋아함, 더위 취약"
              className={inputClass}
            />
          </Field>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              "지갑에 저장하기"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

const inputClass =
  "w-full rounded-2xl border border-sage/15 bg-cream/50 px-4 py-3 text-sm text-brown outline-none transition focus:border-sage/40 focus:bg-white focus:ring-2 focus:ring-sage/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brown">{label}</label>
      {children}
    </div>
  );
}
