import { useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  Shield,
  Users,
  XCircle,
} from 'lucide-react';
import { AdminStatisticsCharts } from './AdminStatisticsCharts';

const MENU_ITEMS = [
  { id: 'users', label: '사용자 관리', icon: Users },
  { id: 'courses', label: '코스 검수', icon: ClipboardCheck },
  { id: 'stats', label: '통계', icon: BarChart3 },
  { id: 'notices', label: '공지사항', icon: Megaphone },
];

const MOCK_USERS = [
  {
    id: 1,
    email: 'mina.park@email.com',
    nickname: '민아',
    pets: 2,
    status: 'active',
    joinedAt: '2025-11-03',
  },
  {
    id: 2,
    email: 'dogdad.kim@email.com',
    nickname: '김멍뭉',
    pets: 1,
    status: 'active',
    joinedAt: '2025-12-18',
  },
  {
    id: 3,
    email: 'traveler.lee@email.com',
    nickname: '이산책',
    pets: 3,
    status: 'suspended',
    joinedAt: '2026-01-05',
  },
  {
    id: 4,
    email: 'coco.owner@email.com',
    nickname: '코코맘',
    pets: 1,
    status: 'active',
    joinedAt: '2026-02-22',
  },
  {
    id: 5,
    email: 'spam.user@email.com',
    nickname: '불량유저',
    pets: 0,
    status: 'pending_review',
    joinedAt: '2026-03-10',
  },
];

const MOCK_COURSES = [
  {
    id: 101,
    title: '강릉 해변 산책 코스',
    author: '민아',
    region: '강릉',
    submittedAt: '2026-03-12',
    status: 'pending',
    saves: 42,
  },
  {
    id: 102,
    title: '제주 애견 동반 카페 투어',
    author: '이산책',
    region: '제주',
    submittedAt: '2026-03-11',
    status: 'pending',
    saves: 18,
  },
  {
    id: 103,
    title: '경주 한옥마을 당일치기',
    author: '김멍뭉',
    region: '경주',
    submittedAt: '2026-03-09',
    status: 'approved',
    saves: 128,
  },
  {
    id: 104,
    title: '가짜 해변 맛집 루트',
    author: '불량유저',
    region: '부산',
    submittedAt: '2026-03-08',
    status: 'rejected',
    saves: 3,
  },
];

const POPULAR_DESTINATIONS = [
  { rank: 1, name: '강릉 경포대', visits: 2840 },
  { rank: 2, name: '제주 협재해수욕장', visits: 2510 },
  { rank: 3, name: '경주 황리단길', visits: 1980 },
  { rank: 4, name: '남해 독일마을', visits: 1620 },
  { rank: 5, name: '가평 자라섬', visits: 1410 },
];

const STATUS_BADGE = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  suspended: 'bg-amber-50 text-amber-700 ring-amber-200',
  pending_review: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const STATUS_LABEL = {
  active: '정상',
  suspended: '정지',
  pending_review: '검토 필요',
};

const COURSE_STATUS_BADGE = {
  pending: 'bg-blue-50 text-blue-700 ring-blue-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const COURSE_STATUS_LABEL = {
  pending: '검수 대기',
  approved: '승인',
  rejected: '반려',
};

function StatusBadge({ status, map, labelMap }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${map[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}

function UsersPanel() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesQuery =
        !query ||
        user.email.includes(query) ||
        user.nickname.includes(query);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">사용자 관리</h2>
        <p className="mt-1 text-sm text-slate-500">
          가입자·반려견 등록 현황을 확인하고 악성 이용자를 정지하거나 탈퇴 처리할 수 있습니다.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이메일 또는 닉네임 검색"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">전체 상태</option>
          <option value="active">정상</option>
          <option value="suspended">정지</option>
          <option value="pending_review">검토 필요</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">닉네임</th>
                <th className="px-4 py-3 font-medium">이메일</th>
                <th className="px-4 py-3 font-medium">반려견</th>
                <th className="px-4 py-3 font-medium">가입일</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">조치</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.nickname}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.pets}마리</td>
                  <td className="px-4 py-3 text-slate-600">{user.joinedAt}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} map={STATUS_BADGE} labelMap={STATUS_LABEL} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                      >
                        정지
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                      >
                        강제 탈퇴
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CoursesPanel() {
  const pendingCount = MOCK_COURSES.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">코스 검수</h2>
        <p className="mt-1 text-sm text-slate-500">
          사용자가 등록한 여행지·코스를 승인·반려·수정하고 인기 여행지 순위를 확인합니다.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">검수 대기</p>
          <p className="mt-1 text-2xl font-semibold text-blue-900">{pendingCount}건</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">이번 주 승인</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">12건</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">이번 주 반려</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">3건</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-medium text-slate-900">제출된 코스 목록</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">코스명</th>
                  <th className="px-4 py-3 font-medium">작성자</th>
                  <th className="px-4 py-3 font-medium">지역</th>
                  <th className="px-4 py-3 font-medium">상태</th>
                  <th className="px-4 py-3 font-medium">조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_COURSES.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
                    <td className="px-4 py-3 text-slate-600">{course.author}</td>
                    <td className="px-4 py-3 text-slate-600">{course.region}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={course.status}
                        map={COURSE_STATUS_BADGE}
                        labelMap={COURSE_STATUS_LABEL}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          승인
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          반려
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium text-slate-900">인기 여행지 실시간 순위</h3>
          <p className="mt-1 text-xs text-slate-500">최근 7일 조회 기준</p>
          <ol className="mt-4 space-y-3">
            {POPULAR_DESTINATIONS.map((dest) => (
              <li
                key={dest.rank}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {dest.rank}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{dest.name}</span>
                </div>
                <span className="text-xs text-slate-500">{dest.visits.toLocaleString()}회</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function NoticesPanel() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">공지사항</h2>
        <p className="mt-1 text-sm text-slate-500">
          앱 메인 공지, 푸시 알림, 긴급 점검 안내를 작성·발송합니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-slate-900">이벤트 · 메인 공지 작성</h3>
          </div>
          <form className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="공지 제목"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <textarea
              rows={4}
              placeholder="앱 메인 화면에 노출할 내용을 입력하세요."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600">
                노출 기간
                <input
                  type="date"
                  className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                />
              </label>
            </div>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              공지 등록
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-slate-900">전체 푸시 알림</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              폭염·한파 등 상황별로 모든 사용자에게 푸시를 발송합니다.
            </p>
            <textarea
              rows={3}
              placeholder="예: 오늘 한낮 기온이 33°C입니다. 산책 시 수분 섭취에 유의해 주세요."
              className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              푸시 발송
            </button>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-700" />
              <h3 className="font-medium text-amber-900">긴급 점검 공지</h3>
            </div>
            <p className="mt-2 text-sm text-amber-800/80">
              서비스 점검 시 앱 전체에 긴급 배너를 표시합니다.
            </p>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="점검 시간 (예: 6/20 02:00 ~ 04:00)"
                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                긴급 점검 공지 게시
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PanelContent({ activeMenu }) {
  switch (activeMenu) {
    case 'users':
      return <UsersPanel />;
    case 'courses':
      return <CoursesPanel />;
    case 'stats':
      return (
        <div className="space-y-5">
          <header>
            <h2 className="text-xl font-semibold text-slate-900">통계</h2>
            <p className="mt-1 text-sm text-slate-500">
              가입자 성장, 검색 키워드, 코스 저장 랭킹 등 서비스 지표를 확인합니다.
            </p>
          </header>
          <AdminStatisticsCharts />
        </div>
      );
    case 'notices':
      return <NoticesPanel />;
    default:
      return null;
  }
}

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('users');

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Pawprint
              </p>
              <h1 className="text-lg font-semibold">관리자 콘솔</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeMenu === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMenu(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <a
            href="/"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            앱으로 돌아가기
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <p className="text-sm text-slate-500">발자국 관리 시스템</p>
          <p className="text-xs text-slate-400">샘플 데이터 기반 UI · API 연동 전</p>
        </header>
        <div className="p-6">
          <PanelContent activeMenu={activeMenu} />
        </div>
      </main>
    </div>
  );
}
