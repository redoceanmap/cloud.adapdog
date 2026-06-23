import { Home, Image, Map, PawPrint, Route } from 'lucide-react';

export type AppTab = 'home' | 'explore' | 'course' | 'record' | 'profile';

interface BottomNavProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'explore', label: '탐색', icon: Map },
  { id: 'course', label: '코스', icon: Route },
  { id: 'record', label: '기록', icon: Image },
  { id: 'profile', label: '프로필', icon: PawPrint },
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 rounded-t-3xl bg-surface/95 backdrop-blur-md"
      style={{ boxShadow: 'var(--shadow-tab)' }}
    >
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-2 pt-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="flex flex-1 flex-col items-center gap-1 py-1"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                  active
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/45 dark:text-brand-300'
                    : 'text-ink-muted'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-brand-700 dark:text-brand-300' : 'text-ink-muted'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
