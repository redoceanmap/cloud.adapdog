"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, PawPrint, X } from "lucide-react";
import { useAuthSession } from "@/lib/use-auth-session";
import { logout } from "@/lib/auth-api";

export default function Navbar() {
  const { user, ready } = useAuthSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const authed = ready && !!user;
  const emergencyHref = "/emergency";
  const plannerHref = authed ? "/planner" : "/login?next=/planner";
  const walletHref = authed ? "/wallet" : "/login?next=/wallet";
  const profileHref = authed ? "/profile" : "/login?next=/profile";

  const navLinks = [
    { href: walletHref, label: "강아지 지갑", isRoute: true },
    { href: plannerHref, label: "AI 플래너", isRoute: true },
    { href: emergencyHref, label: "음성·응급", isRoute: true },
    { href: "/#features", label: "차별점", isRoute: true },
    { href: "/#download", label: "다운로드", isRoute: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center shadow-md shadow-sage/25 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-brown">발자국</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brown-light hover:text-sage transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!ready ? (
            <span className="text-sm text-brown-light/70 px-2 py-2">확인 중…</span>
          ) : user ? (
            <>
              <Link
                href={profileHref}
                className="text-sm text-brown transition-colors hover:text-sage cursor-pointer rounded-lg px-2 py-1 hover:bg-sage/10"
              >
                <strong>{user.name}</strong>님
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-brown-light hover:text-sage transition-colors px-2 py-2 cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-brown-light hover:text-sage transition-colors px-2 py-2"
              >
                로그인
              </Link>
              <Link href="/register" className="btn-primary text-sm px-4 py-2">
                회원가입
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-brown"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/50 mt-3 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-brown-light"
            >
              {link.label}
            </Link>
          ))}
          {!ready ? (
            <span className="text-sm text-brown-light/70">확인 중…</span>
          ) : user ? (
            <>
              <Link
                href={profileHref}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-brown rounded-lg px-2 py-1.5 transition-all hover:bg-sage/10 hover:text-sage"
              >
                <strong>{user.name}</strong>님 · 내 프로필
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-sm text-sage font-medium text-left"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-brown-light"
              >
                로그인
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm px-4 py-2.5 text-center"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
