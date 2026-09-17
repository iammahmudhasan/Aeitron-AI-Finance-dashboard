import { useState } from 'react';

const MONTH_DATA = [
  { month: 'Jan', sales: 3450, target: 2750, dateStr: 'Jan 1, 2025' },
  { month: 'Feb', sales: 3100, target: 3600, dateStr: 'Feb 1, 2025' },
  { month: 'Mar', sales: 3950, target: 4320, dateStr: 'Mar 1, 2025' },
  { month: 'Apr', sales: 4790, target: 3830, dateStr: 'April 1, 2025' },
  { month: 'May', sales: 4200, target: 4250, dateStr: 'May 1, 2025' },
  { month: 'Jun', sales: 5280, target: 4680, dateStr: 'June 1, 2025' },
];

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
  const [activeIdx, setActiveIdx] = useState(null); // ONLY show on hover!

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
  const getX = (idx) => padLeft + (idx / (MONTH_DATA.length - 1)) * plotW;

  const salesPoints = MONTH_DATA.map((m, idx) => ({ x: getX(idx), y: getY(m.sales) }));
  const targetPoints = MONTH_DATA.map((m, idx) => ({ x: getX(idx), y: getY(m.target) }));

  const salesPath = getSmoothPath(salesPoints);
  const targetPath = getSmoothPath(targetPoints);

  const activeSalesPoint = activeIdx !== null ? salesPoints[activeIdx] : null;
  const activeTargetPoint = activeIdx !== null ? targetPoints[activeIdx] : null;
  const activeItem = activeIdx !== null ? MONTH_DATA[activeIdx] : null;

  // Enlarge tooltip dimensions for high visibility:
  const tooltipW = 185;
  const tooltipH = 92;

  // Smart horizontal positioning: position to right if space permits, else to left of cursor:
  let rawTooltipX = activeSalesPoint ? activeSalesPoint.x + 16 : 0;
  if (activeSalesPoint && rawTooltipX + tooltipW > chartW - padRight) {
    rawTooltipX = activeSalesPoint.x - tooltipW - 16;
  }
  const tooltipX = activeSalesPoint ? Math.max(padLeft + 6, Math.min(chartW - padRight - tooltipW - 6, rawTooltipX)) : 0;
  const tooltipY = activeSalesPoint ? Math.max(10, Math.min(chartH - padBottom - tooltipH, activeSalesPoint.y - tooltipH / 2)) : 0;

  return (
    <div
      className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full relative overflow-hidden"
      onMouseLeave={() => setActiveIdx(null)}
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="text-base font-bold text-white tracking-tight">
          Monthly Sales performance
        </h3>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="w-3 h-0.5 rounded-full bg-[#ff5530] inline-block" />
            <span>Sales</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span className="w-3 h-0.5 rounded-full bg-[#7c6df7] inline-block" />
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="relative w-full overflow-x-auto custom-scrollbar select-none"
        onMouseLeave={() => setActiveIdx(null)}
      >
        <div className="min-w-[500px]">
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
                y1={Math.min(activeSalesPoint.y, activeTargetPoint.y) - 10}
                x2={activeSalesPoint.x}
                y2={getY(0)}
                stroke="var(--color-text-muted)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                strokeOpacity="0.5"
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

            {/* Floating Dark Dual-Stat Tooltip Card - ONLY on Hover & Enlarged */}
            {activeSalesPoint && activeItem && (
              <g
                transform={`translate(${tooltipX}, ${tooltipY})`}
                className="transition-transform duration-150 pointer-events-none drop-shadow-2xl"
              >
                {/* Background Box with Enlarged Size */}
                <rect
                  width={tooltipW}
                  height={tooltipH}
                  rx="12"
                  fill="#0e1017"
                  stroke="#2b2f3e"
                  strokeWidth="1.2"
                />

                {/* Tooltip Title / Date (Bigger text) */}
                <text
                  x="16"
                  y="22"
                  fill="#8c93a4"
                  className="font-semibold text-[12px]"
                >
                  {activeItem.dateStr}
                </text>

                {/* Sales Row */}
                <circle cx="20" cy="46" r="3.5" fill="#ff5530" />
                <text x="32" y="50" fill="#9ea4b5" className="text-[12px] font-medium">
                  Total sales
                </text>
                <text
                  x={tooltipW - 16}
                  y="50"
                  textAnchor="end"
                  fill="#ffffff"
                  className="text-[13px] font-bold"
                >
                  {activeItem.sales.toLocaleString()}
                </text>

                {/* Target Row */}
                <circle cx="20" cy="70" r="3.5" fill="#7c6df7" />
                <text x="32" y="74" fill="#9ea4b5" className="text-[12px] font-medium">
                  Target sales
                </text>
                <text
                  x={tooltipW - 16}
                  y="74"
                  textAnchor="end"
                  fill="#ffffff"
                  className="text-[13px] font-bold"
                >
                  {activeItem.target.toLocaleString()}
                </text>
              </g>
            )}

            {/* Interactive Hit Area Columns */}
            {MONTH_DATA.map((_, idx) => {
              const x = getX(idx);
              const colW = plotW / MONTH_DATA.length;
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
            className="flex items-center justify-between text-xs mt-2 px-1"
            style={{
              paddingLeft: `${(padLeft / chartW) * 100}%`,
              paddingRight: `${(padRight / chartW) * 100}%`,
            }}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {MONTH_DATA.map((m, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`transition-all duration-150 cursor-pointer py-1 px-2 rounded-md ${
                    isActive
                      ? 'font-bold text-white scale-110 bg-[#202330]'
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
