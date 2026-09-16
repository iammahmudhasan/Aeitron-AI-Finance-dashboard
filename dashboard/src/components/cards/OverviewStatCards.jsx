export default function OverviewStatCards() {
  const cards = [
    {
      value: '307.48K',
      label: 'Total Customer',
      change: '+30%',
      timeframe: 'This month',
      positive: true,
      cardBg: 'bg-[#eaf5fc] dark:bg-sky-950/30 border-[#d3eaf8] dark:border-sky-800/40',
      sparklineColor: '#52c480',
      // smooth green curve
      sparklinePath: 'M 4 28 C 15 28, 18 16, 28 20 C 38 24, 42 6, 52 14 C 60 20, 68 8, 76 16',
    },
    {
      value: '$30.58K',
      label: 'Total Revenue',
      change: '-15%',
      timeframe: 'This month',
      positive: false,
      cardBg: 'bg-[#eef8f1] dark:bg-emerald-950/30 border-[#d7f0df] dark:border-emerald-800/40',
      sparklineColor: '#f87171',
      // smooth red/coral curve dipping downward
      sparklinePath: 'M 4 10 C 14 10, 18 24, 28 18 C 38 12, 44 28, 54 22 C 64 16, 68 28, 76 24',
    },
    {
      value: '2.48K',
      label: 'Total Deals',
      change: '+23%',
      timeframe: 'This month',
      positive: true,
      cardBg: 'bg-[#eaf5fc] dark:bg-sky-950/30 border-[#d3eaf8] dark:border-sky-800/40',
      sparklineColor: '#52c480',
      // smooth green curve
      sparklinePath: 'M 4 26 C 14 26, 18 18, 28 22 C 38 26, 42 8, 52 16 C 60 22, 68 12, 76 14',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.cardBg} border rounded-3xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
        >
          {/* Value & Label */}
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
              {card.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {card.label}
            </div>
          </div>

          {/* Change & Sparkline */}
          <div className="flex items-end justify-between mt-6">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {card.change}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium mt-0.5">
                {card.timeframe}
              </span>
            </div>

            {/* Smooth SVG Wave Sparkline */}
            <div className="w-24 h-10 flex items-center justify-end">
              <svg
                viewBox="0 0 80 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-8 overflow-visible"
              >
                <path
                  d={card.sparklinePath}
                  stroke={card.sparklineColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
