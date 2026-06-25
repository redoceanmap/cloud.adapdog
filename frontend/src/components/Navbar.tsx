"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, Menu, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const navLinks = [
    { href: "#ai-planner", label: "AI 플래너" },
    { href: "#ai-voice", label: "음성·응급" },
    { href: "#scenarios", label: "시나리오" },
    { href: "#features", label: "차별점" },
    { href: "#download", label: "다운로드" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center shadow-md shadow-sage/25 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-brown">발자국</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brown-light hover:text-sage transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-brown-light">
                안녕하세요, <strong className="text-brown">{user.name}</strong>님
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-brown-light hover:text-sage transition-colors px-4 py-2"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-secondary text-sm px-4 py-2"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-5 py-2.5"
              >
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
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-brown-light"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-sage font-medium text-left">
              로그아웃
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="btn-secondary text-sm px-4 py-2 w-fit">
                로그인
              </Link>
              <Link href="/register" className="btn-primary text-sm px-5 py-2.5 w-fit">
                회원가입
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
