import { LogIn, PawPrint, UserPlus } from 'lucide-react';

interface HomeLoginGateProps {
  onGoToLogin: () => void;
}

/** 로그인 전 홈 탭 — 반려견 지갑 이용 안내 */
export function HomeLoginGate({ onGoToLogin }: HomeLoginGateProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-lg flex-col px-5 pb-28 pt-8">
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-brand-600">
          <PawPrint size={22} />
          <span className="text-sm font-semibold">발자국</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          반려견 지갑
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          로그인하면 등록한 반려견 정보를 한눈에 볼 수 있어요
        </p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full rounded-3xl bg-surface p-8 text-center shadow-sm ring-1 ring-line">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-orange-100 text-brand-600">
            <PawPrint size={36} />
          </div>
          <h2 className="text-lg font-bold text-ink">로그인이 필요해요</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            로그인 후 반려견 지갑에서
            <br />
            오늘 함께할 친구를 선택해 보세요.
          </p>
          <button
            type="button"
            onClick={onGoToLogin}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
          >
            <LogIn size={18} />
            로그인 / 회원가입
          </button>
          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-muted">
            <UserPlus size={12} />
            프로필 탭에서 계정을 만들 수 있어요
          </p>
        </div>
      </section>
    </div>
  );
}
