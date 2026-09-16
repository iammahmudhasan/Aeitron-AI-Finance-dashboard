import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];

// Heatmap intensity matrix [hourIndex][dayIndex]:
// 0: <200 (dark gray)
// 1: 200 - 500 (deep muted brick)
// 2: 500 - 1000 (hatched medium coral)
// 3: 1000 - 2000 (hatched bright coral)
// 4: >2000 (solid fiery coral #ff5530)
const HEATMAP_DATA = [
  // 9 am
  [0, 0, 0, 0, 0, 0, 0],
  // 10 am
  [0, 0, 0, 1, 0, 0, 0],
  // 11 am
  [0, 1, 2, 3, 2, 1, 0],
  // 12 pm
  [0, 2, 4, 4, 4, 2, 0],
  // 1 pm
  [1, 2, 3, 4, 3, 2, 0],
  // 2 pm
  [0, 1, 2, 3, 2, 1, 0],
  // 3 pm
  [0, 0, 0, 1, 0, 0, 0],
];

// Exact mock order counts corresponding to each cell for interactive tooltips:
const ORDER_COUNTS = [
  [45, 68, 92, 110, 85, 40, 32],
  [82, 120, 165, 340, 195, 88, 54],
  [145, 390, 820, 1450, 780, 280, 95],
  [190, 940, 2450, 2680, 2340, 890, 140],
  [260, 680, 1280, 2190, 1420, 710, 115],
  [110, 310, 750, 1180, 810, 260, 70],
  [50, 85, 140, 390, 160, 65, 42],
];

export default function OrdersByTimeHeatmap() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getCellClasses = (tier) => {
    switch (tier) {
      case 4:
        return 'bg-[#ff5530] text-white shadow-[0_0_12px_rgba(255,85,48,0.4)] border border-[#ff6e4d]';
      case 3:
        return 'bg-[#c93f24] border border-[#e04f32] bg-[radial-gradient(#ff6e4d_1px,transparent_1px)] [background-size:6px_6px]';
      case 2:
        return 'border border-[#993422] bg-[repeating-linear-gradient(45deg,#b83921,#b83921_2px,#421d1b_2px,#421d1b_6px)]';
      case 1:
        return 'border border-[#612420] bg-[repeating-linear-gradient(45deg,#782821,#782821_2px,#26191b_2px,#26191b_6px)]';
      default:
        return 'bg-[#20222a] border border-[#272a35]/60 hover:border-[#3a3f50]';
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full relative">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="text-base font-bold text-white tracking-tight">Orders by time</h3>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5c2420]" />
            <span>200&gt;</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#8e2e21]" />
            <span>500&gt;</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#c93f24]" />
            <span>1,000&gt;</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ff5530] shadow-[0_0_6px_rgba(255,85,48,0.5)]" />
            <span>2,000&gt;</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="w-full overflow-x-auto select-none">
        <div className="min-w-[340px]">
          <div className="grid grid-cols-8 gap-2 items-center">
            {/* Empty top-left cell */}
            <div />
            {/* Days Header Row */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-semibold text-text-muted py-1"
              >
                {day}
              </div>
            ))}

            {/* Matrix Rows (Hour + 7 day cells) */}
            {HOURS.map((hour, hIdx) => (
              <div key={hour} className="contents">
                {/* Hour Label */}
                <div className="text-right text-[11px] font-medium text-text-muted pr-2 whitespace-nowrap">
                  {hour}
                </div>

                {/* 7 Cells */}
                {DAYS.map((day, dIdx) => {
                  const tier = HEATMAP_DATA[hIdx][dIdx];
                  const count = ORDER_COUNTS[hIdx][dIdx];
                  const isHovered =
                    hoveredCell && hoveredCell.h === hIdx && hoveredCell.d === dIdx;

                  return (
                    <div
                      key={day}
                      onMouseEnter={() => setHoveredCell({ h: hIdx, d: dIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-8 sm:h-9 rounded-lg transition-all duration-150 cursor-pointer relative flex items-center justify-center ${getCellClasses(
                        tier
                      )} ${isHovered ? 'scale-110 ring-2 ring-white/60 z-20' : ''}`}
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0c0d12] border border-[#2a2d3d] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-2xl pointer-events-none whitespace-nowrap z-30">
                          {count.toLocaleString()} orders ({day}, {hour})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
        <span>Peak activity: Wed – Fri (12:00 PM)</span>
        <span className="text-[#ff5530] font-semibold">2,680 peak / hr</span>
      </div>
    </div>
  );
}
