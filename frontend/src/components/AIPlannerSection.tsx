"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";import {
  Bell,
  ChevronRight,
  Coffee,
  MapPin,
  Mic,
  Moon,
  MoreHorizontal,
  PawPrint,
  Plus,
  Send,
  Share2,
  Sparkles,
  Star,
  Sun,
  TreePine,
  User,
  X,
} from "lucide-react";

const PLANNER_BLUE = "#3B5BFE";
const PLANNER_BLUE_DARK = "#2E4FD4";

const QUICK_CHIPS = ["축제 넣어줘", "맛집 추가", "자차로 바꿔", "여행 시작"];

const DETAIL_TABS = ["개요", "입장 정책", "위치", "리뷰"];

const FACILITIES = [
  { icon: Sun, label: "테라스 동반석", sub: "대형견 가능" },
  { icon: Coffee, label: "펫 음료", sub: "강아지 메뉴" },
  { icon: TreePine, label: "그늘 좌석", sub: "더위 케어" },
];

function CocoAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
      style={{ background: PLANNER_BLUE }}
    >
      코
    </div>
  );
}

export default function AIPlannerSection() {
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  const [showCourseCard, setShowCourseCard] = useState(false);
  const [activeTab, setActiveTab] = useState("개요");

  useEffect(() => {
    setVisibleMsgs(0);
    setShowCourseCard(false);
    const timers = [
      setTimeout(() => setVisibleMsgs(1), 500),
      setTimeout(() => setVisibleMsgs(2), 1800),
      setTimeout(() => setShowCourseCard(true), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="ai-planner" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ color: PLANNER_BLUE, background: `${PLANNER_BLUE}14` }}
          >
            AI 여행 플래너
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mb-4">
            채팅 · 상세 · 지도가
            <br />
            <span className="gradient-text">한 화면에서 연결</span>
          </h2>
          <p className="text-brown-light max-w-xl mx-auto leading-relaxed">
            앱과 동일한 화면에서 코코와 대화하고, 장소 상세와 경로를 바로 확인하세요.
            <br />
            <Link href="/login?next=/planner" className="text-sage font-medium hover:underline">
              로그인하면 내가 저장한 코스를 웹에서 볼 수 있어요
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
        >
          {/* App top bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: PLANNER_BLUE }}
                >
                  <PawPrint className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 hidden sm:inline">발자국</span>
              </div>
              <nav className="hidden md:flex items-center gap-4 text-[13px]">
                <span className="font-semibold pb-1 border-b-2" style={{ color: PLANNER_BLUE, borderColor: PLANNER_BLUE }}>
                  AI 플래너
                </span>
                {["둘러보기", "여정", "내 강아지"].map((item) => (
                  <span key={item} className="text-gray-400">{item}</span>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" className="p-2 rounded-lg text-gray-400 hover:bg-gray-50">
                <Moon className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-400 rounded-full" />
              </button>
              <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-gray-100">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-[13px] font-medium text-gray-700 hidden sm:inline">김민주</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,3.5fr)_minmax(0,2.8fr)] lg:min-h-[600px] xl:min-h-[640px] bg-[#f8f9fb]">
            {/* Left — Chat */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-white min-w-0">
              <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: PLANNER_BLUE }} />
                  <span className="text-[13px] font-bold text-gray-800">발자국 AI 1.0</span>
                  <ChevronRight className="w-3 h-3 text-gray-300 rotate-90" />
                </div>
                <div className="flex items-center gap-0.5 text-gray-400">
                  <button type="button" className="p-1 hover:bg-gray-50 rounded"><Plus className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-50 rounded"><Share2 className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-50 rounded"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto max-h-[420px] lg:max-h-none">
                <AnimatePresence initial={false}>
                  {visibleMsgs >= 1 ? (
                    <motion.div
                      key="chat-user"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div
                        className="max-w-[88%] text-white text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tr-md leading-relaxed"
                        style={{ background: PLANNER_BLUE }}
                      >
                        체리랑 전주 1박 여행 코스 짜줘 🐶
                      </div>
                    </motion.div>
                  ) : null}
                  {visibleMsgs >= 2 ? (
                    <motion.div
                      key="chat-ai"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2"
                    >
                      <CocoAvatar />
                      <div className="max-w-[90%] bg-gray-50 border border-gray-100 text-gray-700 text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tl-md leading-[1.65]">
                        김민주 님, 골든리트리버 <strong className="text-gray-900">체리</strong>
                        (대형견 · 더위 취약) 프로필을 반영해 전주 1박 코스를 짰어요.
                        <br />
                        KTX 전주역 이동 기준이며, 각 장소{" "}
                        <strong className="text-gray-900">입장 가능 여부 · 그늘 · 이동약자 배려</strong>
                        를 확인했습니다.
                      </div>
                    </motion.div>
                  ) : null}
                  {showCourseCard ? (
                    <motion.div
                      key="chat-course"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-9"
                    >
                      <button
                        type="button"
                        className="w-full text-left bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PLANNER_BLUE }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-gray-800">전주 1박 펫 동반 코스</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">4곳 · 입장 상태 확인됨 · 출처 확인됨</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0" />
                        </div>
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="p-3 border-t border-gray-100 bg-white space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                  <input
                    readOnly
                    placeholder="무엇이든 물어보세요..."
                    className="flex-1 text-[12px] bg-transparent text-gray-500 outline-none placeholder:text-gray-400"
                  />
                  <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: PLANNER_BLUE }}
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Center — Place detail */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-white min-w-0">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-gray-500">Day 1 · 11:00</span>
                <button type="button" className="p-1 rounded-lg hover:bg-gray-50 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="relative aspect-[5/3] max-h-36 sm:max-h-40 bg-orange-50 overflow-hidden">
                  <img
                    src="/images/vlog/jeonju-hanok-cafe.jpg"
                    alt="한옥마을 펫카페"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2.5">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">한옥마을 펫카페</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[12px] text-gray-500">
                      <span className="flex items-center gap-0.5 font-semibold text-orange-500">
                        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                        4.7
                      </span>
                      <span>12,000원~</span>
                      <span className="text-brand font-medium">영업 중 ~ 21:00</span>
                      <span>전주시 완산구 한옥마을</span>
                    </div>
                  </div>

                  <div className="flex gap-1 border-b border-gray-100">
                    {DETAIL_TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`text-[11px] font-medium pb-2 px-2 -mb-px transition-colors ${
                          activeTab === tab
                            ? "text-blue-600 border-b-2 border-blue-500"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="bg-brand-soft border border-brand/25 text-brand text-[11px] font-medium px-3 py-2 rounded-lg leading-relaxed">
                    체리 입장 가능 · 대형견 가능 · 목줄 필수 · 실내 동반
                  </div>

                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    대형견 입장 가능 + 실내 에어컨으로 더위 취약한 체리도 시원하게
                    머물 수 있어요. 한옥 테라스에서 사진 찍기도 좋아요.
                  </p>

                  <div>
                    <div className="text-[12px] font-semibold text-gray-700 mb-2">함께 가기 좋은 곳</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FACILITIES.map(({ icon: Icon, label, sub }) => (
                        <div
                          key={label}
                          className="bg-gray-50 rounded-xl p-2 border border-gray-100 text-center"
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: PLANNER_BLUE }} />
                          <div className="text-[10px] font-semibold text-gray-800 leading-tight">{label}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5">{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full text-white font-semibold text-[13px] py-3 rounded-xl transition-colors shadow-sm"
                  style={{ background: PLANNER_BLUE }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = PLANNER_BLUE_DARK; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = PLANNER_BLUE; }}
                >
                  이 장소 코스에 담기
                </button>
              </div>
            </div>

            {/* Right — Map */}
            <div className="relative bg-[#eef1f5] min-h-[300px] lg:min-h-0 lg:min-w-[240px]">
              <div className="absolute top-3 left-3 right-3 z-10">
                <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 text-[11px] font-semibold text-gray-700 leading-snug">
                  서울 → 전주 · KTX
                  <span className="block sm:inline font-normal text-gray-400 sm:ml-1">(약 1시간 40분)</span>
                </div>
              </div>

              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 300 520"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <pattern id="planner-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dde3ea" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="300" height="520" fill="url(#planner-grid)" />
                <path
                  d="M70 440 C110 340, 130 300, 150 260 S190 180, 220 120"
                  stroke={PLANNER_BLUE}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="7 5"
                  strokeLinecap="round"
                />
                {[
                  { x: 70, y: 440, emoji: "🏠", label: "서울" },
                  { x: 150, y: 260, emoji: "☕", label: "카페", active: true },
                  { x: 185, y: 195, emoji: "🐾", label: "산책" },
                  { x: 220, y: 120, emoji: "🏯", label: "전주" },
                ].map((pt) => (
                  <g key={pt.label}>
                    {pt.active && (
                      <circle cx={pt.x} cy={pt.y} r="22" fill={`${PLANNER_BLUE}25`}>
                        <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.active ? 16 : 13}
                      fill={pt.active ? PLANNER_BLUE : "white"}
                      stroke={PLANNER_BLUE}
                      strokeWidth="2"
                    />
                    <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="11">
                      {pt.emoji}
                    </text>
                    <text x={pt.x} y={pt.y + 26} textAnchor="middle" fontSize="9" fill="#6b7280">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>

              <button
                type="button"
                className="absolute bottom-4 right-3 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-2 rounded-full shadow-lg shadow-red-500/25 z-10 transition-colors"
              >
                <span className="text-sm leading-none">✱</span>
                응급
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
