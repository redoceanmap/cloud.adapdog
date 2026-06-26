import { Brain, Loader2, Scale, Sparkles } from 'lucide-react';
import type { AiAnalysisResult } from '@/types';

interface AiAnalysisPanelProps {
  result: AiAnalysisResult;
}

export function AiAnalysisPanel({ result }: AiAnalysisPanelProps) {
  if (result.status === 'idle') {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-center gap-2 text-emerald-700">
          <Sparkles size={18} />
          <h3 className="font-bold">AI 분석 결과</h3>
        </div>
        <p className="mt-2 text-sm text-emerald-800/70">
          사진을 업로드하면 AI가 견종과 예상 체중을 분석해 드립니다.
        </p>
      </div>
    );
  }

  if (result.status === 'analyzing') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Loader2 size={20} className="animate-spin" />
          </div>
          <div>
            <p className="font-bold text-emerald-800">AI 분석 중...</p>
            <p className="text-sm text-emerald-700/70">견종과 체중을 추정하고 있어요</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <p className="font-semibold text-rose-800">분석에 실패했습니다</p>
        <p className="mt-1 text-sm text-rose-700">{result.message ?? '다시 시도해 주세요.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <Brain size={16} />
        </div>
        <h3 className="font-bold text-emerald-900">AI 분석 결과</h3>
        <span className="ml-auto rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
          신뢰도 {Math.round(result.confidence * 100)}%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface/80 p-3 backdrop-blur">
          <p className="text-xs font-medium text-emerald-700">예상 견종</p>
          <p className="mt-1 text-lg font-bold text-emerald-900">{result.breed}</p>
        </div>
        <div className="rounded-xl bg-surface/80 p-3 backdrop-blur">
          <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
            <Scale size={12} />
            예상 체중
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-900">{result.weightKg} kg</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1 text-xs text-emerald-700/80">
        <Sparkles size={12} />
        결과는 참고용이며, 직접 수정할 수 있어요
      </p>
    </div>
  );
}
