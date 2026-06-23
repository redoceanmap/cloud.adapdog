import { Dog, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import type { PettiquettePolicy } from '@/types';

const levelConfig = {
  allowed: {
    icon: ShieldCheck,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-500',
  },
  restricted: {
    icon: ShieldAlert,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-500',
  },
  not_allowed: {
    icon: ShieldX,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-500',
  },
} as const;

interface PettiquetteBadgeProps {
  policy: PettiquettePolicy;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export function PettiquetteBadge({ policy, size = 'md', showDescription = true }: PettiquetteBadgeProps) {
  const config = levelConfig[policy.level];
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
      aria-label={`펫티켓 정책: ${policy.label}`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.badge} text-white`}>
        <Icon size={iconSizes[size]} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Dog size={14} className={config.iconColor} />
          <span className={`font-bold ${config.text}`}>펫티켓 배지</span>
        </div>
        <p className={`mt-0.5 font-semibold ${config.text}`}>{policy.label}</p>
        {showDescription && policy.description && (
          <p className={`mt-1 leading-relaxed opacity-80 ${config.text}`}>{policy.description}</p>
        )}
      </div>
    </div>
  );
}
