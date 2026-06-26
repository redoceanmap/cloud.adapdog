"use client";

import { useEffect, useRef } from "react";
import { Bell, Bookmark, Pencil } from "lucide-react";
import type { CourseNotification } from "@/hooks/usePlannerWorkbench";

interface PlannerNotificationPopoverProps {
  notifications: CourseNotification[];
  open: boolean;
  onClose: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function PlannerNotificationPopover({
  notifications,
  open,
  onClose,
}: PlannerNotificationPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border shadow-lg"
      style={{
        borderColor: "var(--pw-border)",
        background: "var(--pw-panel)",
        boxShadow: "var(--pw-shadow)",
      }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2.5"
        style={{ borderColor: "var(--pw-border)" }}
      >
        <Bell className="h-4 w-4" style={{ color: "var(--pw-accent)" }} />
        <span className="text-[13px] font-bold" style={{ color: "var(--pw-text)" }}>
          코스 알림
        </span>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-[11px]" style={{ color: "var(--pw-muted)" }}>
            코스를 저장하거나 수정하면
            <br />
            여기에 알림이 표시돼요.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-2 rounded-lg px-3 py-2.5"
              style={{ background: "var(--pw-panel-2)" }}
            >
              {n.kind === "saved" ? (
                <Bookmark
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--pw-accent)" }}
                />
              ) : (
                <Pencil
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--pw-accent)" }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold leading-snug" style={{ color: "var(--pw-text)" }}>
                  {n.message}
                </p>
                <p className="mt-0.5 text-[10px]" style={{ color: "var(--pw-muted)" }}>
                  {n.kind === "saved" ? "코스 저장" : "코스 수정"} · {formatTime(n.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
