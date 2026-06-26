"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Compass,
  Loader2,
  LogOut,
  Moon,
  Sun,
  Wallet,
} from "lucide-react";
import { useAppTheme } from "@/contexts/AppThemeContext";
import { useAuthSession } from "@/lib/use-auth-session";
import { logout } from "@/lib/auth-api";

function ThemeModePicker({
  dark,
  ready,
  onSelect,
}: {
  dark: boolean;
  ready: boolean;
  onSelect: (dark: boolean) => void;
}) {
  return (
    <div className="flex gap-2 p-1 rounded-xl bg-cream/80 dark:bg-[#17171b]">
      <button
        type="button"
        disabled={!ready}
        onClick={() => onSelect(false)}
        className={`profile-mode-btn flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${
          !dark ? "profile-mode-btn--active" : ""
        }`}
      >
        <Sun className="h-4 w-4" />
        라이트
      </button>
      <button
        type="button"
        disabled={!ready}
        onClick={() => onSelect(true)}
        className={`profile-mode-btn flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${
          dark ? "profile-mode-btn--active" : ""
        }`}
      >
        <Moon className="h-4 w-4" />
        다크
      </button>
    </div>
  );
}

export default function ProfileView() {
  const router = useRouter();
  const { dark, ready: themeReady, setDarkMode } = useAppTheme();
  const { user, ready: authReady } = useAuthSession();
  const loading = !authReady;

  useEffect(() => {
    if (authReady && !user) {
      router.replace("/login?next=/profile");
    }
  }, [authReady, user, router]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="profile-page flex min-h-[50vh] items-center justify-center gap-2 text-brown-light">
        <Loader2 className="h-5 w-5 animate-spin" />
        프로필을 불러오는 중...
      </div>
    );
  }

  if (!user) return null;

  const initial = user.name.trim().charAt(0) || "회";

  return (
    <div className="profile-page min-h-screen bg-cream pb-16 pt-24 paw-pattern">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-brown-light transition-all hover:text-sage hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>

        <h1 className="text-3xl font-extrabold text-brown md:text-4xl">내 프로필</h1>
        <p className="mt-2 text-sm text-brown-light">계정 정보와 화면 모드를 관리해요.</p>

        <section className="profile-card mt-8 overflow-hidden rounded-2xl border border-sage/15 bg-white shadow-sm">
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage text-xl font-bold text-white shadow-md shadow-sage/25">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-brown">{user.name}님</p>
              <p className="truncate text-sm text-brown-light">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-sage/10 border-t border-sage/10">
            <Link
              href="/wallet"
              className="profile-quick-link flex flex-col items-center gap-1.5 px-4 py-4 text-center"
            >
              <Wallet className="h-5 w-5 text-sage" />
              <span className="text-xs font-semibold text-brown">강아지 지갑</span>
            </Link>
            <Link
              href="/planner"
              className="profile-quick-link flex flex-col items-center gap-1.5 px-4 py-4 text-center"
            >
              <Compass className="h-5 w-5 text-sage" />
              <span className="text-xs font-semibold text-brown">AI 플래너</span>
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-brown-light">
            화면 모드
          </h2>
          <div className="profile-card rounded-2xl border border-sage/15 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs text-brown-light">홈·지갑·플래너 전체에 적용됩니다.</p>
            <ThemeModePicker dark={dark} ready={themeReady} onSelect={setDarkMode} />
          </div>
        </section>

        <section className="mt-6">
          <div className="profile-card overflow-hidden rounded-2xl border border-sage/15 bg-white shadow-sm">
            <button
              type="button"
              onClick={handleLogout}
              className="profile-danger-btn flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-red-600"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
