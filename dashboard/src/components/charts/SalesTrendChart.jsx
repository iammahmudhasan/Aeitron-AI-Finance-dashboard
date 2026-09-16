import { useState } from 'react';
import { Info, MoreHorizontal } from 'lucide-react';

const MONTHS_DATA = [
  { month: 'JAN', newUsers: 14, existingUsers: 8, totalK: 22 },
  { month: 'FEB', newUsers: 22, existingUsers: 12, totalK: 34 },
  { month: 'MAR', newUsers: 30, existingUsers: 16, totalK: 46 },
  { month: 'APR', newUsers: 18, existingUsers: 10, totalK: 28 },
  { month: 'MAY', newUsers: 26, existingUsers: 14, totalK: 40 },
  { month: 'JUN', newUsers: 38, existingUsers: 18, totalK: 56 },
  { month: 'JUL', newUsers: 20, existingUsers: 12, totalK: 32 },
  { month: 'AUG', newUsers: 34, existingUsers: 16, totalK: 50 },
  { month: 'SEP', newUsers: 16, existingUsers: 8, totalK: 24 },
  { month: 'OCT', newUsers: 28, existingUsers: 14, totalK: 42 },
  { month: 'NOV', newUsers: 24, existingUsers: 12, totalK: 36 },
  { month: 'DEC', newUsers: 32, existingUsers: 16, totalK: 48 },
];

export default function SalesTrendChart() {
  const [period, setPeriod] = useState('Monthly');
  const [hoveredIndex, setHoveredIndex] = useState(5); // Default hovered on JUN to match screenshot!

  const yLabels = ['60k', '50k', '40k', '30k', '20k', '10k', '0k'];
  const maxK = 60;
  const totalBlocks = 12; // 12 discrete block levels

  return (
    <div className="bg-bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-text uppercase tracking-wider">
              SALES TREND
            </span>
            <Info size={13} className="text-text-muted/60" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-xl font-bold text-text">
              Total Revenue : <span className="text-text font-black">$20,320</span>
            </div>
            {/* Legend */}
            <div className="hidden md:flex items-center gap-3 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                NEW USER
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                EXISTING USER
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Period Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-1 bg-bg border border-border rounded-xl text-xs font-medium">
            {['Weekly', 'Monthly', 'Yearly'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === item
                    ? 'bg-bg-card text-text font-semibold shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-bg transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-6 pb-2">
        <div className="flex">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between pr-3 text-[11px] font-mono text-text-muted/70 h-52 select-none">
            {yLabels.map((lbl) => (
              <span key={lbl} className="leading-none text-right w-6">
                {lbl}
              </span>
            ))}
          </div>

          {/* Grid Bars Area */}
          <div className="flex-1 grid grid-cols-12 gap-1.5 sm:gap-2.5 h-52 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yLabels.map((_, idx) => (
                <div key={idx} className="border-b border-border/40 w-full" />
              ))}
            </div>

            {/* Monthly Bar Columns */}
            {MONTHS_DATA.map((item, idx) => {
              const totalRatio = item.totalK / maxK;
              const totalActiveBlocks = Math.round(totalRatio * totalBlocks);
              const existingBlocks = Math.round((item.existingUsers / maxK) * totalBlocks);
              const newBlocks = Math.max(0, totalActiveBlocks - existingBlocks);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className="flex flex-col justify-end items-center h-full relative cursor-pointer group z-10"
                >
                  {/* Vertical dashed guideline on hover */}
                  {isHovered && (
                    <div className="absolute inset-y-0 w-px border-l-2 border-dashed border-slate-400 dark:border-slate-500 pointer-events-none z-0" />
                  )}

                  {/* Floating Tooltip Card */}
                  {isHovered && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-bg-card border border-border shadow-xl rounded-xl p-2.5 z-30 pointer-events-none whitespace-nowrap animate-fade-in text-xs min-w-[130px]">
                      <div className="font-semibold text-text mb-1 border-b border-border/50 pb-1 text-[11px]">
                        {item.month} 2025
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[11px] text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          New User
                        </span>
                        <span className="font-semibold text-text">{item.newUsers}k</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[11px] text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                          Existing User
                        </span>
                        <span className="font-semibold text-text">{item.existingUsers}k</span>
                      </div>
                    </div>
                  )}

                  {/* Stacked Matrix Blocks Column */}
                  <div className="flex flex-col-reverse gap-0.5 sm:gap-1 w-full max-w-[18px] relative z-10">
                    {Array.from({ length: totalBlocks }).map((_, blockIdx) => {
                      const isExisting = blockIdx < existingBlocks;
                      const isNew = blockIdx >= existingBlocks && blockIdx < totalActiveBlocks;
                      const isInactive = blockIdx >= totalActiveBlocks;

                      let blockStyle = 'bg-slate-100 dark:bg-slate-800/40 opacity-40';
                      if (isExisting) {
                        blockStyle = isHovered
                          ? 'bg-slate-950 dark:bg-white shadow-xs scale-105'
                          : 'bg-slate-800 dark:bg-slate-200';
                      } else if (isNew) {
                        blockStyle = isHovered
                          ? 'bg-slate-400 dark:bg-slate-400 scale-105'
                          : 'bg-slate-300 dark:bg-slate-600';
                      }

                      return (
                        <div
                          key={blockIdx}
                          className={`h-2.5 rounded-xs transition-all duration-150 ${blockStyle}`}
                        />
                      );
                    })}
                  </div>

                  {/* Month Label */}
                  <div
                    className={`mt-2 text-[10px] font-semibold transition-colors uppercase ${
                      isHovered ? 'text-text font-black scale-110' : 'text-text-muted/80'
                    }`}
                  >
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
