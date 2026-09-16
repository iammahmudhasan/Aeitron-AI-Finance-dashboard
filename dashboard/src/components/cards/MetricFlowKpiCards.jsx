import { TrendingUp, TrendingDown } from 'lucide-react';

const CARDS_DATA = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    prefix: '$',
    value: '24,500',
    prefixColor: 'text-[#ff5530]',
    badge: '+12.5%',
    badgeType: 'positive',
    subtext: 'From Jun 01,2024 To Jun 29, 2024',
  },
  {
    id: 'orders',
    title: 'Total Order',
    value: '1,240',
    badge: '+8.2%',
    badgeType: 'positive',
    subtext: 'From Jun 01,2024 To Jun 29, 2024',
  },
  {
    id: 'customers',
    title: 'New customer',
    value: '320',
    badge: '-4.3%',
    badgeType: 'negative',
    subtext: 'From Jun 01,2024 To Jun 29, 2024',
  },
  {
    id: 'conversion',
    title: 'Conversion rate',
    value: '3.2 %',
    badge: '+2.1%',
    badgeType: 'positive',
    subtext: 'From Jun 01,2024 To Jun 29, 2024',
  },
];

export default function MetricFlowKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS_DATA.map((card) => (
        <div
          key={card.id}
          className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:border-border/90 transition-all flex flex-col justify-between"
        >
          {/* Top Title & Growth Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-medium text-text-muted">
              {card.title}
            </span>
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                card.badgeType === 'positive'
                  ? 'bg-[#1f2038] text-[#818cf8] border-[#2c2f52]'
                  : 'bg-[#341d24] text-[#f87171] border-[#4b242e]'
              }`}
            >
              {card.badgeType === 'positive' ? (
                <TrendingUp size={11} className="stroke-[2.5]" />
              ) : (
                <TrendingDown size={11} className="stroke-[2.5]" />
              )}
              <span>{card.badge}</span>
            </div>
          </div>

          {/* Big Bold Metric */}
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {card.prefix && (
              <span className={`${card.prefixColor || 'text-white'} mr-1.5`}>
                {card.prefix}
              </span>
            )}
            <span>{card.value}</span>
          </div>

          {/* Subtext Date Range */}
          <div className="text-[11px] font-normal text-text-muted/80 tracking-normal">
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
