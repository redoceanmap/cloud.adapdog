import { PawPrint } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-brown/5 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-brown">발자국</span>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-brown-light justify-center">
            <a href="#ai-planner" className="hover:text-sage transition-colors">
              AI 플래너
            </a>
            <a href="#ai-voice" className="hover:text-sage transition-colors">
              음성·응급
            </a>
            <a href="#scenarios" className="hover:text-sage transition-colors">
              시나리오
            </a>
            <a href="#features" className="hover:text-sage transition-colors">
              차별점
            </a>
            <a href="#download" className="hover:text-sage transition-colors">
              다운로드
            </a>
            <Link href="/login" className="hover:text-sage transition-colors">
              로그인
            </Link>
            <Link href="/register" className="hover:text-sage transition-colors">
              회원가입
            </Link>
          </div>

          <p className="text-xs text-brown-light">
            © 2025 발자국. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
