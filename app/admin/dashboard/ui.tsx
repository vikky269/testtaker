import type { ReactNode } from 'react';

/** Shared sleek surfaces for admin analytics pages */

export const cardClass =
  'bg-white rounded-2xl border border-[#e8eee4] shadow-[0_1px_2px_rgba(26,46,5,0.04)]';

export const cardHoverClass =
  'hover:shadow-[0_10px_28px_-14px_rgba(26,46,5,0.2)] hover:border-[#d5e0d0] transition-all duration-200';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1a2e05]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  color = '#1a2e05',
  icon,
  iconBg = 'bg-[#edf5e5]',
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: ReactNode;
  iconBg?: string;
}) {
  return (
    <div className={`${cardClass} ${cardHoverClass} relative overflow-hidden p-4 sm:p-5`}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="pl-2">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">{label}</p>
          {icon && (
            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>
          )}
        </div>
        <p className="text-3xl font-extrabold tracking-tight leading-none" style={{ color }}>
          {value}
        </p>
        {sub && <p className="text-[11px] text-gray-400 mt-2 leading-snug">{sub}</p>}
      </div>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  className = '',
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${cardClass} p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#1a2e05]">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function TrackBar({
  value,
  max,
  color = '#7FB509',
  label,
  right,
  height = 'h-2.5',
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
  right?: string;
  height?: string;
}) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      {(label || right) && (
        <div className="flex justify-between items-center gap-2 text-xs text-gray-500 mb-1.5">
          <span className="truncate font-medium text-gray-600">{label}</span>
          {right && <span className="font-semibold text-gray-500 flex-shrink-0">{right}</span>}
        </div>
      )}
      <div className={`${height} rounded-full bg-[#eef2ea] overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            minWidth: value > 0 ? '6px' : 0,
          }}
        />
      </div>
    </div>
  );
}
