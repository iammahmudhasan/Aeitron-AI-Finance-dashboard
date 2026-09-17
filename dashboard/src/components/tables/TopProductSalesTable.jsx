import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMEFRAME_PRODUCTS = {
  Daily: [
    { id: 1, name: 'MagStand Pro 1', revenue: '$980', sales: '34', growth: '28%', growthType: 'positive', reviews: '18', views: '142' },
    { id: 2, name: 'MagStand Pro 2', revenue: '$640', sales: '22', growth: '19%', growthType: 'positive', reviews: '12', views: '98' },
    { id: 3, name: 'MagStand Pro 3', revenue: '$480', sales: '15', growth: '12%', growthType: 'positive', reviews: '7', views: '65' },
    { id: 4, name: 'MagStand Pro 4', revenue: '$320', sales: '9', growth: '5%', growthType: 'negative', reviews: '4', views: '41' },
  ],
  Weekly: [
    { id: 1, name: 'MagStand Pro 1', revenue: '$6,240', sales: '215', growth: '30%', growthType: 'positive', reviews: '94', views: '480' },
    { id: 2, name: 'MagStand Pro 2', revenue: '$4,120', sales: '152', growth: '24%', growthType: 'positive', reviews: '72', views: '390' },
    { id: 3, name: 'MagStand Pro 3', revenue: '$3,180', sales: '102', growth: '14%', growthType: 'positive', reviews: '46', views: '260' },
    { id: 4, name: 'MagStand Pro 4', revenue: '$2,450', sales: '68', growth: '8%', growthType: 'negative', reviews: '28', views: '170' },
  ],
  Monthly: [
    { id: 1, name: 'MagStand Pro 1', revenue: '$24,500', sales: '846', growth: '32%', growthType: 'positive', reviews: '570', views: '978' },
    { id: 2, name: 'MagStand Pro 2', revenue: '$16,300', sales: '598', growth: '26%', growthType: 'positive', reviews: '385', views: '945' },
    { id: 3, name: 'MagStand Pro 3', revenue: '$12,980', sales: '389', growth: '13%', growthType: 'positive', reviews: '127', views: '437' },
    { id: 4, name: 'MagStand Pro 4', revenue: '$10,984', sales: '265', growth: '11%', growthType: 'negative', reviews: '190', views: '265' },
  ],
  Yearly: [
    { id: 1, name: 'MagStand Pro 1', revenue: '$294,000', sales: '10,150', growth: '38%', growthType: 'positive', reviews: '4,820', views: '14,200' },
    { id: 2, name: 'MagStand Pro 2', revenue: '$195,600', sales: '7,180', growth: '31%', growthType: 'positive', reviews: '3,410', views: '11,400' },
    { id: 3, name: 'MagStand Pro 3', revenue: '$155,700', sales: '4,670', growth: '22%', growthType: 'positive', reviews: '1,950', views: '6,800' },
    { id: 4, name: 'MagStand Pro 4', revenue: '$131,800', sales: '3,180', growth: '17%', growthType: 'positive', reviews: '1,640', views: '4,900' },
  ],
};

export default function TopProductSalesTable({ timeframe = 'Daily' }) {
  const products = TIMEFRAME_PRODUCTS[timeframe] || TIMEFRAME_PRODUCTS.Daily;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Top Product Sales
          </h3>
          <span className="text-[11px] text-text-muted font-normal">
            {timeframe} catalog revenue
          </span>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border/40 text-[10px] font-bold text-text-muted uppercase tracking-wider">
              <th className="pb-3 font-semibold">PRODUCT</th>
              <th className="pb-3 text-right font-semibold">REVENUE</th>
              <th className="pb-3 text-right font-semibold">SALES</th>
              <th className="pb-3 text-center font-semibold">GROWTH</th>
              <th className="pb-3 text-right font-semibold">REVIEWS</th>
              <th className="pb-3 text-right font-semibold">VIEWS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 text-xs">
            {products.map((prod) => (
              <tr
                key={prod.id}
                className="hover:bg-[#1f222d]/50 transition-colors group cursor-pointer"
              >
                {/* Product Name */}
                <td className="py-3.5 font-semibold text-white group-hover:text-accent transition-colors">
                  {prod.name}
                </td>

                {/* Revenue */}
                <td className="py-3.5 text-right font-medium text-white/90">
                  {prod.revenue}
                </td>

                {/* Sales */}
                <td className="py-3.5 text-right text-text-secondary font-medium">
                  {prod.sales}
                </td>

                {/* Growth Badge */}
                <td className="py-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold text-[11px] ${
                      prod.growthType === 'positive'
                        ? 'text-[#818cf8]'
                        : 'text-[#f87171]'
                    }`}
                  >
                    {prod.growthType === 'positive' ? (
                      <TrendingUp size={11} className="stroke-[2.5]" />
                    ) : (
                      <TrendingDown size={11} className="stroke-[2.5]" />
                    )}
                    <span>{prod.growth}</span>
                  </span>
                </td>

                {/* Reviews */}
                <td className="py-3.5 text-right text-text-muted font-medium">
                  {prod.reviews}
                </td>

                {/* Views */}
                <td className="py-3.5 text-right text-text-muted font-medium">
                  {prod.views}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
