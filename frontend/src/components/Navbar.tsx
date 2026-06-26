"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, Menu, X } from "lucide-react";
import { loadAuthUser } from "@/lib/auth";
import { logout, verifyAuth } from "@/lib/auth-api";

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
    const stored = loadAuthUser();
    if (!stored) return;

    verifyAuth()
      .then((ok) => {
        if (ok) setUser(stored);
        else logout();
      })
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const plannerHref = user ? "/planner" : "/login?next=/planner";

  const navLinks = [
    { href: plannerHref, label: "AI 플래너", isRoute: true },
    { href: "#ai-voice", label: "음성·응급", isRoute: false },
    { href: "#features", label: "차별점", isRoute: false },
    { href: "#download", label: "다운로드", isRoute: false },
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
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-brown-light hover:text-sage transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-brown-light hover:text-sage transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && (
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
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-brown-light"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-brown-light"
              >
                {link.label}
              </a>
            ),
          )}
          {user && (
            <button onClick={handleLogout} className="text-sm text-sage font-medium text-left">
              로그아웃
            </button>
          )}
        </div>
      )}
    </header>
  );
}
