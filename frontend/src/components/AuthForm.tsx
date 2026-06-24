"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister ? { email, password, name } : { email, password };

      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (register: boolean) => {
    setIsRegister(register);
    setError("");
    router.replace(register ? "/register" : "/login", { scroll: false });
  };

  return (
    <div className="min-h-screen paw-pattern flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-brown-light hover:text-sage transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sage flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sage/30">
            <PawPrint className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-brown">발자국</h1>
          <p className="text-brown-light text-sm mt-1">
            {isRegister ? "계정을 만들고 여행을 시작하세요" : "다시 오신 것을 환영해요"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-brown/5 p-8">
          <div className="flex rounded-xl bg-cream p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                !isRegister ? "bg-white text-sage shadow-sm" : "text-brown-light"
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                isRegister ? "bg-white text-sage shadow-sm" : "text-brown-light"
              }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="보호자 이름"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown/10 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown/10 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown/10 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? "처리 중..." : isRegister ? "회원가입" : "로그인"}
            </button>
          </form>

          <p className="text-center text-sm text-brown-light mt-5">
            {isRegister ? (
              <>
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-sage font-medium hover:underline">
                  로그인
                </Link>
              </>
            ) : (
              <>
                아직 계정이 없으신가요?{" "}
                <Link href="/register" className="text-sage font-medium hover:underline">
                  회원가입
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
