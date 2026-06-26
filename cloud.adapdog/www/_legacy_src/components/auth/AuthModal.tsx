import { useCallback, useEffect, useState } from 'react';
import { LogIn, PawPrint, UserPlus, X } from 'lucide-react';
import { signup as signupApi, login as loginApi } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import type { AuthUser, LoginPayload, SignupPayload } from '@/types/auth';
import {
  ErrorMessage,
  Field,
  inputClass,
  PasswordInput,
  SubmitButton,
} from './authFields';
import { PasswordResetModal } from './PasswordResetModal';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [resetOpen, setResetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginPayload>({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupPayload>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError(null);
    setResetOpen(false);
  }, [isOpen, initialMode]);

  const resetAndClose = useCallback(() => {
    setError(null);
    setLoading(false);
    setResetOpen(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  if (resetOpen) {
    return (
      <PasswordResetModal
        isOpen
        initialEmail={loginForm.email}
        onClose={() => setResetOpen(false)}
        onBackToLogin={() => setResetOpen(false)}
      />
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await loginApi(loginForm);
      onSuccess(user);
      resetAndClose();
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        setError(
          '이메일 또는 비밀번호가 올바르지 않습니다. 처음이시면 회원가입 탭에서 계정을 먼저 만들어 주세요.',
        );
      } else {
        setError(err instanceof ApiClientError ? err.message : '로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (signupForm.password !== signupForm.passwordConfirm) {
        throw new ApiClientError('비밀번호가 일치하지 않습니다.');
      }
      const { user } = await signupApi(signupForm);
      onSuccess(user);
      resetAndClose();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={resetAndClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 animate-slide-up rounded-3xl bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <PawPrint size={20} />
            <span id="auth-modal-title" className="font-bold text-ink">
              {mode === 'login' ? '로그인' : '회원가입'}
            </span>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line/60"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-5 flex rounded-full bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-surface text-brand-700 shadow-sm' : 'text-ink-muted'
            }`}
          >
            <LogIn size={15} />
            로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-surface text-brand-700 shadow-sm' : 'text-ink-muted'
            }`}
          >
            <UserPlus size={15} />
            회원가입
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-xs leading-relaxed text-brand-800">
              아직 가입하지 않으셨다면{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-semibold underline underline-offset-2"
              >
                회원가입
              </button>
              을 먼저 진행해 주세요.
            </p>
            <Field label="이메일" id="login-email">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="hello@example.com"
                className={inputClass}
              />
            </Field>
            <Field label="비밀번호" id="login-password">
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(password) => setLoginForm({ ...loginForm, password })}
                placeholder="비밀번호 입력"
              />
            </Field>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setResetOpen(true);
                }}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
            {error && <ErrorMessage message={error} />}
            <SubmitButton loading={loading} label="로그인하기" />
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <Field label="이름" id="signup-name">
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="보호자 이름"
                className={inputClass}
              />
            </Field>
            <Field label="이메일" id="signup-email">
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="hello@example.com"
                className={inputClass}
              />
            </Field>
            <Field label="비밀번호" id="signup-password">
              <PasswordInput
                id="signup-password"
                autoComplete="new-password"
                minLength={6}
                value={signupForm.password}
                onChange={(password) => setSignupForm({ ...signupForm, password })}
                placeholder="6자 이상"
              />
            </Field>
            <Field label="비밀번호 확인" id="signup-password-confirm">
              <PasswordInput
                id="signup-password-confirm"
                autoComplete="new-password"
                value={signupForm.passwordConfirm}
                onChange={(password) =>
                  setSignupForm({ ...signupForm, passwordConfirm: password })
                }
                placeholder="비밀번호 재입력"
              />
            </Field>
            {error && <ErrorMessage message={error} />}
            <SubmitButton loading={loading} label="가입하기" />
          </form>
        )}

        <p className="mt-4 text-center text-xs text-ink-muted">
          {mode === 'login' ? (
            <>
              계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-brand-600 hover:underline"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-brand-600 hover:underline"
              >
                로그인
              </button>
            </>
          )}
        </p>
      </div>
    </>
  );
}
