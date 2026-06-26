import { ExternalLink } from 'lucide-react';

interface ReservationButtonProps {
  reservationUrl?: string | null;
  className?: string;
}

export function ReservationButton({ reservationUrl, className = '' }: ReservationButtonProps) {
  const url = reservationUrl?.trim();
  const isReady = Boolean(url);

  const baseClass =
    'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition';

  if (isReady) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 active:scale-[0.98] ${className}`}
      >
        <ExternalLink size={16} />
        예약하기
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={`${baseClass} cursor-not-allowed bg-surface-muted text-ink-muted ring-1 ring-line ${className}`}
    >
      예약 준비 중
    </button>
  );
}
