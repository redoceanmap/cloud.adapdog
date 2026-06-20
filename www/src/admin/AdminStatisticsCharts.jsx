import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const USER_GROWTH = [
  { month: '1월', subscribers: 420, dau: 180 },
  { month: '2월', subscribers: 510, dau: 215 },
  { month: '3월', subscribers: 640, dau: 268 },
  { month: '4월', subscribers: 780, dau: 312 },
  { month: '5월', subscribers: 920, dau: 355 },
  { month: '6월', subscribers: 1080, dau: 402 },
];

const SEARCH_KEYWORDS = [
  { keyword: '강릉', count: 1240 },
  { keyword: '애견카페', count: 980 },
  { keyword: '제주', count: 870 },
  { keyword: '한옥마을', count: 640 },
  { keyword: '해변', count: 520 },
];

const BOOKMARK_RANKING = [
  { name: '강릉 바다 산책 코스', bookmarks: 342 },
  { name: '제주 동쪽 힐링 루트', bookmarks: 298 },
  { name: '경주 역사 탐방', bookmarks: 241 },
  { name: '남해 드라이브', bookmarks: 198 },
  { name: '가평 계곡 피크닉', bookmarks: 176 },
];

const PET_SIZE_SHARE = [
  { name: '소형', value: 48, color: '#3b82f6' },
  { name: '중형', value: 35, color: '#6366f1' },
  { name: '대형', value: 17, color: '#94a3b8' },
];

const tooltipStyle = {
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
};

export function AdminStatisticsCharts() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: '총 가입자', value: '1,080', delta: '+14.2%' },
          { label: '일일 활성(DAU)', value: '402', delta: '+13.1%' },
          { label: '등록 반려견', value: '1,456', delta: '+9.8%' },
          { label: '이번 달 코스 저장', value: '2,840', delta: '+18.4%' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">{card.delta} vs 지난달</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900">가입자 · DAU 추이</h3>
          <p className="mt-1 text-sm text-slate-500">최근 6개월 서비스 성장 지표</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="subscribersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dauFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  name="누적 가입자"
                  stroke="#2563eb"
                  fill="url(#subscribersFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="dau"
                  name="DAU"
                  stroke="#4f46e5"
                  fill="url(#dauFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">반려견 크기 분포</h3>
          <p className="mt-1 text-sm text-slate-500">등록 반려견 기준</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PET_SIZE_SHARE}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {PET_SIZE_SHARE.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, '비율']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">인기 검색 키워드</h3>
          <p className="mt-1 text-sm text-slate-500">이번 달 탐색 검색어 TOP 5</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEARCH_KEYWORDS} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="keyword"
                  width={72}
                  tick={{ fill: '#334155', fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name="검색 수" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">코스 저장 랭킹</h3>
          <p className="mt-1 text-sm text-slate-500">북마크가 많은 추천 코스</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BOOKMARK_RANKING} margin={{ top: 4, right: 8, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={56}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="bookmarks" name="저장 수" fill="#475569" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
