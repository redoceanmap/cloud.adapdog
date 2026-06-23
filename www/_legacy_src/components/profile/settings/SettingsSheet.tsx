import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SettingsSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function SettingsSheet({ isOpen, title, subtitle, onClose, children }: SettingsSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        className="fixed inset-x-5 top-1/2 z-50 mx-auto flex h-auto max-h-[calc(100dvh-6rem)] min-h-[min(420px,72dvh)] w-full max-w-lg -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-sheet-title"
      >
        <div className="shrink-0 border-b border-line px-6 py-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="settings-sheet-title" className="text-lg font-bold text-ink">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition hover:bg-line/60"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </>
  );
}

export function SettingsGroup({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface-muted/40 shadow-sm ring-1 ring-line">
      <div className="divide-y divide-line/80">{children}</div>
    </div>
  );
}
