"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Loader2,
  MapPin,
  Mic,
  Plus,
  Route,
  Satellite,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import MapStopStrip from "@/components/planner/MapStopStrip";
import NaverMap from "@/components/planner/NaverMap";
import PlaceDetailPanel from "@/components/planner/PlaceDetailPanel";
import PlannerExplore from "@/components/planner/PlannerExplore";
import PlannerFolderTabs, {
  PlannerTabPlaceholder,
  type PlannerFolderTabId,
} from "@/components/planner/PlannerFolderTabs";
import PlannerItinerary from "@/components/planner/PlannerItinerary";
import PlannerNotificationPopover from "@/components/planner/PlannerNotificationPopover";
import { usePlannerWorkbench } from "@/hooks/usePlannerWorkbench";
import { useAuthSession } from "@/lib/use-auth-session";
import type { Pet, PlannerCourse, TripPlan } from "@/lib/planner-api";
import {
  categoryLabel,
  pathFromMapPoints,
  saveItinerary,
  sizeLabel,
  stopsToMapPoints,
  updateItinerary,
} from "@/lib/planner-api";
import { fetchDrivingRoute } from "@/lib/routing";

const PLANNER_BLUE = "#3B5BFE";

function transportLabel(transport?: TripPlan["transport"]): string {
  switch (transport) {
    case "ktx":
      return "KTX";
    case "bus":
      return "버스";
    case "car":
      return "자차";
    default:
      return "미정";
  }
}

function userHandle(email: string): string {
  const local = email.split("@")[0]?.trim();
  return local ? `@${local}` : "";
}

function CocoAvatar() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ background: "var(--pw-accent)" }}
    >
      코
    </div>
  );
}

interface PlannerWorkbenchProps {
  pet: Pet;
  userName: string;
  userEmail?: string;
  initialCourse?: PlannerCourse | null;
  onCourseSaved?: (course: PlannerCourse) => void;
}

export default function PlannerWorkbench({
  pet,
  userName,
  userEmail = "",
  initialCourse,
  onCourseSaved,
}: PlannerWorkbenchProps) {
  const router = useRouter();
  const wb = usePlannerWorkbench(pet, initialCourse);
  const { user } = useAuthSession();
  const [activeTab, setActiveTab] = useState<PlannerFolderTabId>("planner");
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [persistedCourseId, setPersistedCourseId] = useState<number | null>(
    initialCourse?.id && initialCourse.id > 0 ? initialCourse.id : null,
  );
  const [savedRouteKey, setSavedRouteKey] = useState<string | null>(
    initialCourse ? "loaded" : null,
  );
  const [saveNotice, setSaveNotice] = useState("");

  const mapDestination = wb.region || wb.livePlan?.destination || null;
  const transport = transportLabel(wb.livePlan?.transport);
  const routeLabel = mapDestination
    ? `서울 → ${mapDestination} · ${transport}`
    : `목적지 미정 · ${transport}`;
  const displayName = user?.name ?? userName;
  const displayEmail = user?.email ?? userEmail;
  const handle = userHandle(displayEmail);
  const profileInitial = displayName.trim().charAt(0) || "회";

  const stops = useMemo(
    () => wb.effectiveCourse?.stops ?? [],
    [wb.effectiveCourse],
  );

  const exploreDays = useMemo(
    () =>
      Math.max(1, (wb.livePlan?.nights ?? 0) + 1, ...(stops.map((s) => s.day ?? 1))),
    [wb.livePlan?.nights, stops],
  );

  const routeKey = useMemo(
    () => stops.map((s) => `${s.order}:${s.latitude},${s.longitude}`).join("|"),
    [stops],
  );

  const mapPoints = useMemo(
    () =>
      stops.map((s) => ({
        lat: s.latitude,
        lng: s.longitude,
        name: s.name,
        order: s.order,
        category: s.category,
      })),
    [stops],
  );

  const svgPoints = useMemo(() => stopsToMapPoints(stops), [stops]);
  const svgPath = useMemo(() => pathFromMapPoints(svgPoints), [svgPoints]);

  useEffect(() => {
    if (stops.length < 2) {
      setRoutePath((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    let cancelled = false;
    const points = stops.map((s) => ({ lat: s.latitude, lng: s.longitude }));
    fetchDrivingRoute(points).then((path) => {
      if (!cancelled) setRoutePath(path ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [routeKey, stops.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    wb.handleUserText(wb.input);
  };

  useEffect(() => {
    if (initialCourse?.id && initialCourse.id > 0) {
      setPersistedCourseId(initialCourse.id);
    }
  }, [initialCourse?.id]);

  useEffect(() => {
    setPersistedCourseId(null);
    setSavedRouteKey(null);
  }, [wb.courseRevision]);

  const isCourseSaved = savedRouteKey === routeKey && savedRouteKey !== null;

  const handleSaveCourse = async () => {
    if (!wb.effectiveCourse || stops.length === 0 || saving || isCourseSaved) return;
    setSaving(true);
    setSaveNotice("");
    try {
      const firstUser = wb.messages.find((m) => m.role === "user")?.text ?? "";
      const options = {
        title: wb.courseTitle,
        promptText: firstUser || wb.effectiveCourse.summary,
      };
      const saved =
        persistedCourseId != null
          ? await updateItinerary(persistedCourseId, pet, wb.effectiveCourse, options)
          : await saveItinerary(pet, wb.effectiveCourse, options);
      setPersistedCourseId(saved.id);
      setSavedRouteKey(routeKey);
      setSaveNotice("코스를 저장했어요.");
      wb.pushCourseNotification("saved", `「${wb.courseTitle}」 코스를 저장했어요.`);
      onCourseSaved?.(saved);
      setActiveTab("itinerary");
    } catch (err) {
      setSaveNotice(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (initialCourse && stops.length > 0) {
      setSavedRouteKey(routeKey);
    }
  }, [initialCourse?.id, routeKey, stops.length]);

  const handleMapSelect = (p: { order?: number; name?: string }) => {
    const idx = stops.findIndex((s) => s.order === p.order || s.name === p.name);
    if (idx >= 0) wb.setActiveStopIndex(idx);
  };

  const handleEmergency = () => {
    const params = new URLSearchParams();
    const dest = wb.region || mapDestination;
    if (dest) params.set("region", dest);
    const stop = stops[wb.activeStopIndex] ?? stops[0];
    if (stop) {
      params.set("lat", String(stop.latitude));
      params.set("lng", String(stop.longitude));
    }
    const query = params.toString();
    router.push(query ? `/emergency?${query}` : "/emergency");
  };

  const handleFolderTab = (tab: PlannerFolderTabId) => {
    if (tab === "dog") {
      router.push("/wallet");
      return;
    }
    setActiveTab(tab);
  };

  const mapFallback = (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
      <path d="M-20 140 H420 M-20 360 H420 M-20 540 H420 M90 -20 V720 M250 -20 V720 M340 -20 V720" stroke="#d8dee6" strokeWidth="10" fill="none" />
      <path d="M-20 250 C 120 280, 200 420, 420 460" stroke="#d8dee6" strokeWidth="14" fill="none" opacity="0.7" />
      <path d="M40 60 L 360 640" stroke="#d8dee6" strokeWidth="3" strokeDasharray="2 10" fill="none" />
      {svgPath && (
        <path
          d={svgPath}
          stroke={PLANNER_BLUE}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
      )}
      {svgPoints.map((pt, index) => (
        <g
          key={`${pt.order}-${pt.name}`}
          onClick={() => wb.setActiveStopIndex(index)}
          style={{ cursor: "pointer" }}
        >
          <circle
            cx={pt.x}
            cy={pt.y}
            r={wb.activeStopIndex === index ? 16 : 13}
            fill={wb.activeStopIndex === index ? PLANNER_BLUE : "white"}
            stroke={PLANNER_BLUE}
            strokeWidth="2"
          />
          <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="11">
            {pt.emoji}
          </text>
        </g>
      ))}
    </svg>
  );

  return (
    <div
      className="planner-workbench flex max-h-[min(948px,95vh)] min-h-[min(720px,92vh)] flex-col overflow-hidden rounded-[22px] border shadow-2xl"
      style={{
        borderColor: "var(--pw-border)",
        background: "var(--pw-panel)",
        boxShadow: "var(--pw-shadow)",
      }}
    >
      <div
        className="flex h-[60px] shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-5"
        style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
      >
        <PlannerFolderTabs active={activeTab} onChange={handleFolderTab} />
        <div className="flex shrink-0 items-center gap-1.5">
          {stops.length > 0 && (
            <button
              type="button"
              onClick={handleSaveCourse}
              disabled={saving || isCourseSaved}
              className={`pw-btn-accent mr-1 hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold sm:inline-flex disabled:cursor-not-allowed ${isCourseSaved ? "pw-btn-accent--saved" : ""}`}
              style={{
                background: isCourseSaved ? "var(--pw-accent-soft)" : "var(--pw-accent)",
                color: isCourseSaved ? "var(--pw-accent)" : "#fff",
              }}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isCourseSaved ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
              {saving ? "저장 중..." : isCourseSaved ? "저장됨" : "코스 저장"}
            </button>
          )}
          <button
            type="button"
            onClick={wb.toggleVoice}
            className={`pw-btn-icon ${wb.voiceEnabled ? "pw-btn-icon--active" : "pw-btn-icon--off"}`}
            aria-label={wb.voiceEnabled ? "음성 안내 끄기" : "음성 안내 켜기"}
            title="AI 음성 안내"
          >
            <Volume2 className={`h-4 w-4 ${wb.voiceEnabled ? "" : "opacity-50"}`} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((o) => !o)}
              className={`pw-btn-icon relative ${notificationsOpen ? "pw-btn-icon--active" : ""}`}
              aria-label="코스 알림"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-4 w-4" />
              {wb.courseNotifications.length > 0 && (
                <span
                  className="absolute right-1 top-1 h-2 w-2 rounded-full"
                  style={{ background: "var(--pw-accent)" }}
                />
              )}
            </button>
            <PlannerNotificationPopover
              notifications={wb.courseNotifications}
              open={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>
          <Link
            href="/profile"
            className="pw-profile-link ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
            style={{ background: "var(--pw-chip)" }}
            title="내 프로필"
          >
            <div
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[12px] font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#9CC2FF,#3B5BFE)" }}
            >
              {profileInitial}
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-[12.5px] font-bold" style={{ color: "var(--pw-text)" }}>
                {displayName}
              </div>
              {handle && (
                <div className="text-[11px] font-medium" style={{ color: "var(--pw-muted)" }}>
                  {handle}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {activeTab === "planner" ? (
      <div
        className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,3.5fr)_minmax(0,2.8fr)]"
        style={{ background: "var(--pw-bg)" }}
      >
        {/* 채팅 */}
        <div
          className="flex min-w-0 flex-col border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
        >
          <div
            className="flex items-center justify-between border-b px-[18px] py-3"
            style={{ borderColor: "var(--pw-border)" }}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" style={{ color: "var(--pw-accent)" }} />
              <span className="text-[14px] font-bold" style={{ color: "var(--pw-text)" }}>
                AI 1.0
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold"
                style={{ background: "var(--pw-accent-soft)", color: "var(--pw-accent)" }}
                title="펫 동반 공공데이터"
              >
                <Satellite className="h-3.5 w-3.5" />
                실데이터
              </div>
              <button
                type="button"
                onClick={wb.resetChat}
                className="pw-btn-toolbar flex h-8 w-8 items-center justify-center rounded-[9px]"
                aria-label="새 대화"
                title="새 대화"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] flex-1 space-y-3.5 overflow-y-auto px-[18px] py-3 lg:max-h-none">
            {wb.messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div
                    className="max-w-[88%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[13px] leading-relaxed text-white"
                    style={{ background: "var(--pw-accent)" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2">
                  <CocoAvatar />
                  <div
                    className="max-w-[90%] rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-[13px] leading-[1.65]"
                    style={{
                      borderColor: "var(--pw-border)",
                      background: "var(--pw-ai-bubble)",
                      color: "var(--pw-text)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ),
            )}

            {wb.effectiveCourse && stops.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("itinerary");
                  wb.setActiveStopIndex(0);
                }}
                className="pw-card-hit group ml-9 w-[calc(100%-2.25rem)] rounded-xl border p-3 text-left"
                style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel)" }}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--pw-accent)" }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold" style={{ color: "var(--pw-text)" }}>
                      {wb.courseTitle}
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: "var(--pw-muted)" }}>
                      {stops.length}곳 입장 가능 · {wb.region}
                    </div>
                  </div>
                  <ChevronRight className="pw-card-chevron h-4 w-4 shrink-0" style={{ color: "var(--pw-faint)" }} />
                </div>
              </button>
            )}

            {wb.liveLoading && (
              <div className="ml-9 flex items-center gap-2 text-xs" style={{ color: "var(--pw-muted)" }}>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI가 답변을 작성 중...
              </div>
            )}
          </div>

          {wb.suggestions.length > 0 && !wb.listening && !wb.liveLoading && (
            <div
              className="flex gap-1.5 overflow-x-auto px-[18px] py-2"
              style={{ borderColor: "var(--pw-line)" }}
            >
              {wb.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => wb.handleUserText(s)}
                  className="pw-chip-suggest shrink-0 rounded-full px-3 py-2 text-[12.5px] font-semibold"
                  style={{
                    background: "var(--pw-accent-soft)",
                    color: "var(--pw-accent)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="shrink-0 px-[18px] pb-4 pt-1.5"
            style={{ background: "var(--pw-panel)" }}
          >
            <div
              className="flex items-center gap-2 rounded-2xl border px-4 py-1.5"
              style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel-2)" }}
            >
              <input
                value={wb.input}
                onChange={(e) => wb.setInput(e.target.value)}
                placeholder="무엇이든 물어보세요..."
                disabled={wb.liveLoading}
                className="flex-1 bg-transparent py-2 text-[14px] outline-none disabled:opacity-60"
                style={{ color: "var(--pw-text)" }}
              />
              <button
                type="button"
                onClick={wb.startVoice}
                className="pw-input-action flex h-9 w-9 items-center justify-center rounded-[11px]"
                style={{
                  color: wb.listening ? "#fff" : "var(--pw-muted)",
                  background: wb.listening ? "#FF6B5C" : "var(--pw-chip)",
                }}
                aria-label="음성 입력"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={wb.liveLoading || !wb.input.trim()}
                className="pw-send-btn flex h-9 w-9 items-center justify-center rounded-[11px] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: "var(--pw-accent)" }}
                aria-label="전송"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10.5px]" style={{ color: "var(--pw-faint)" }}>
              AI는 참고용이며 안전·규정은 규칙으로 확인해요 · 음성은 저장하지 않아요
            </p>
          </form>
        </div>

        {/* 상세 */}
        <div
          className="flex min-h-0 min-w-0 flex-col border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--pw-border)", background: "var(--pw-panel-2)" }}
        >
          <PlaceDetailPanel
            stop={wb.activeStop}
            prevStop={wb.activeStopIndex > 0 ? stops[wb.activeStopIndex - 1] : null}
            nextStop={
              wb.activeStopIndex < stops.length - 1 ? stops[wb.activeStopIndex + 1] : null
            }
            pet={pet}
            region={wb.region}
            tripPlan={wb.livePlan}
            hasCourse={!!wb.effectiveCourse && stops.length > 0}
            stopIndex={wb.activeStopIndex}
            onRemoveFromCourse={
              wb.activeStop
                ? () => wb.removeCourseStop(wb.activeStop!.name)
                : undefined
            }
          />
        </div>

        {/* 지도 */}
        <div className="relative min-h-[300px] lg:min-h-0 lg:min-w-[240px]" style={{ background: "var(--pw-map)" }}>
          <div className="absolute left-3.5 right-3.5 top-3.5 z-10 space-y-1.5">
            <div
              className="flex items-center gap-2 rounded-[11px] border px-3 py-2 shadow-sm"
              style={{
                borderColor: "var(--pw-border)",
                background: "var(--pw-panel)",
                color: "var(--pw-text)",
              }}
            >
              <Route className="h-4 w-4 shrink-0" style={{ color: "var(--pw-accent)" }} />
              <div className="min-w-0 leading-tight">
                <div className="text-[12px] font-bold">{routeLabel}</div>
                <div className="text-[10.5px] font-medium" style={{ color: "var(--pw-muted)" }}>
                  실데이터 {stops.length}곳
                </div>
              </div>
            </div>
            {saveNotice && (
              <p
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium shadow-sm ${
                  saveNotice.includes("실패") || saveNotice.includes("없")
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {saveNotice}
              </p>
            )}
            {stops.length > 0 && (
              <button
                type="button"
                onClick={handleSaveCourse}
                disabled={saving || isCourseSaved}
                className="pw-btn-accent flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-bold text-white shadow-sm disabled:cursor-not-allowed sm:hidden"
                style={{ background: "var(--pw-accent)" }}
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isCourseSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
                {saving ? "저장 중..." : isCourseSaved ? "저장됨" : "코스 저장"}
              </button>
            )}
          </div>

          {mapPoints.length > 0 ? (
            <NaverMap
              points={mapPoints}
              path
              routePath={routePath}
              flush
              fallback={mapFallback}
              onSelect={handleMapSelect}
              activeOrder={stops[wb.activeStopIndex]?.order}
            />
          ) : (
            <div className="relative h-full min-h-[300px]">
              {mapFallback}
              <div
                className="absolute inset-0 flex items-center justify-center px-8 text-center text-[13px] font-semibold"
                style={{ color: "var(--pw-muted)" }}
              >
                채팅에서 가고 싶은 지역을 말하면
                <br />
                실데이터 코스가 그려져요
              </div>
            </div>
          )}

          {stops.length > 0 && (
            <MapStopStrip
              stops={stops}
              activeIndex={wb.activeStopIndex}
              onSelect={wb.setActiveStopIndex}
            />
          )}

          <div
            className="pointer-events-none absolute bottom-3.5 left-3.5 z-10 rounded-md border px-2 py-1 font-mono text-[10px] font-semibold"
            style={{
              borderColor: "var(--pw-border)",
              background: "var(--pw-panel)",
              color: "var(--pw-muted)",
            }}
          >
            GPS 아님 · 좌표 보간 경로
          </div>

          <button
            type="button"
            onClick={handleEmergency}
            className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600"
          >
            <span className="text-sm leading-none">✱</span>
            응급
          </button>
        </div>
      </div>
      ) : activeTab === "explore" && wb.effectiveCourse && stops.length > 0 ? (
        <PlannerExplore
          region={wb.region}
          hasCourse
          courseNames={stops.map((s) => s.name)}
          days={exploreDays}
          onAdd={wb.addCourseStop}
          onRemove={wb.removeCourseStop}
          onSuggest={wb.handleUserText}
        />
      ) : activeTab === "itinerary" && wb.effectiveCourse && stops.length > 0 ? (
        <PlannerItinerary
          pet={pet}
          course={wb.effectiveCourse}
          courseTitle={wb.courseTitle}
          onSelectStop={(index) => {
            setActiveTab("planner");
            wb.setActiveStopIndex(index);
          }}
          onRemoveStop={wb.removeCourseStop}
          onEmergency={handleEmergency}
          saved={isCourseSaved}
        />
      ) : (
        <PlannerTabPlaceholder tab={activeTab} />
      )}
    </div>
  );
}
