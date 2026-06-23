import {
  ArrowRight,
  Camera,
  Compass,
  Map,
  PawPrint,
  Route,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

const services = [
  {
    icon: Wallet,
    title: '반려견 지갑',
    description: '우리 아이 정보를 한곳에 모아, 오늘 함께할 친구를 선택해요.',
    color: 'bg-brand-100 text-brand-700',
  },
  {
    icon: Map,
    title: '장소 탐색',
    description: '반려견 동반 가능한 카페, 해변, 숙소를 지도에서 찾아요.',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    icon: Route,
    title: '코스 짜기',
    description: '1박 2일 여행 동선을 만들고, 장소별 입장 정책을 확인해요.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    icon: Camera,
    title: '여행 기록',
    description: '다녀온 코스와 사진을 남기고, 다른 보호자들의 기록도 둘러봐요.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: ShieldCheck,
    title: '펫티켓 · 이동약자 배려',
    description: '반려견 출입 규칙과 휠체어 접근 정보를 한눈에 확인해요.',
    color: 'bg-rose-100 text-rose-700',
  },
];

interface WelcomeIntroProps {
  onStart: () => void;
}

/** 앱 소개 및 서비스 안내 — 첫 방문 시 표시 */
export function WelcomeIntro({ onStart }: WelcomeIntroProps) {
  return (
    <div className="mx-auto min-h-[calc(100dvh-4.5rem)] max-w-lg px-5 pb-28 pt-8">
      {/* 헤더 */}
      <header className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg shadow-brand-500/25">
          <PawPrint size={32} />
        </div>
        <p className="text-sm font-semibold text-brand-600">발자국</p>
        <h1 className="mt-2 text-2xl font-bold leading-snug text-ink">
          반려견과 함께하는
          <br />
          여행 플랫폼
        </h1>
      </header>

      {/* 앱 소개 */}
      <section className="mb-6 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-line">
        <div className="flex items-start gap-3">
          <Compass size={20} className="mt-0.5 shrink-0 text-brand-500" />
          <div>
            <h2 className="font-bold text-ink">발자국은 이런 앱이에요</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              발자국은 반려견과 함께 떠나는 여행을 돕는 서비스예요. 우리 아이 성격과
              조건에 맞는 장소를 찾고, 안전한 동선을 짜고, 소중한 추억을 기록할 수
              있어요.
            </p>
          </div>
        </div>
      </section>

      {/* 제공 서비스 */}
      <section className="mb-8">
        <h2 className="mb-3 px-1 text-sm font-bold text-ink">이런 서비스를 이용할 수 있어요</h2>
        <div className="space-y-3">
          {services.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-line"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <button
        type="button"
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-[0.98]"
      >
        시작하기
        <ArrowRight size={18} />
      </button>
      <p className="mt-3 text-center text-xs text-ink-muted">
        시작하기를 누르면 프로필에서 로그인·회원가입을 할 수 있어요
      </p>
    </div>
  );
}
