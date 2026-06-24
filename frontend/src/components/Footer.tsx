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

          <div className="flex gap-6 text-sm text-brown-light">
            <a href="#features" className="hover:text-sage transition-colors">
              기능
            </a>
            <a href="#sensory-map" className="hover:text-sage transition-colors">
              감각 지도
            </a>
            <a href="#flow" className="hover:text-sage transition-colors">
              이용 방법
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
