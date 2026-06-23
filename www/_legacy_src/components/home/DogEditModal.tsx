import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, PawPrint, X } from 'lucide-react';
import type { ActivityLevel, RegisteredDog } from '@/types';
import { BreedSelect } from '@/components/shared/BreedSelect';
import { activityLabels } from './DogSelector';

const activityOptions: { value: ActivityLevel }[] = [
  { value: 'low' },
  { value: 'moderate' },
  { value: 'high' },
];

interface DogEditModalProps {
  dog: RegisteredDog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dog: RegisteredDog) => void;
}

export function DogEditModal({ dog, isOpen, onClose, onSave }: DogEditModalProps) {
  const [form, setForm] = useState<RegisteredDog | null>(null);
  const [traitsInput, setTraitsInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCreate = dog?.name === '';

  useEffect(() => {
    if (dog && isOpen) {
      setForm({ ...dog });
      setTraitsInput(dog.traits.join(', '));
      setPreviewUrl(dog.photoUrl);
    }
  }, [dog, isOpen]);

  if (!isOpen || !dog || !form) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      if (!url) return;
      setPreviewUrl(url);
      setForm((prev) => (prev ? { ...prev, photoUrl: url } : prev));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const updated: RegisteredDog = {
      ...form,
      name: form.name.trim() || '새 반려견',
      photoUrl: previewUrl,
      breed: form.breed.trim(),
      traits: traitsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSave(updated);
    setSaving(false);
    onClose();
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[85vh] max-w-sm -translate-y-1/2 overflow-y-auto rounded-3xl bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dog-edit-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <PawPrint size={20} className="text-brand-600" />
            <h2 id="dog-edit-title" className="font-bold text-ink">
              {isCreate ? '반려견 추가' : '반려견 정보 편집'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line/60"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="프로필 사진">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
              aria-label="프로필 사진 변경"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-brand-100">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`${form.name} 프로필`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-50 text-brand-400">
                    <Camera size={28} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition hover:opacity-100"
                  aria-label="사진 변경"
                >
                  <Camera size={22} />
                  <span className="mt-1 text-[10px] font-semibold">변경</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                <Camera size={14} />
                사진 변경하기
              </button>
            </div>
          </Field>

          <Field label="이름">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="견종">
            <BreedSelect
              value={form.breed}
              onChange={(breed) => setForm({ ...form, breed })}
              listId="edit-dog-breed-options"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="나이 (살)">
              <input
                type="number"
                min={0}
                max={30}
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="체중 (kg)">
              <input
                type="number"
                min={0}
                step={0.1}
                required
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="활동량">
            <div className="grid grid-cols-3 gap-2">
              {activityOptions.map(({ value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, activityLevel: value })}
                  className={`rounded-2xl py-2.5 text-xs font-semibold transition ${
                    form.activityLevel === value
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-muted text-ink-muted hover:bg-line/60'
                  }`}
                >
                  {activityLabels[value]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="특징 (쉼표로 구분)">
            <input
              type="text"
              value={traitsInput}
              onChange={(e) => setTraitsInput(e.target.value)}
              placeholder="활발함, 사교적, 물놀이 좋아함"
              className={inputClass}
            />
          </Field>

          <Field label="성격 한 줄">
            <textarea
              rows={2}
              value={form.personality}
              onChange={(e) => setForm({ ...form, personality: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 disabled:bg-line"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </button>
        </form>
      </div>
    </>
  );
}

const inputClass =
  'w-full rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:bg-surface focus:ring-2 focus:ring-brand-100';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      {children}
    </div>
  );
}
