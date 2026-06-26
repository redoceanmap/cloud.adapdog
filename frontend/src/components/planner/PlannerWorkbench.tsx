"use client";

import { useMemo, useState } from "react";
import {
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
} from "lucide-react";
import type { Pet, PlannerCourse } from "@/lib/planner-api";
import {
  categoryLabel,
  pathFromMapPoints,
  sizeLabel,
  stopsToMapPoints,
} from "@/lib/planner-api";

const PLANNER_BLUE = "#3B5BFE";
const PLANNER_BLUE_DARK = "#2E4FD4";
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

interface PlannerWorkbenchProps {
  course: PlannerCourse;
  pet: Pet;
  userName: string;
}

export default function PlannerWorkbench({
  course,
  pet,
  userName,
}: PlannerWorkbenchProps) {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("개요");

  const stops = useMemo(
    () => [...course.stops].sort((a, b) => a.order - b.order),
    [course.stops],
  );
  const activeStop = stops[activeStopIndex] ?? stops[0];
  const mapPoints = useMemo(() => stopsToMapPoints(stops), [stops]);
  const routePath = useMemo(() => pathFromMapPoints(mapPoints), [mapPoints]);
  const traitsText = pet.traits.length > 0 ? pet.traits.join(" · ") : pet.temperament;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
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
            <span
              className="font-semibold pb-1 border-b-2"
              style={{ color: PLANNER_BLUE, borderColor: PLANNER_BLUE }}
            >
              AI 플래너
            </span>
            {["둘러보기", "여정", "내 강아지"].map((item) => (
              <span key={item} className="text-gray-400">
                {item}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="p-2 rounded-lg text-gray-400 hover:bg-gray-50">
            <Moon className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 relative">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-[13px] font-medium text-gray-700 hidden sm:inline">
              {userName}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,3.5fr)_minmax(0,2.8fr)] lg:min-h-[600px] xl:min-h-[640px] bg-[#f8f9fb]">
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-white min-w-0">
          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: PLANNER_BLUE }} />
              <span className="text-[13px] font-bold text-gray-800">발자국 AI 1.0</span>
              <ChevronRight className="w-3 h-3 text-gray-300 rotate-90" />
            </div>
            <div className="flex items-center gap-0.5 text-gray-400">
              <button type="button" className="p-1 hover:bg-gray-50 rounded">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-gray-50 rounded">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-gray-50 rounded">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto max-h-[420px] lg:max-h-none">
            <div className="flex justify-end">
              <div
                className="max-w-[88%] text-white text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tr-md leading-relaxed"
                style={{ background: PLANNER_BLUE }}
              >
                {course.prompt_text || `${pet.name}랑 ${course.region} 여행 코스 보여줘`}
              </div>
            </div>

            <div className="flex gap-2">
              <CocoAvatar />
              <div className="max-w-[90%] bg-gray-50 border border-gray-100 text-gray-700 text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tl-md leading-[1.65]">
                {userName} 님, <strong className="text-gray-900">{pet.breed}</strong>{" "}
                <strong className="text-gray-900">{pet.name}</strong>
                ({sizeLabel(pet.size)}
                {traitsText ? ` · ${traitsText}` : ""}) 프로필을 반영해 {course.region} 코스를
                불러왔어요.
                <br />
                각 장소 <strong className="text-gray-900">입장 가능 여부 · 그늘 · 이동약자 배려</strong>
                를 확인했습니다.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveStopIndex(0)}
              className="w-full text-left bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all group ml-9"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PLANNER_BLUE }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-gray-800">{course.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {stops.length}곳 · {course.is_saved ? "저장된 코스" : "추천 코스"} ·{" "}
                    {course.created_at}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0" />
              </div>
            </button>

            <div className="ml-9 space-y-1.5">
              {stops.map((stop, index) => (
                <button
                  key={`${stop.order}-${stop.name}`}
                  type="button"
                  onClick={() => setActiveStopIndex(index)}
                  className={`w-full text-left text-[12px] px-3 py-2 rounded-lg border transition-colors ${
                    activeStopIndex === index
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-100"
                  }`}
                >
                  {stop.order}. {stop.name}
                  <span className="text-gray-400 ml-1">· {categoryLabel(stop.category)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 opacity-60">
              <input
                readOnly
                placeholder="앱에서 대화를 이어가세요..."
                className="flex-1 text-[12px] bg-transparent text-gray-500 outline-none placeholder:text-gray-400"
              />
              <Mic className="w-4 h-4 text-gray-400" />
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: PLANNER_BLUE }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-white min-w-0">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-500">
              {course.region} · {activeStop?.order ?? 1}번째 장소
            </span>
            <span className="text-[11px] text-gray-400">{categoryLabel(activeStop?.category ?? "")}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="relative aspect-[5/3] max-h-36 sm:max-h-40 bg-orange-50 overflow-hidden">
              <img
                src="/images/vlog/jeonju-hanok-cafe.jpg"
                alt={activeStop?.name ?? "장소"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-4 py-3 space-y-2.5">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeStop?.name}</h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[12px] text-gray-500">
                  <span className="flex items-center gap-0.5 font-semibold text-orange-500">
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    4.7
                  </span>
                  <span className="text-brand font-medium">입장 가능 확인됨</span>
                  <span>{course.region}</span>
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
                {pet.name} 입장 가능 · {sizeLabel(pet.size)} · 목줄 필수 · 실내/야외 동반
              </div>

              <p className="text-[13px] text-gray-600 leading-relaxed">
                {activeTab === "개요" &&
                  (course.summary ||
                    `${pet.name}와 함께 방문하기 좋은 ${categoryLabel(activeStop?.category ?? "")}입니다. 코스 ${activeStop?.order}번째 장소예요.`)}
                {activeTab === "입장 정책" &&
                  `${sizeLabel(pet.size)} 동반 입장이 가능한 것으로 확인됐어요. 현장 규정은 변동될 수 있으니 방문 전 한 번 더 확인해 주세요.`}
                {activeTab === "위치" &&
                  `위도 ${activeStop?.latitude.toFixed(4)}, 경도 ${activeStop?.longitude.toFixed(4)} · ${course.region} 일대`}
                {activeTab === "리뷰" &&
                  "보호자 후기는 앱에서 더 자세히 볼 수 있어요."}
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
        </div>

        <div className="relative bg-[#eef1f5] min-h-[300px] lg:min-h-0 lg:min-w-[240px]">
          <div className="absolute top-3 left-3 right-3 z-10">
            <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 text-[11px] font-semibold text-gray-700 leading-snug">
              {course.title}
              <span className="block sm:inline font-normal text-gray-400 sm:ml-1">
                {stops.length}곳 · 총 {course.region} 동선
              </span>
            </div>
          </div>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 520"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="my-planner-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dde3ea" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="300" height="520" fill="url(#my-planner-grid)" />
            {routePath && (
              <path
                d={routePath}
                stroke={PLANNER_BLUE}
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="7 5"
                strokeLinecap="round"
              />
            )}
            {mapPoints.map((pt, index) => (
              <g
                key={`${pt.order}-${pt.name}`}
                onClick={() => setActiveStopIndex(index)}
                style={{ cursor: "pointer" }}
              >
                {activeStopIndex === index && (
                  <circle cx={pt.x} cy={pt.y} r="22" fill={`${PLANNER_BLUE}25`}>
                    <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={activeStopIndex === index ? 16 : 13}
                  fill={activeStopIndex === index ? PLANNER_BLUE : "white"}
                  stroke={PLANNER_BLUE}
                  strokeWidth="2"
                />
                <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="11">
                  {pt.emoji}
                </text>
                <text x={pt.x} y={pt.y + 26} textAnchor="middle" fontSize="8" fill="#6b7280">
                  {pt.order}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
