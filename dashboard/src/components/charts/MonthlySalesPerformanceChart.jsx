import { useState } from 'react';

const YEAR_DATA = {
  '2026': [
    { month: 'Jan', sales: 3450, target: 2750, prevYear: 2800, dateStr: 'January 2026' },
    { month: 'Feb', sales: 3100, target: 3600, prevYear: 2950, dateStr: 'February 2026' },
    { month: 'Mar', sales: 3950, target: 4320, prevYear: 3200, dateStr: 'March 2026' },
    { month: 'Apr', sales: 4790, target: 3830, prevYear: 3800, dateStr: 'April 2026' },
    { month: 'May', sales: 4200, target: 4250, prevYear: 3600, dateStr: 'May 2026' },
    { month: 'Jun', sales: 5280, target: 4680, prevYear: 4100, dateStr: 'June 2026' },
    { month: 'Jul', sales: 4920, target: 4800, prevYear: 4250, dateStr: 'July 2026' },
    { month: 'Aug', sales: 5410, target: 5000, prevYear: 4400, dateStr: 'August 2026' },
    { month: 'Sep', sales: 5120, target: 4900, prevYear: 4150, dateStr: 'September 2026' },
    { month: 'Oct', sales: 5680, target: 5200, prevYear: 4700, dateStr: 'October 2026' },
    { month: 'Nov', sales: 5350, target: 5100, prevYear: 4600, dateStr: 'November 2026' },
    { month: 'Dec', sales: 5950, target: 5500, prevYear: 5100, dateStr: 'December 2026' },
  ],
  '2025': [
    { month: 'Jan', sales: 2800, target: 2500, prevYear: 2100, dateStr: 'January 2025' },
    { month: 'Feb', sales: 2950, target: 3000, prevYear: 2300, dateStr: 'February 2025' },
    { month: 'Mar', sales: 3200, target: 3400, prevYear: 2600, dateStr: 'March 2025' },
    { month: 'Apr', sales: 3800, target: 3500, prevYear: 2900, dateStr: 'April 2025' },
    { month: 'May', sales: 3600, target: 3700, prevYear: 3100, dateStr: 'May 2025' },
    { month: 'Jun', sales: 4100, target: 3900, prevYear: 3400, dateStr: 'June 2025' },
    { month: 'Jul', sales: 4250, target: 4100, prevYear: 3550, dateStr: 'July 2025' },
    { month: 'Aug', sales: 4400, target: 4200, prevYear: 3700, dateStr: 'August 2025' },
    { month: 'Sep', sales: 4150, target: 4300, prevYear: 3500, dateStr: 'September 2025' },
    { month: 'Oct', sales: 4700, target: 4500, prevYear: 3900, dateStr: 'October 2025' },
    { month: 'Nov', sales: 4600, target: 4500, prevYear: 4000, dateStr: 'November 2025' },
    { month: 'Dec', sales: 5100, target: 4800, prevYear: 4300, dateStr: 'December 2025' },
  ],
  '2024': [
    { month: 'Jan', sales: 2100, target: 2000, prevYear: 1600, dateStr: 'January 2024' },
    { month: 'Feb', sales: 2300, target: 2200, prevYear: 1750, dateStr: 'February 2024' },
    { month: 'Mar', sales: 2600, target: 2500, prevYear: 1900, dateStr: 'March 2024' },
    { month: 'Apr', sales: 2900, target: 2700, prevYear: 2100, dateStr: 'April 2024' },
    { month: 'May', sales: 3100, target: 3000, prevYear: 2300, dateStr: 'May 2024' },
    { month: 'Jun', sales: 3400, target: 3200, prevYear: 2500, dateStr: 'June 2024' },
    { month: 'Jul', sales: 3550, target: 3300, prevYear: 2650, dateStr: 'July 2024' },
    { month: 'Aug', sales: 3700, target: 3500, prevYear: 2800, dateStr: 'August 2024' },
    { month: 'Sep', sales: 3500, target: 3400, prevYear: 2700, dateStr: 'September 2024' },
    { month: 'Oct', sales: 3900, target: 3600, prevYear: 3000, dateStr: 'October 2024' },
    { month: 'Nov', sales: 4000, target: 3800, prevYear: 3100, dateStr: 'November 2024' },
    { month: 'Dec', sales: 4300, target: 4000, prevYear: 3300, dateStr: 'December 2024' },
  ],
};

function getSmoothPath(points) {
  if (!points || points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function MonthlySalesPerformanceChart() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [periodFilter, setPeriodFilter] = useState('All'); // 'All', 'H1', 'H2'
  const [activeIdx, setActiveIdx] = useState(null); // ONLY show on hover

  // Determine current active dataset based on year and period filter
  const fullYearData = YEAR_DATA[selectedYear] || YEAR_DATA['2026'];
  const currentData = periodFilter === 'H1'
    ? fullYearData.slice(0, 6)
    : periodFilter === 'H2'
      ? fullYearData.slice(6, 12)
      : fullYearData;

  const yTicks = [6000, 4500, 3000, 1500, 0];
  const chartW = 960;
  const chartH = 260;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 30;
  const padBottom = 30;

  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const getY = (val) => padTop + plotH - (val / 6000) * plotH;
  const getX = (idx) => padLeft + (idx / (currentData.length - 1)) * plotW;

  const salesPoints = currentData.map((m, idx) => ({ x: getX(idx), y: getY(m.sales) }));
  const targetPoints = currentData.map((m, idx) => ({ x: getX(idx), y: getY(m.target) }));
  const prevPoints = currentData.map((m, idx) => ({ x: getX(idx), y: getY(m.prevYear) }));

  const salesPath = getSmoothPath(salesPoints);
  const targetPath = getSmoothPath(targetPoints);
  const prevPath = getSmoothPath(prevPoints);

  const activeSalesPoint = activeIdx !== null ? salesPoints[activeIdx] : null;
  const activeTargetPoint = activeIdx !== null ? targetPoints[activeIdx] : null;
  const activePrevPoint = activeIdx !== null ? prevPoints[activeIdx] : null;
  const activeItem = activeIdx !== null ? currentData[activeIdx] : null;

  // Tooltip dimensions
  const tooltipW = 205;
  const tooltipH = 110;

  let rawTooltipX = activeSalesPoint ? activeSalesPoint.x + 16 : 0;
  if (activeSalesPoint && rawTooltipX + tooltipW > chartW - padRight) {
    rawTooltipX = activeSalesPoint.x - tooltipW - 16;
  }
  const tooltipX = activeSalesPoint ? Math.max(padLeft + 6, Math.min(chartW - padRight - tooltipW - 6, rawTooltipX)) : 0;
  const tooltipY = activeSalesPoint ? Math.max(10, Math.min(chartH - padBottom - tooltipH, activeSalesPoint.y - tooltipH / 2)) : 0;

  const growth = activeItem
    ? (((activeItem.sales - activeItem.prevYear) / activeItem.prevYear) * 100).toFixed(1)
    : 0;

  return (
    <div
      className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full relative overflow-hidden"
      onMouseLeave={() => setActiveIdx(null)}
    >
      {/* Header, Year Selector & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Monthly Sales performance
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            12-month agency revenue vs targets with prior year benchmarks
          </p>
        </div>

        {/* Controls: Year Switcher, Period Filter, and Legend */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap self-start lg:self-auto">
          {/* Year Switcher (2026, 2025, 2024) */}
          <div className="flex items-center bg-[#12141a] border border-[#232734] rounded-full p-0.5 shadow-xs">
            {['2026', '2025', '2024'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setSelectedYear(yr);
                  setActiveIdx(null);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-text-muted hover:text-white'
                }`}
                title={`View ${yr} Sales Performance`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Period Filter: 12M / H1 / H2 */}
          <div className="flex items-center bg-[#12141a] border border-[#232734] rounded-full p-0.5 shadow-xs">
            {[
              { id: 'All', label: '12M' },
              { id: 'H1', label: 'H1' },
              { id: 'H2', label: 'H2' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPeriodFilter(p.id);
                  setActiveIdx(null);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  periodFilter === p.id
                    ? 'bg-[#202330] text-white border border-[#2e3344]'
                    : 'text-text-muted hover:text-white'
                }`}
                title={`Filter ${p.label}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Legend Indicators */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-0.5 rounded-full bg-[#ff5530] inline-block" />
              <span>Sales</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-0.5 rounded-full bg-[#7c6df7] inline-block" />
              <span>Target</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <span className="w-3 h-0.5 border-b border-dashed border-[#64748b] inline-block" />
              <span>Prior Year</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="relative w-full overflow-x-auto custom-scrollbar select-none"
        onMouseLeave={() => setActiveIdx(null)}
      >
        <div className="min-w-[700px]">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto block"
            onMouseLeave={() => setActiveIdx(null)}
          >
            {/* Horizontal Dashed Guidelines & Y-Axis */}
            {yTicks.map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <text
                    x={padLeft - 14}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] font-medium"
                    fill="var(--color-text-muted)"
                  >
                    {val}
                  </text>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={chartW - padRight}
                    y2={y}
                    stroke="var(--color-border)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Prior Year Benchmark Spline Curve (Dashed Slate #64748b) */}
            <path
              d={prevPath}
              fill="none"
              stroke="#5a6275"
              strokeDasharray="4 4"
              strokeWidth="1.6"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />

            {/* Target Spline Curve (Violet #7c6df7) */}
            <path
              d={targetPath}
              fill="none"
              stroke="#7c6df7"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Sales Spline Curve (Coral #ff5530) */}
            <path
              d={salesPath}
              fill="none"
              stroke="#ff5530"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Vertical Indicator ONLY when Hovered */}
            {activeSalesPoint && (
              <line
                x1={activeSalesPoint.x}
                y1={Math.min(activeSalesPoint.y, activeTargetPoint.y, activePrevPoint.y) - 10}
                x2={activeSalesPoint.x}
                y2={getY(0)}
                stroke="var(--color-text-muted)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
            )}

            {/* Prior Year Focus Dot ONLY when Hovered */}
            {activePrevPoint && (
              <circle
                cx={activePrevPoint.x}
                cy={activePrevPoint.y}
                r="4.5"
                fill="#12141a"
                stroke="#64748b"
                strokeWidth="2"
                className="transition-all duration-150"
              />
            )}

            {/* Target Focus Dot ONLY when Hovered */}
            {activeTargetPoint && (
              <circle
                cx={activeTargetPoint.x}
                cy={activeTargetPoint.y}
                r="6"
                fill="white"
                stroke="#7c6df7"
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
            )}

            {/* Sales Focus Dot ONLY when Hovered */}
            {activeSalesPoint && (
              <circle
                cx={activeSalesPoint.x}
                cy={activeSalesPoint.y}
                r="6"
                fill="white"
                stroke="#ff5530"
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
            )}

            {/* Floating Dark Dual-Stat Tooltip Card - ONLY on Hover */}
            {activeSalesPoint && activeItem && (
              <g
                transform={`translate(${tooltipX}, ${tooltipY})`}
                className="transition-transform duration-150 pointer-events-none drop-shadow-2xl"
              >
                {/* Background Box */}
                <rect
                  width={tooltipW}
                  height={tooltipH}
                  rx="12"
                  fill="#0e1017"
                  stroke="#2b2f3e"
                  strokeWidth="1.2"
                />

                {/* Tooltip Header: Month & Year */}
                <text
                  x="16"
                  y="22"
                  fill="#8c93a4"
                  className="font-bold text-[12px] tracking-wide"
                >
                  {activeItem.dateStr}
                </text>

                {/* Sales Row */}
                <circle cx="20" cy="45" r="3.5" fill="#ff5530" />
                <text x="32" y="49" fill="#9ea4b5" className="text-[12px] font-medium">
                  Total sales
                </text>
                <text
                  x={tooltipW - 16}
                  y="49"
                  textAnchor="end"
                  fill="#ffffff"
                  className="text-[13px] font-bold"
                >
                  ${activeItem.sales.toLocaleString()}
                </text>

                {/* Target Row */}
                <circle cx="20" cy="69" r="3.5" fill="#7c6df7" />
                <text x="32" y="73" fill="#9ea4b5" className="text-[12px] font-medium">
                  Target sales
                </text>
                <text
                  x={tooltipW - 16}
                  y="73"
                  textAnchor="end"
                  fill="#ffffff"
                  className="text-[13px] font-bold"
                >
                  ${activeItem.target.toLocaleString()}
                </text>

                {/* Prior Year Comparison Row */}
                <circle cx="20" cy="93" r="3" fill="#64748b" />
                <text x="32" y="97" fill="#8c93a4" className="text-[11px] font-medium">
                  Prior year
                </text>
                <text
                  x={tooltipW - 16}
                  y="97"
                  textAnchor="end"
                  fill={parseFloat(growth) >= 0 ? '#22c55e' : '#ef4444'}
                  className="text-[11px] font-bold"
                >
                  ${activeItem.prevYear.toLocaleString()} ({parseFloat(growth) >= 0 ? `+${growth}%` : `${growth}%`})
                </text>
              </g>
            )}

            {/* Interactive Hit Area Columns */}
            {currentData.map((_, idx) => {
              const x = getX(idx);
              const colW = plotW / currentData.length;
              return (
                <rect
                  key={idx}
                  x={x - colW / 2}
                  y={padTop}
                  width={colW}
                  height={plotH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIdx(idx)}
                />
              );
            })}
          </svg>

          {/* Month Labels on X-Axis */}
          <div
            className="flex items-center justify-between text-xs mt-3 px-1"
            style={{
              paddingLeft: `${(padLeft / chartW) * 100}%`,
              paddingRight: `${(padRight / chartW) * 100}%`,
            }}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {currentData.map((m, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`transition-all duration-150 cursor-pointer py-1 px-2.5 rounded-md ${
                    isActive
                      ? 'font-bold text-white scale-110 bg-[#202330] border border-[#2e3344]'
                      : 'font-medium text-text-muted hover:text-white'
                  }`}
                >
                  {m.month}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
