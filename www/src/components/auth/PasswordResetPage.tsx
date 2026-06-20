import { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, PawPrint } from 'lucide-react';
import { resetPassword, verifyPasswordResetToken } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import {
  ErrorMessage,
  Field,
  PasswordInput,
  SubmitButton,
} from './authFields';

interface PasswordResetPageProps {
  token: string;
}

export function PasswordResetPage({ token }: PasswordResetPageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      setLoading(true);
      setError(null);
      try {
        const result = await verifyPasswordResetToken(token);
        if (!cancelled) {
          setMaskedEmail(result.email);
          setValid(result.valid);
        }
      } catch (err) {
        if (!cancelled) {
          setValid(false);
          setError(
            err instanceof ApiClientError
              ? err.message
              : '유효하지 않거나 만료된 재설정 링크입니다.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (password !== passwordConfirm) {
        throw new ApiClientError('비밀번호가 일치하지 않습니다.');
      }
      await resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-canvas px-5 py-10">
      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <PawPrint size={28} />
        </div>
        <h1 className="text-xl font-bold text-ink">비밀번호 재설정</h1>
        <p className="mt-2 text-sm text-ink-muted">발자국 계정 비밀번호를 새로 설정해요</p>
      </header>

      <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-ink-muted">
            <Loader2 size={28} className="animate-spin text-brand-500" />
            <p className="text-sm">재설정 링크를 확인하는 중...</p>
          </div>
        )}

        {!loading && !valid && !done && (
          <div className="py-4 text-center">
            <p className="text-sm font-semibold text-rose-700">링크를 사용할 수 없어요</p>
            <p className="mt-2 text-sm text-ink-muted">
              {error ?? '유효하지 않거나 만료된 링크입니다. 다시 재설정을 요청해 주세요.'}
            </p>
            <button
              type="button"
              onClick={goHome}
              className="mt-6 w-full rounded-full bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600"
            >
              앱으로 돌아가기
            </button>
          </div>
        )}

        {!loading && valid && !done && (
          <>
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-brand-50 px-4 py-3">
              <KeyRound size={18} className="mt-0.5 shrink-0 text-brand-600" />
              <p className="text-sm text-brand-900">
                <span className="font-semibold">{maskedEmail}</span> 계정의 새 비밀번호를
                입력해 주세요.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="새 비밀번호" id="page-reset-password">
                <PasswordInput
                  id="page-reset-password"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={setPassword}
                  placeholder="6자 이상"
                />
              </Field>
              <Field label="새 비밀번호 확인" id="page-reset-password-confirm">
                <PasswordInput
                  id="page-reset-password-confirm"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  placeholder="비밀번호 재입력"
                />
              </Field>
              {error && <ErrorMessage message={error} />}
              <SubmitButton loading={submitting} label="비밀번호 변경하기" />
            </form>
          </>
        )}

        {done && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-ink">변경 완료!</h2>
            <p className="mt-2 text-sm text-ink-muted">
              새 비밀번호로 로그인해 주세요.
            </p>
            <button
              type="button"
              onClick={goHome}
              className="mt-6 w-full rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-600"
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
