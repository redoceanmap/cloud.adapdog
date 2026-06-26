import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export const inputClass =
  'w-full rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:bg-surface focus:ring-2 focus:ring-brand-100';

export function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-line/50 hover:text-ink"
        aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        aria-pressed={visible}
      >
        {visible ? <Eye size={18} strokeWidth={2} /> : <EyeOff size={18} strokeWidth={2} />}
      </button>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p>;
}

export function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 disabled:bg-line"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          처리 중...
        </>
      ) : (
        label
      )}
    </button>
  );
}
