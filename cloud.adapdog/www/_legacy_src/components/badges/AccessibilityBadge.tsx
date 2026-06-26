import { Accessibility, CheckCircle2, CircleDashed, CircleOff } from 'lucide-react';
import type { AccessibilityInfo } from '@/types';

const levelConfig = {
  full: {
    icon: CheckCircle2,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-900',
    iconColor: 'text-sky-600',
    badge: 'bg-sky-500',
  },
  partial: {
    icon: CircleDashed,
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-900',
    iconColor: 'text-violet-600',
    badge: 'bg-violet-500',
  },
  none: {
    icon: CircleOff,
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-700',
    iconColor: 'text-slate-500',
    badge: 'bg-slate-400',
  },
} as const;

interface AccessibilityBadgeProps {
  info: AccessibilityInfo;
  size?: 'sm' | 'md' | 'lg';
}

export function AccessibilityBadge({ info, size = 'md' }: AccessibilityBadgeProps) {
  const config = levelConfig[info.level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'p-2 gap-2 text-xs',
    md: 'p-3 gap-3 text-sm',
    lg: 'p-4 gap-4 text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`flex items-start rounded-2xl border-2 ${config.bg} ${config.border} ${sizeClasses[size]}`}
      role="status"
      aria-label={`이동약자 배려 정보: ${info.label}`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.badge} text-white`}>
        <Icon size={iconSizes[size]} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Accessibility size={14} className={config.iconColor} />
          <span className={`font-bold ${config.text}`}>이동약자 배려</span>
        </div>
        <p className={`mt-0.5 font-semibold ${config.text}`}>{info.label}</p>
        {info.features.length > 0 && (
          <ul className={`mt-2 space-y-1 ${config.text}`}>
            {info.features.map((feature) => (
              <li key={feature} className="flex items-center gap-1.5 opacity-90">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.badge}`} />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
