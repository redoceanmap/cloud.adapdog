"use client";

import { Sparkles } from "lucide-react";

export type PlannerFolderTabId = "planner" | "explore" | "itinerary" | "dog";

const TABS: { id: PlannerFolderTabId; label: string }[] = [
  { id: "planner", label: "AI 플래너" },
  { id: "explore", label: "둘러보기" },
  { id: "itinerary", label: "여정" },
  { id: "dog", label: "내 강아지" },
];

interface PlannerFolderTabsProps {
  active: PlannerFolderTabId;
  onChange: (id: PlannerFolderTabId) => void;
}

export default function PlannerFolderTabs({ active, onChange }: PlannerFolderTabsProps) {
  return (
    <nav className="pw-nav-tabs" role="tablist" aria-label="플래너 메뉴">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`pw-nav-pill ${isActive ? "pw-nav-pill--active" : ""}`}
          >
            {isActive && tab.id === "planner" && (
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export function PlannerTabPlaceholder({ tab }: { tab: Exclude<PlannerFolderTabId, "planner"> }) {
  const copy =
    tab === "explore"
      ? {
          title: "둘러보기",
          body: "축제·둘레길·문화시설을 골라 코스에 담을 수 있어요.\nAI 플래너 탭에서 대화를 이어가 보세요.",
        }
      : tab === "itinerary"
        ? {
            title: "여정",
            body: "출발·이동·도착과 코스 정류장을 타임라인으로 확인해요.\n코스가 만들어지면 여기에서 볼 수 있어요.",
          }
        : {
            title: "내 강아지",
            body: "강아지 지갑에서 프로필과 페르소나를 관리해요.",
          };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 py-16 text-center"
      style={{ background: "var(--pw-bg)" }}
    >
      <p className="text-lg font-bold" style={{ color: "var(--pw-text)" }}>
        {copy.title}
      </p>
      <p className="mt-3 max-w-sm whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--pw-muted)" }}>
        {copy.body}
      </p>
    </div>
  );
}
