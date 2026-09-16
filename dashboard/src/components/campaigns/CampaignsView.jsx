import { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Send,
  Mail,
  Users,
  CalendarCheck,
  TrendingUp,
  Play,
  Pause,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  {
    id: 'camp_1',
    name: 'Dental Clinics AI Receptionist Outbound',
    niche: 'Healthcare & Dentistry',
    channel: 'Cold Email + LinkedIn',
    status: 'Running',
    leadsCount: 450,
    sentCount: 412,
    openRate: '68.4%',
    replyRate: '14.2%',
    bookedDemos: 18,
    pipelineValue: 54000,
  },
  {
    id: 'camp_2',
    name: 'Real Estate Lead Nurturing Bot Sequence',
    niche: 'Commercial Real Estate',
    channel: 'Email + SMS Multi-Touch',
    status: 'Running',
    leadsCount: 600,
    sentCount: 580,
    openRate: '72.1%',
    replyRate: '19.5%',
    bookedDemos: 24,
    pipelineValue: 86400,
  },
  {
    id: 'camp_3',
    name: 'E-Commerce Return Bot Q4 Sequence',
    niche: 'Shopify Direct-to-Consumer',
    channel: 'Cold Email (Instantly.ai)',
    status: 'Completed',
    leadsCount: 350,
    sentCount: 350,
    openRate: '61.0%',
    replyRate: '11.8%',
    bookedDemos: 12,
    pipelineValue: 28800,
  },
  {
    id: 'camp_4',
    name: 'Law Firms Intake Automation Sprint',
    niche: 'Personal Injury Law Firms',
    channel: 'LinkedIn InMail + Email',
    status: 'Running',
    leadsCount: 200,
    sentCount: 140,
    openRate: '74.5%',
    replyRate: '22.0%',
    bookedDemos: 9,
    pipelineValue: 45000,
  },
];

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const stored = localStorage.getItem('aeitron_campaigns');
      return stored ? JSON.parse(stored) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('Dental Clinics');
  const [channel, setChannel] = useState('Cold Email + LinkedIn');
  const [leadsCount, setLeadsCount] = useState(250);

  const saveCampaigns = (updated) => {
    setCampaigns(updated);
    try {
      localStorage.setItem('aeitron_campaigns', JSON.stringify(updated));
    } catch {}
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newCamp = {
      id: `camp_${Date.now()}`,
      name,
      niche,
      channel,
      status: 'Running',
      leadsCount: Number(leadsCount),
      sentCount: 0,
      openRate: '0%',
      replyRate: '0%',
      bookedDemos: 0,
      pipelineValue: Number(leadsCount) * 120,
    };

    saveCampaigns([newCamp, ...campaigns]);
    setModalOpen(false);
    setName('');
  };

  const toggleStatus = (id) => {
    const updated = campaigns.map((c) =>
      c.id === id
        ? { ...c, status: c.status === 'Running' ? 'Paused' : 'Running' }
        : c
    );
    saveCampaigns(updated);
  };

  const totalDemos = campaigns.reduce((sum, c) => sum + (c.bookedDemos || 0), 0);
  const totalPipeline = campaigns.reduce((sum, c) => sum + (c.pipelineValue || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsCount || 0), 0);

  const filtered = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <Megaphone className="text-accent" size={24} />
            Outbound Growth & Client Acquisition Campaigns
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Automated multi-channel outreach engine driving qualified agency client discovery calls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus size={15} />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Targeted Prospects
          </span>
          <div className="text-2xl font-bold text-text mt-1">{totalLeads.toLocaleString()} Leads</div>
          <span className="text-[11px] text-text-muted font-medium">Scraped & enriched</span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Average Reply Rate
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">16.8%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +4.2% vs industry avg
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Discovery Calls Booked
          </span>
          <div className="text-2xl font-bold text-accent mt-1">{totalDemos} Demos</div>
          <span className="text-[11px] text-accent font-medium">Direct to calendar</span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Estimated Deal Pipeline
          </span>
          <div className="text-2xl font-bold text-text mt-1">${totalPipeline.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active sales opportunities
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-60 focus:border-accent"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((camp) => {
          const isRunning = camp.status === 'Running';
          const progress = Math.round((camp.sentCount / (camp.leadsCount || 1)) * 100);

          return (
            <div
              key={camp.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-wider block">
                      {camp.niche}
                    </span>
                    <h3 className="text-base font-bold text-text tracking-tight mt-0.5">
                      {camp.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isRunning
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : 'bg-slate-500/15 text-slate-500 border-slate-500/25'
                      }`}
                    >
                      {camp.status}
                    </span>

                    {camp.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(camp.id)}
                        className="p-1.5 rounded-lg border border-border hover:bg-bg text-text-muted hover:text-text transition-colors"
                        title={isRunning ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {isRunning ? <Pause size={12} /> : <Play size={12} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-text-muted mb-4 font-medium flex items-center gap-1.5">
                  <Mail size={13} />
                  <span>Channel: {camp.channel}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                    <span>
                      Delivery: {camp.sentCount} / {camp.leadsCount} sent
                    </span>
                    <span className="font-bold text-text">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden border border-border/40">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 bg-bg/50 p-3 rounded-xl border border-border/50 text-center mb-4">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Open Rate</span>
                    <span className="font-bold text-text text-sm">{camp.openRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Reply Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{camp.replyRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Demos Booked</span>
                    <span className="font-bold text-accent text-sm">{camp.bookedDemos}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-text-muted text-[11px]">Pipeline Value Added:</span>
                <span className="font-bold text-text font-mono">${camp.pipelineValue.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Campaign Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Launch Client Acquisition Campaign</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MedSpa Voice Bot Cold Sequence"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Target Niche</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aesthetics & Dermatology"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Outreach Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  >
                    <option value="Cold Email + LinkedIn">Cold Email + LinkedIn</option>
                    <option value="Email (Instantly.ai)">Email (Instantly.ai)</option>
                    <option value="WhatsApp Outbound">WhatsApp Outbound</option>
                    <option value="Multi-Touch Omnichannel">Multi-Touch Omnichannel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1 font-medium">Prospects Count</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={leadsCount}
                    onChange={(e) => setLeadsCount(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-text hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-semibold"
                >
                  Start Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
