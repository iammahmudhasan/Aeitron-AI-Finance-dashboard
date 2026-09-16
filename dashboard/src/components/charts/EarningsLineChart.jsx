import { useState } from 'react';

const MONTHS = [
  { month: 'JAN', firstHalf: 82, topGross: 32, labelVal: '$85.20K', year: 'JAN 2024' },
  { month: 'FEB', firstHalf: 85, topGross: 52, labelVal: '$124.50K', year: 'FEB 2024' },
  { month: 'MAR', firstHalf: 88, topGross: 98, labelVal: '$198.40K', year: 'MAR 2024' },
  { month: 'APR', firstHalf: 78, topGross: 152, labelVal: '$264.10K', year: 'APR 2024' },
  { month: 'MAY', firstHalf: 112, topGross: 165, labelVal: '$295.80K', year: 'MAY 2024' },
  { month: 'JUN', firstHalf: 75, topGross: 115, labelVal: '$307.48K', year: 'JUNE 2024' },
  { month: 'JUL', firstHalf: 62, topGross: 92, labelVal: '$210.30K', year: 'JULY 2024' },
  { month: 'AUG', firstHalf: 64, topGross: 68, labelVal: '$178.60K', year: 'AUG 2024' },
  { month: 'SEP', firstHalf: 48, topGross: 40, labelVal: '$112.40K', year: 'SEPT 2024' },
  { month: 'OCT', firstHalf: 76, topGross: 92, labelVal: '$189.50K', year: 'OCT 2024' },
  { month: 'NOV', firstHalf: 65, topGross: 84, labelVal: '$204.10K', year: 'NOV 2024' },
  { month: 'DEC', firstHalf: 70, topGross: 88, labelVal: '$245.90K', year: 'DEC 2024' },
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

export default function EarningsLineChart() {
  const [activeIdx, setActiveIdx] = useState(5); // Default to JUN (index 5) matching screenshot!

  const yTicks = [200, 150, 100, 50, 0];
  const chartW = 920;
  const chartH = 260;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 30;
  const padBottom = 30;

  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const getY = (val) => padTop + plotH - (val / 200) * plotH;
  const getX = (idx) => padLeft + (idx / (MONTHS.length - 1)) * plotW;

  const firstHalfPoints = MONTHS.map((m, idx) => ({ x: getX(idx), y: getY(m.firstHalf) }));
  const topGrossPoints = MONTHS.map((m, idx) => ({ x: getX(idx), y: getY(m.topGross) }));

  const firstHalfPath = getSmoothPath(firstHalfPoints);
  const topGrossPath = getSmoothPath(topGrossPoints);

  const activePoint = topGrossPoints[activeIdx];
  const activeData = MONTHS[activeIdx];

  const tooltipW = 126;
  const tooltipH = 46;
  const minTooltipX = padLeft - 6; // 39px -> safe gap from Y-axis labels
  const maxTooltipX = chartW - padRight - tooltipW + 6; // 775px -> safe gap from right edge
  const tooltipX = activePoint ? Math.max(minTooltipX, Math.min(maxTooltipX, activePoint.x - tooltipW / 2)) : 0;
  const tooltipY = activePoint ? Math.max(6, activePoint.y - tooltipH - 12) : 0;
  const arrowX = activePoint ? Math.max(tooltipX + 14, Math.min(tooltipX + tooltipW - 14, activePoint.x)) : 0;

  return (
    <div className="bg-bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Header with Title and Legend */}
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-lg font-bold text-text">Earnings</h3>

        <div className="flex items-center gap-5 text-xs font-semibold">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#52c480] inline-block" />
            <span>First half</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5b587b] inline-block" />
            <span>Top Gross</span>
          </div>
        </div>
      </div>

      {/* SVG Line Chart Canvas */}
      <div className="relative w-full overflow-x-auto custom-scrollbar select-none">
        <div className="min-w-[680px]">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto block"
          >
            {/* Horizontal Dashed Guidelines & Y-Axis Labels */}
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

            {/* Smooth Green Curve (First half) */}
            <path
              d={firstHalfPath}
              fill="none"
              stroke="#52c480"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Smooth Purple/Slate Curve (Top Gross) */}
            <path
              d={topGrossPath}
              fill="none"
              stroke="#5b587b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Active Month Vertical Guide Line */}
            {activePoint && (
              <line
                x1={activePoint.x}
                y1={activePoint.y}
                x2={activePoint.x}
                y2={getY(0)}
                stroke="var(--color-text-muted)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
            )}

            {/* Active Month Dot on Curve */}
            {activePoint && (
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill="var(--color-bg-card)"
                stroke="#5b587b"
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
            )}

            {/* Floating Black Tooltip Card with Edge Clamping & Pointer Arrow */}
            {activePoint && (
              <g
                transform={`translate(${tooltipX}, ${tooltipY})`}
                className="transition-transform duration-150 pointer-events-none drop-shadow-xl"
              >
                {/* Tooltip Background Card */}
                <rect
                  width={tooltipW}
                  height={tooltipH}
                  rx="10"
                  fill="#0f172a"
                />
                {/* Tooltip Downward Pointer Arrow */}
                <polygon
                  points={`${arrowX - tooltipX - 5},${tooltipH - 0.5} ${arrowX - tooltipX + 5},${tooltipH - 0.5} ${arrowX - tooltipX},${tooltipH + 6}`}
                  fill="#0f172a"
                />
                {/* Value Text */}
                <text
                  x={tooltipW / 2}
                  y="20"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-bold text-[13px] tracking-tight"
                >
                  {activeData.labelVal}
                </text>
                {/* Subtitle / Date */}
                <text
                  x={tooltipW / 2}
                  y="34"
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="font-semibold text-[9px] uppercase tracking-wider"
                >
                  {activeData.year}
                </text>
              </g>
            )}

            {/* Interactive Hit Areas for Hovering/Clicking on Month Columns */}
            {MONTHS.map((_, idx) => {
              const x = getX(idx);
              const colW = plotW / MONTHS.length;
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
                  onClick={() => setActiveIdx(idx)}
                />
              );
            })}
          </svg>

          {/* Bottom X-Axis Month Labels */}
          <div
            className="flex items-center justify-between text-xs mt-2 px-1"
            style={{
              paddingLeft: `${(padLeft / chartW) * 100}%`,
              paddingRight: `${(padRight / chartW) * 100}%`,
            }}
          >
            {MONTHS.map((m, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                  className={`transition-all duration-150 cursor-pointer py-1 px-1.5 rounded-md ${
                    isActive
                      ? 'font-bold scale-105'
                      : 'font-medium hover:opacity-80'
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
