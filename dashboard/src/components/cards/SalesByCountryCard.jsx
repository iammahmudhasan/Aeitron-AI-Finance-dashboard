import { motion, AnimatePresence } from 'framer-motion';

const TIMEFRAME_COUNTRIES = {
  Daily: [
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', count: '18' },
    { id: 'id', name: 'Indonesia', flag: '🇮🇩', count: '14' },
    { id: 'my', name: 'Malaysia', flag: '🇲🇾', count: '12' },
    { id: 'cn', name: 'China', flag: '🇨🇳', count: '9' },
    { id: 'th', name: 'Thailand', flag: '🇹🇭', count: '6' },
    { id: 'ph', name: 'Philippines', flag: '🇵🇭', count: '5' },
  ],
  Weekly: [
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', count: '142' },
    { id: 'id', name: 'Indonesia', flag: '🇮🇩', count: '118' },
    { id: 'my', name: 'Malaysia', flag: '🇲🇾', count: '98' },
    { id: 'cn', name: 'China', flag: '🇨🇳', count: '85' },
    { id: 'th', name: 'Thailand', flag: '🇹🇭', count: '64' },
    { id: 'ph', name: 'Philippines', flag: '🇵🇭', count: '48' },
  ],
  Monthly: [
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', count: '6.3K' },
    { id: 'id', name: 'Indonesia', flag: '🇮🇩', count: '5.2K' },
    { id: 'my', name: 'Malaysia', flag: '🇲🇾', count: '4.7K' },
    { id: 'cn', name: 'China', flag: '🇨🇳', count: '4.5K' },
    { id: 'th', name: 'Thailand', flag: '🇹🇭', count: '3.2K' },
    { id: 'ph', name: 'Philippines', flag: '🇵🇭', count: '2.9K' },
  ],
  Yearly: [
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', count: '74.2K' },
    { id: 'id', name: 'Indonesia', flag: '🇮🇩', count: '61.5K' },
    { id: 'my', name: 'Malaysia', flag: '🇲🇾', count: '55.8K' },
    { id: 'cn', name: 'China', flag: '🇨🇳', count: '52.1K' },
    { id: 'th', name: 'Thailand', flag: '🇹🇭', count: '38.4K' },
    { id: 'ph', name: 'Philippines', flag: '🇵🇭', count: '34.7K' },
  ],
};

export default function SalesByCountryCard({ timeframe = 'Daily' }) {
  const items = TIMEFRAME_COUNTRIES[timeframe] || TIMEFRAME_COUNTRIES.Daily;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Sales by Country
          </h3>
          <span className="text-[11px] text-text-muted font-normal">
            {timeframe} regional distribution
          </span>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3x2 Inset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c1e27] border border-[#262934] rounded-xl p-3.5 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
          >
            {/* Flag & Name */}
            <div>
              <div className="text-xl mb-1.5 leading-none select-none">
                {item.flag}
              </div>
              <div className="text-xs font-semibold text-text-secondary truncate">
                {item.name}
              </div>
            </div>

            {/* Product Count with Smooth Transition */}
            <div className="text-xs text-text-muted">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${timeframe}-${item.id}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-white mr-1 text-sm inline-block"
                >
                  {item.count}
                </motion.span>
              </AnimatePresence>
              <span>Products</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
