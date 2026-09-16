import { useState, useRef, useEffect } from 'react';
import { Info, Sparkles, ChevronDown, MoreHorizontal, CheckCircle2, ArrowRight, X, Download, RefreshCw, Check } from 'lucide-react';

const CATEGORY_BARS = [
  { day: '1 JAN', height: 45, dark: true },
  { day: '4 JAN', height: 75, dark: false },
  { day: '7 JAN', height: 50, dark: true },
  { day: '10 JAN', height: 90, dark: false },
  { day: '13 JAN', height: 60, dark: true },
  { day: '16 JAN', height: 35, dark: false },
  { day: '19 JAN', height: 70, dark: true },
  { day: '22 JAN', height: 85, dark: false },
  { day: '25 JAN', height: 40, dark: true },
  { day: '28 JAN', height: 80, dark: false },
  { day: '30 JAN', height: 65, dark: true },
];

const DATE_RANGE_OPTIONS = [
  { label: 'Jan 1 - Aug 30', revenue: '$20,320', multiplier: 1 },
  { label: 'Last 30 Days', revenue: '$7,840', multiplier: 0.4 },
  { label: 'Last 90 Days', revenue: '$14,250', multiplier: 0.7 },
  { label: 'Year to Date', revenue: '$20,320', multiplier: 1 },
  { label: 'Last Quarter (Q2)', revenue: '$18,900', multiplier: 0.9 },
  { label: 'Full Year (2025)', revenue: '$42,500', multiplier: 1.4 },
];

export default function RevenueBreakdownCard() {
  const [showAiModal, setShowAiModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dateRange, setDateRange] = useState('Jan 1 - Aug 30');
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dateRangeRef = useRef(null);

  const currentOption = DATE_RANGE_OPTIONS.find((o) => o.label === dateRange) || DATE_RANGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setDateRangeOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setDateRangeOpen(false);
      }
    }
    if (menuOpen || dateRangeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, dateRangeOpen]);

  const handleExportCsv = () => {
    const rows = [
      ['Date', 'Revenue ($)', 'Tier'],
      ...CATEGORY_BARS.map((b) => [
        b.day,
        Math.round(b.height * 240 * (currentOption.multiplier || 1)),
        b.dark ? 'Direct Enterprise' : 'Inbound Platform',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Revenue_Breakdown_${dateRange.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpen(false);
  };

  const handleTriggerAiInsight = () => {
    setShowAiModal(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 700);
  };

  return (
    <div className="bg-bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative">
      {/* Header */}
      <div className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between relative" ref={menuRef}>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-text uppercase tracking-wider">
              REVENUE BREAKDOWN
            </span>
            <Info size={13} className="text-text-muted/60" />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              menuOpen ? 'bg-bg border-accent text-accent' : 'text-text-muted hover:text-text hover:bg-bg border-transparent'
            }`}
            title="Options"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-card border border-border shadow-2xl rounded-2xl p-1.5 z-50 animate-fade-in text-xs">
              <button
                type="button"
                onClick={handleExportCsv}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-text hover:bg-bg rounded-xl transition-colors text-left"
              >
                <Download size={13} className="text-accent" />
                <span>Export Breakdown CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleTriggerAiInsight();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-text hover:bg-bg rounded-xl transition-colors text-left"
              >
                <Sparkles size={13} className="text-accent" />
                <span>Get AI Insight</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-[11px] text-text-muted">Revenue by Category</div>
            <div className="text-xl font-bold text-text tracking-tight">{currentOption.revenue}</div>
          </div>

          {/* Date range picker button & dropdown */}
          <div className="relative" ref={dateRangeRef}>
            <button
              type="button"
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg border rounded-xl text-xs font-medium cursor-pointer transition-all ${
                dateRangeOpen
                  ? 'border-accent text-accent ring-2 ring-accent/15'
                  : 'border-border text-text hover:bg-bg-hover hover:border-border/80'
              }`}
              title="Select Date Range"
            >
              <span>{dateRange}</span>
              <ChevronDown
                size={13}
                className={`text-text-muted transition-transform duration-200 ${
                  dateRangeOpen ? 'rotate-180 text-accent' : ''
                }`}
              />
            </button>

            {dateRangeOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-bg-card border border-border shadow-2xl rounded-2xl p-1.5 z-50 animate-fade-in text-xs space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border/50 mb-1">
                  Select Range
                </div>
                {DATE_RANGE_OPTIONS.map((option) => {
                  const isSelected = dateRange === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setDateRange(option.label);
                        setDateRangeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-text hover:bg-bg'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check size={13} className="text-accent shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insight Action Banner */}
      <div className="my-3.5">
        <button
          type="button"
          onClick={handleTriggerAiInsight}
          className="w-full flex items-center justify-between p-2.5 px-3 bg-gradient-to-r from-accent/10 via-purple-500/10 to-indigo-500/10 hover:from-accent/20 hover:to-indigo-500/20 border border-accent/20 rounded-xl text-xs font-semibold text-text transition-all group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent group-hover:rotate-12 transition-transform" />
            <span>Get AI insight for better analysis</span>
          </div>
          <span className="text-accent text-[11px] font-bold group-hover:translate-x-0.5 transition-transform">
            ⊕
          </span>
        </button>
      </div>

      {/* Vertical Comparison Bar Chart */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-1.5 px-2 relative">
          {/* Horizontal guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-border/30 w-full" />
            <div className="border-b border-border/30 w-full" />
            <div className="border-b border-border/30 w-full" />
            <div className="border-b border-border/30 w-full" />
          </div>

          {CATEGORY_BARS.map((bar, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer z-10"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                {bar.day}: ${Math.round(bar.height * 240 * (currentOption.multiplier || 1)).toLocaleString()}
              </div>

              {/* Bar line */}
              <div
                className={`w-1.5 sm:w-2 rounded-t-full transition-all duration-300 group-hover:w-2.5 ${
                  bar.dark
                    ? 'bg-slate-900 dark:bg-white'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
                style={{ height: `${Math.min(95, Math.max(12, Math.round(bar.height * (currentOption.multiplier || 1))))}%` }}
              />
            </div>
          ))}
        </div>

        {/* Timeline Bottom Labels */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-text-muted mt-2 px-1 uppercase tracking-wider">
          <span>1 JAN</span>
          <span className="hidden sm:inline">15 JAN</span>
          <span>30 JAN 2025</span>
        </div>
      </div>

      {/* AI Insight Dialog Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Aeitron AI Financial Reasoning</h3>
                  <p className="text-[11px] text-text-muted">Instant revenue cohort & category analysis</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            {analyzing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-muted">Analyzing customer velocity and category margins...</span>
              </div>
            ) : (
              <div className="py-4 space-y-3 text-xs">
                <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-1">
                  <span className="font-semibold text-accent block text-xs">Top Category Driver</span>
                  <p className="text-text leading-relaxed">
                    AI Automation & Ergonomic Hardware subscriptions accounted for <strong>68.4%</strong> of total inflow ($13,890).
                  </p>
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-xs">
                    Growth Recommendation
                  </span>
                  <p className="text-text leading-relaxed">
                    Customer repeat orders in the 3rd week of January increased by <strong>14.2%</strong>. Transitioning these buyers to recurring retainer billing will boost monthly recurring revenue (MRR) by ~$4,200.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    Apply Recommendations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
