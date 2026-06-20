import { useRef } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';

interface ImageUploadProps {
  imageUrl: string | null;
  onImageSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUpload({ imageUrl, onImageSelect, onClear, disabled = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        aria-label="반려견 사진 업로드"
      />

      {imageUrl ? (
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50">
          <img src={imageUrl} alt="업로드된 반려견 사진" className="h-full w-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="사진 삭제"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-surface transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <ImagePlus size={32} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">사진 업로드</p>
            <p className="mt-1 text-xs text-slate-500">AI가 견종과 체중을 분석해요</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white">
            <Camera size={14} />
            갤러리에서 선택
          </span>
        </button>
      )}
    </div>
  );
}
