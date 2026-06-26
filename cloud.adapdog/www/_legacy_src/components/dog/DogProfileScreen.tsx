import { useCallback, useState } from 'react';
import { CheckCircle2, Dog, Loader2 } from 'lucide-react';
import { analyzeDogImage, saveDogProfile } from '@/api/dogs';
import { useMutation } from '@/hooks/useFetch';
import type { AiAnalysisResult, DogProfile } from '@/types';
import { AiAnalysisPanel } from './AiAnalysisPanel';
import { DogProfileForm, type DogProfileFormData } from './DogProfileForm';
import { ImageUpload } from './ImageUpload';

const initialAnalysis: AiAnalysisResult = {
  breed: '',
  weightKg: 0,
  confidence: 0,
  status: 'idle',
};

const initialForm: DogProfileFormData = {
  name: '',
  age: '',
  activityLevel: 'moderate',
  breed: '',
  weightKg: '',
};

/** 개발용 목업 AI 분석 — 백엔드 API 연동 전 사용 */
async function mockAnalyzeDogImage(file: File): Promise<AiAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockResults = [
    { breed: '골든 리트리버', weightKg: 28, confidence: 0.92 },
    { breed: '말티즈', weightKg: 3.5, confidence: 0.88 },
    { breed: '웰시 코기', weightKg: 12, confidence: 0.85 },
  ];

  const result = mockResults[file.name.length % mockResults.length];

  return {
    ...result,
    status: 'done',
  };
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

interface DogProfileScreenProps {
  onSaved?: (profile: DogProfile) => void;
}

export function DogProfileScreen({ onSaved }: DogProfileScreenProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AiAnalysisResult>(initialAnalysis);
  const [form, setForm] = useState<DogProfileFormData>(initialForm);
  const [saved, setSaved] = useState(false);

  const { mutate: save, loading: saving, error: saveError } = useMutation(saveDogProfile);

  const runAnalysis = useCallback(async (file: File) => {
    setAnalysis({ ...initialAnalysis, status: 'analyzing' });

    try {
      const result = USE_MOCK ? await mockAnalyzeDogImage(file) : await analyzeDogImage(file);
      setAnalysis(result);

      if (result.status === 'done') {
        setForm((prev) => ({
          ...prev,
          breed: result.breed,
          weightKg: String(result.weightKg),
        }));
      }
    } catch (err) {
      setAnalysis({
        ...initialAnalysis,
        status: 'error',
        message: err instanceof Error ? err.message : '분석에 실패했습니다.',
      });
    }
  }, []);

  const handleImageSelect = (file: File) => {
    setSaved(false);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    void runAnalysis(file);
  };

  const handleClear = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setSelectedFile(null);
    setAnalysis(initialAnalysis);
    setForm((prev) => ({ ...prev, breed: '', weightKg: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profile: DogProfile = {
      name: form.name,
      age: Number(form.age),
      activityLevel: form.activityLevel,
      breed: form.breed || undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      imageUrl: imageUrl ?? undefined,
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSaved(true);
      onSaved?.(profile);
      return;
    }

    const result = await save(profile);
    if (result) {
      setSaved(true);
      onSaved?.(result);
    }
  };

  const isAnalyzing = analysis.status === 'analyzing';
  const canSubmit = form.name.trim() && form.age && !isAnalyzing && !saving;

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-brand-600">
          <Dog size={24} />
          <h1 className="text-xl font-bold text-slate-900">반려견 프로필 등록</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">사진을 올리면 AI가 견종과 체중을 분석해 드려요</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload
          imageUrl={imageUrl}
          onImageSelect={handleImageSelect}
          onClear={handleClear}
          disabled={isAnalyzing || saving}
        />

        <AiAnalysisPanel result={analysis} />

        <div className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-800">기본 정보</h2>
          <DogProfileForm data={form} onChange={setForm} disabled={isAnalyzing || saving} />
        </div>

        {saveError && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{saveError}</p>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
            <CheckCircle2 size={18} />
            프로필이 저장되었습니다!
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              저장 중...
            </>
          ) : (
            '프로필 저장하기'
          )}
        </button>
      </form>

      {selectedFile && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {USE_MOCK ? '개발 모드: 목업 AI 분석 사용 중' : `선택된 파일: ${selectedFile.name}`}
        </p>
      )}
    </div>
  );
}
