import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMEFRAME_DATA = {
  Daily: [
    {
      id: 'revenue',
      title: 'Total Revenue',
      prefix: '$',
      value: '2,840',
      prefixColor: 'text-[#ff5530]',
      badge: '+14.2%',
      badgeType: 'positive',
      subtext: 'Today, 17 Sept 2026 (vs yesterday)',
    },
    {
      id: 'orders',
      title: 'Total Order',
      value: '64',
      badge: '+9.5%',
      badgeType: 'positive',
      subtext: 'Today, 17 Sept 2026 (vs yesterday)',
    },
    {
      id: 'customers',
      title: 'New customer',
      value: '18',
      badge: '+12.4%',
      badgeType: 'positive',
      subtext: 'Today, 17 Sept 2026 (vs yesterday)',
    },
    {
      id: 'conversion',
      title: 'Conversion rate',
      value: '3.8 %',
      badge: '+0.7%',
      badgeType: 'positive',
      subtext: 'Today, 17 Sept 2026 (vs yesterday)',
    },
  ],
  Weekly: [
    {
      id: 'revenue',
      title: 'Total Revenue',
      prefix: '$',
      value: '14,650',
      prefixColor: 'text-[#ff5530]',
      badge: '+10.8%',
      badgeType: 'positive',
      subtext: 'Past 7 Days (11 Sept – 17 Sept, 2026)',
    },
    {
      id: 'orders',
      title: 'Total Order',
      value: '420',
      badge: '+6.4%',
      badgeType: 'positive',
      subtext: 'Past 7 Days (11 Sept – 17 Sept, 2026)',
    },
    {
      id: 'customers',
      title: 'New customer',
      value: '95',
      badge: '-1.8%',
      badgeType: 'negative',
      subtext: 'Past 7 Days (11 Sept – 17 Sept, 2026)',
    },
    {
      id: 'conversion',
      title: 'Conversion rate',
      value: '3.5 %',
      badge: '+1.4%',
      badgeType: 'positive',
      subtext: 'Past 7 Days (11 Sept – 17 Sept, 2026)',
    },
  ],
  Monthly: [
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
  ],
  Yearly: [
    {
      id: 'revenue',
      title: 'Total Revenue',
      prefix: '$',
      value: '298,400',
      prefixColor: 'text-[#ff5530]',
      badge: '+34.2%',
      badgeType: 'positive',
      subtext: 'Full Year YTD (Jan 01 – Sept 17, 2026)',
    },
    {
      id: 'orders',
      title: 'Total Order',
      value: '15,620',
      badge: '+24.1%',
      badgeType: 'positive',
      subtext: 'Full Year YTD (Jan 01 – Sept 17, 2026)',
    },
    {
      id: 'customers',
      title: 'New customer',
      value: '3,950',
      badge: '+19.6%',
      badgeType: 'positive',
      subtext: 'Full Year YTD (Jan 01 – Sept 17, 2026)',
    },
    {
      id: 'conversion',
      title: 'Conversion rate',
      value: '3.6 %',
      badge: '+1.9%',
      badgeType: 'positive',
      subtext: 'Full Year YTD (Jan 01 – Sept 17, 2026)',
    },
  ],
};

export default function MetricFlowKpiCards({ timeframe = 'Daily' }) {
  const cards = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA.Daily;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:border-border/90 transition-all flex flex-col justify-between"
        >
          {/* Top Title & Growth Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-medium text-text-muted">
              {card.title}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${timeframe}-${card.id}-badge`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Big Bold Metric */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${timeframe}-${card.id}-value`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3"
            >
              {card.prefix && (
                <span className={`${card.prefixColor || 'text-white'} mr-1.5`}>
                  {card.prefix}
                </span>
              )}
              <span>{card.value}</span>
            </motion.div>
          </AnimatePresence>

          {/* Subtext Date Range */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${timeframe}-${card.id}-sub`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-normal text-text-muted/80 tracking-normal"
            >
              {card.subtext}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
