import { useState, useEffect } from 'react';
import { Kanban, Plus, DollarSign, ArrowRight, ArrowLeft, Building, User, CheckCircle2, TrendingUp } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useClients } from '../../context/ClientContext';
import { useProjectTask } from '../../context/ProjectTaskContext';

const STAGES = [
  { id: 'lead', title: 'Lead Inbound', color: 'border-slate-500/30 text-slate-400' },
  { id: 'qualified', title: 'Qualified Fit', color: 'border-indigo-500/30 text-indigo-400' },
  { id: 'proposal', title: 'Proposal Sent', color: 'border-amber-500/30 text-amber-400' },
  { id: 'negotiation', title: 'Negotiation', color: 'border-purple-500/30 text-purple-400' },
  { id: 'won', title: 'Won / Client 🎉', color: 'border-emerald-500/30 text-emerald-400' },
  { id: 'lost', title: 'Archived / Lost', color: 'border-rose-500/30 text-rose-400' },
];

const INITIAL_DEALS = [
  { id: 'deal-1', name: 'Nova Logistics AI Customer Bot', client: 'Nova Freight', company: 'Aeitron AI', value: 16500, stage: 'proposal', source: 'Referral', rep: 'Salung Prastyo' },
  { id: 'deal-2', name: 'Craftly Brand System & SaaS UI', client: 'Pulse Medtech', company: 'Craftly', value: 12500, stage: 'negotiation', source: 'Inbound', rep: 'Mahmud Hasan' },
  { id: 'deal-3', name: 'Enterprise Document Vector Pipeline', client: 'Apex Legal Group', company: 'Aeitron AI', value: 24000, stage: 'qualified', source: 'Cold Outreach', rep: 'Alex Rivera' },
  { id: 'deal-4', name: 'Autonomous Outreach Engine', client: 'ScaleFlow Marketing', company: 'Aeitron AI', value: 18000, stage: 'won', source: 'Inbound', rep: 'Salung Prastyo' },
  { id: 'deal-5', name: 'Shopify Plus Custom App', client: 'Glow Retail', company: 'Craftly', value: 9500, stage: 'lead', source: 'Referral', rep: 'Salung Prastyo' },
];

export default function CrmPipelineView() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const { filterByCompany } = useCompany();
  const { addClient } = useClients?.() || {};
  const { addProject } = useProjectTask?.() || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    client: '',
    company: 'Aeitron AI',
    value: '',
    source: 'Inbound',
    rep: 'Salung Prastyo',
  });

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener('open-new-deal-modal', handler);
    return () => window.removeEventListener('open-new-deal-modal', handler);
  }, []);

  const filteredDeals = filterByCompany(deals);

  const moveStage = (dealId, nextStageId) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          // If won, trigger Client creation
          if (nextStageId === 'won' && d.stage !== 'won') {
            addClient?.({
              name: d.client,
              company: d.client,
              email: `contact@${d.client.toLowerCase().replace(/\s+/g, '')}.com`,
              status: 'active',
              tier: 'Enterprise',
            });
            addProject?.({
              name: d.name,
              clientName: d.client,
              company: d.company,
              stage: 'scoping',
              budget: d.value,
              deadline: '2026-10-31',
              team: [d.rep],
            });
          }
          return { ...d, stage: nextStageId };
        }
        return d;
      })
    );
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    const newDeal = {
      id: `deal-${Date.now()}`,
      stage: 'lead',
      ...form,
      value: Number(form.value) || 10000,
    };
    setDeals([newDeal, ...deals]);
    setModalOpen(false);
    setForm({ name: '', client: '', company: 'Aeitron AI', value: '', source: 'Inbound', rep: 'Salung Prastyo' });
  };

  const totalPipelineValue = filteredDeals.reduce((acc, d) => (d.stage !== 'lost' ? acc + d.value : acc), 0);
  const wonValue = filteredDeals.filter((d) => d.stage === 'won').reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">CRM & Sales Pipeline</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              Kanban Funnel
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track deals from first contact through scoping to closed client agreements
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-10 flex items-center gap-2 px-5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Pipeline Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Active Pipeline Value</span>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
            ${totalPipelineValue.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <span className="text-[11px] text-indigo-400 mt-1 block">In negotiation and proposal stages</span>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Total Closed Won</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
            ${wonValue.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Converted into active delivery projects</span>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Average Deal Size</span>
          <div className="text-2xl sm:text-3xl font-bold text-accent mt-1">
            ${Math.round(totalPipelineValue / (filteredDeals.length || 1)).toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">Enterprise retainers and setup fees</span>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 items-start overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colDeals = filteredDeals.filter((d) => d.stage === col.id);
          const colVal = colDeals.reduce((a, b) => a + b.value, 0);

          return (
            <div
              key={col.id}
              className="bg-[#14161f] border border-border/80 rounded-2xl p-3.5 flex flex-col gap-3 min-h-[480px]"
            >
              {/* Header */}
              <div className="pb-2.5 border-b border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-[10px] font-bold text-white/70 bg-[#1e212d] px-1.5 py-0.5 rounded-full">
                    {colDeals.length}
                  </span>
                </div>
                <div className="text-[10px] font-mono font-semibold text-text-muted">
                  ${colVal.toLocaleString()}
                </div>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2.5 flex-1">
                {colDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-bg-card border border-border/80 hover:border-accent/40 rounded-xl p-3.5 shadow-xs space-y-2.5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1c1f2b] text-text-muted border border-[#272b3c]">
                        {deal.company}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium">{deal.source}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-accent transition-colors leading-tight">
                        {deal.name}
                      </h4>
                      <p className="text-[11px] text-text-secondary mt-0.5">{deal.client}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="font-bold text-emerald-400 font-mono">
                        ${deal.value.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-text-muted">{deal.rep}</span>
                    </div>

                    {/* Stage Transition Arrows */}
                    <div className="flex items-center justify-end gap-1 pt-1">
                      {col.id !== 'lead' && (
                        <button
                          type="button"
                          onClick={() => {
                            const ids = STAGES.map((s) => s.id);
                            const prev = ids[ids.indexOf(col.id) - 1];
                            if (prev) moveStage(deal.id, prev);
                          }}
                          className="p-1 rounded bg-[#1c1f2b] text-text-muted hover:text-white cursor-pointer"
                        >
                          <ArrowLeft size={11} />
                        </button>
                      )}
                      {col.id !== 'won' && col.id !== 'lost' && (
                        <button
                          type="button"
                          onClick={() => {
                            const ids = STAGES.map((s) => s.id);
                            const next = ids[ids.indexOf(col.id) + 1];
                            if (next) moveStage(deal.id, next);
                          }}
                          className="p-1 rounded bg-[#1c1f2b] text-text-muted hover:text-white cursor-pointer"
                        >
                          <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colDeals.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border/30 rounded-xl flex items-center justify-center text-text-muted/60 text-[10px]">
                    Empty stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Opportunity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white">Create Sales Opportunity</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-semibold">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Voice Agent Setup"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nova Logistics"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Entity</label>
                  <select
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Aeitron AI">Aeitron AI</option>
                    <option value="Craftly">Craftly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Deal Value ($ USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Lead Source</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Inbound">Inbound</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Event">Event / Network</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Assigned Rep</label>
                  <select
                    value={form.rep}
                    onChange={(e) => setForm({ ...form, rep: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Salung Prastyo">Salung Prastyo (Sales Lead)</option>
                    <option value="Mahmud Hasan">Mahmud Hasan (COO/CEO)</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-white bg-[#181a22] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold cursor-pointer shadow-md shadow-accent/20"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
