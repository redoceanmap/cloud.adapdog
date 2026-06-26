import type { AccessibilityInfo, PettiquettePolicy } from '@/types';
import { AccessibilityBadge } from './AccessibilityBadge';
import { PettiquetteBadge } from './PettiquetteBadge';

interface PolicyBadgeGroupProps {
  pettiquette: PettiquettePolicy;
  accessibility: AccessibilityInfo;
  size?: 'sm' | 'md' | 'lg';
}

export function PolicyBadgeGroup({ pettiquette, accessibility, size = 'md' }: PolicyBadgeGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <PettiquetteBadge policy={pettiquette} size={size} />
      <AccessibilityBadge info={accessibility} size={size} />
    </div>
  );
}
