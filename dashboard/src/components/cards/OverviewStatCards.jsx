import { Info, ArrowUpRight } from 'lucide-react';

const STATS = [
  {
    title: 'TOTAL REVENUE',
    value: '$20,320',
    change: '+0,94 last year',
    positive: true,
    bars: [35, 55, 40, 85, 60, 95],
  },
  {
    title: 'TOTAL ORDERS',
    value: '10,320',
    unit: 'Orders',
    change: '+0,94 last year',
    positive: true,
    bars: [45, 65, 30, 75, 90, 70],
  },
  {
    title: 'NEW CUSTOMERS',
    value: '4,305',
    unit: 'New Users',
    change: '+0,94 last year',
    positive: true,
    bars: [25, 40, 60, 50, 80, 100],
  },
  {
    title: 'CONVERSION RATE',
    value: '3.9%',
    unit: '',
    change: '+0,94 last year',
    positive: true,
    bars: [40, 30, 70, 55, 85, 90],
  },
];

export default function OverviewStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, idx) => (
        <div
          key={idx}
          className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          {/* Title row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              {stat.title}
            </span>
            <button
              type="button"
              className="text-text-muted/50 hover:text-text-muted transition-colors p-0.5"
              title={`Details for ${stat.title}`}
            >
              <Info size={13} />
            </button>
          </div>

          {/* Value + Sparkline Row */}
          <div className="flex items-end justify-between mt-3 mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text tracking-tight">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xs text-text-muted font-medium">
                  {stat.unit}
                </span>
              )}
            </div>

            {/* Sparkline mini vertical bars */}
            <div className="flex items-end gap-1 h-8 px-1">
              {stat.bars.map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-slate-300 dark:bg-slate-700 rounded-full transition-all duration-300 hover:bg-accent"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Footer Trend Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-text-muted/60 text-[11px]">Performance</span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              <span>{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
