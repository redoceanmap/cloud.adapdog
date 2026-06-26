import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Loader2,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import type { WeatherData, WalkRisk } from '@/types/weather';
import { calculateWalkRisk } from '@/types/weather';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  walkRisk: WalkRisk | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  dogName?: string;
}

const riskStyles = {
  safe: {
    badge: 'bg-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
    alert: 'border-emerald-100 bg-emerald-50 text-emerald-900',
  },
  caution: {
    badge: 'bg-amber-100 text-amber-900',
    bar: 'bg-amber-500',
    alert: 'border-amber-100 bg-amber-50 text-amber-900',
  },
  danger: {
    badge: 'bg-rose-100 text-rose-800',
    bar: 'bg-rose-500',
    alert: 'border-rose-100 bg-rose-50 text-rose-900',
  },
} as const;

export function WeatherWidget({
  weather,
  walkRisk,
  loading = false,
  error = null,
  onRetry,
  dogName = '반려견',
}: WeatherWidgetProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-line">
        <Loader2 size={24} className="animate-spin text-brand-500" />
        <span className="ml-2 text-sm text-ink-muted">날씨 불러오는 중...</span>
      </div>
    );
  }

  if (error || !weather || !walkRisk) {
    return (
      <div className="rounded-3xl bg-surface p-5 text-center shadow-sm ring-1 ring-line">
        <p className="text-sm text-ink-muted">{error ?? '날씨 정보가 없습니다.'}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white"
          >
            <RefreshCw size={14} />
            다시 시도
          </button>
        )}
      </div>
    );
  }

  const styles = riskStyles[walkRisk.level];
  const riskPercent =
    walkRisk.level === 'safe' ? 25 : walkRisk.level === 'caution' ? 60 : 90;

  return (
    <section className="space-y-3" aria-label="날씨 및 산책 위험도">
      {/* 산책 위험도 */}
      <div className="rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">산책 위험도</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles.badge}`}>
            {walkRisk.label}
          </span>
        </div>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full rounded-full transition-all ${styles.bar}`}
            style={{ width: `${riskPercent}%` }}
          />
        </div>
        <p className="text-xs leading-relaxed text-ink-muted">{walkRisk.message}</p>
      </div>

      {/* 날씨 정보 */}
      <div className="rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">{weather.cityName} 날씨</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt=""
            className="h-10 w-10"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <WeatherStat
            icon={Thermometer}
            label="기온"
            value={`${Math.round(weather.temperatureC)}°C`}
            highlight={weather.temperatureC >= 30}
          />
          <WeatherStat
            icon={Droplets}
            label="습도"
            value={`${weather.humidity}%`}
          />
          <WeatherStat icon={Wind} label="바람" value={`${weather.windSpeed.toFixed(1)}m/s`} />
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
          <Sun size={14} className="text-amber-500" />
          {weather.description} · 체감 {Math.round(weather.feelsLikeC)}°C
        </p>
      </div>

      {/* 주의 배너 */}
      {walkRisk.showAlert && (
        <div className={`flex gap-3 rounded-3xl border p-4 ${styles.alert}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface/70">
            {weather.weatherMain.includes('Rain') || weather.weatherMain === 'Drizzle' ? (
              <CloudRain size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
          </div>
          <div>
            <p className="font-bold">
              {weather.temperatureC >= 30
                ? `폭염(${Math.round(weather.temperatureC)}°C) · 폭염주의보`
                : walkRisk.label === '주의'
                  ? '산책 주의'
                  : '산책 참고'}
            </p>
            <p className="mt-1 text-xs leading-relaxed opacity-90">
              {dogName}와 함께할 때 {walkRisk.message}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export { calculateWalkRisk };

function WeatherStat({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface-muted px-2 py-2.5 text-center">
      <Icon size={14} className={`mx-auto ${highlight ? 'text-rose-500' : 'text-brand-500'}`} />
      <p className="mt-1 text-[10px] text-ink-muted">{label}</p>
      <p className={`text-xs font-bold ${highlight ? 'text-rose-600' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}
