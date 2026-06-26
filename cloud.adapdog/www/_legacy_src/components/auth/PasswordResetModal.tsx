import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, PawPrint, X } from 'lucide-react';
import { requestPasswordReset } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import { ErrorMessage, Field, inputClass, SubmitButton } from './authFields';

interface PasswordResetModalProps {
  isOpen: boolean;
  initialEmail?: string;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function PasswordResetModal({
  isOpen,
  initialEmail = '',
  onClose,
  onBackToLogin,
}: PasswordResetModalProps) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail);

  const resetForm = useCallback(() => {
    setDone(false);
    setError(null);
    setLoading(false);
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (!isOpen) return;
    setEmail(initialEmail);
    setDone(false);
    setError(null);
  }, [isOpen, initialEmail]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email.trim());
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : '재설정 링크 전송에 실패했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-sm -translate-y-1/2 overflow-y-auto animate-slide-up rounded-3xl bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-reset-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <KeyRound size={20} />
            <span id="password-reset-title" className="font-bold text-ink">
              비밀번호 재설정
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line/60"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {!done ? (
          <>
            <p className="mb-5 text-sm leading-relaxed text-ink-muted">
              가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요. 링크를 누르면 새
              비밀번호를 설정할 수 있어요.
            </p>
            <form onSubmit={handleRequest} className="space-y-4">
              <Field label="이메일" id="reset-email">
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className={inputClass}
                />
              </Field>
              {error && <ErrorMessage message={error} />}
              <SubmitButton loading={loading} label="재설정 링크 받기" />
            </form>
            <button
              type="button"
              onClick={() => {
                handleClose();
                onBackToLogin();
              }}
              className="mt-4 flex w-full items-center justify-center gap-1 text-xs font-semibold text-ink-muted hover:text-brand-600"
            >
              <ArrowLeft size={14} />
              로그인으로 돌아가기
            </button>
          </>
        ) : (
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-ink">메일을 보냈어요</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              <span className="inline-flex items-center gap-1 font-medium text-ink">
                <Mail size={14} />
                {email}
              </span>
              <br />
              로 재설정 링크를 보냈어요. 메일함을 열어 링크를 눌러 주세요.
            </p>
            <button
              type="button"
              onClick={() => {
                handleClose();
                onBackToLogin();
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
            >
              <PawPrint size={16} />
              로그인으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
