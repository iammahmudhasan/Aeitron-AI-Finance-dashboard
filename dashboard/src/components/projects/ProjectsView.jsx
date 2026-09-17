import { useState, useEffect } from 'react';
import { Layers, Plus, Calendar, AlertTriangle, CheckCircle2, User, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { useProjectTask } from '../../context/ProjectTaskContext';
import { useCompany } from '../../context/CompanyContext';

const STAGE_LABELS = {
  scoping: { label: 'Scoping', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  build: { label: 'In Build', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  testing: { label: 'QA & Testing', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  deployed: { label: 'Deployed & Live', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  support: { label: 'In Support SLA', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
};

export default function ProjectsView() {
  const { projects, addProject } = useProjectTask();
  const { filterByCompany } = useCompany();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    clientName: '',
    company: 'Aeitron AI',
    stage: 'scoping',
    deadline: '',
    budget: '',
  });

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener('open-new-project-modal', handler);
    return () => window.removeEventListener('open-new-project-modal', handler);
  }, []);

  const filteredProjects = filterByCompany(projects);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({
      ...form,
      budget: Number(form.budget) || 10000,
      team: ['Mahmud Hasan'],
    });
    setModalOpen(false);
    setForm({ name: '', clientName: '', company: 'Aeitron AI', stage: 'scoping', deadline: '', budget: '' });
  };

  const totalBudget = filteredProjects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = filteredProjects.reduce((acc, p) => acc + p.spentCost, 0);
  const overallMargin = totalBudget > 0 ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0;

  return (
    <div className="space-y-6 max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-full min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white tracking-tight">Client & Project Delivery Hub</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 shrink-0">
              SLA & Milestone Tracking
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            End-to-end automation builds, deliverable progress, client milestone sign-offs, and project P&L
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-10 flex items-center gap-2 px-5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
        >
          <Plus size={16} className="shrink-0" />
          <span>New Project Build</span>
        </button>
      </div>

      {/* P&L Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Total Contracted Budget</span>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
            ${totalBudget.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">Across {filteredProjects.length} active deliverables</span>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Direct Delivery Costs (Burn)</span>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400 mt-1">
            ${totalSpent.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">Labor rates, LLM tokens & compute infra</span>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-text-muted font-medium block">Aggregate Gross Margin</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
            +{overallMargin}% <span className="text-xs font-normal text-text-muted">Margin</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Net Profit: ${(totalBudget - totalSpent).toLocaleString()}</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const stageCfg = STAGE_LABELS[project.stage] || STAGE_LABELS.scoping;
          const projectProfit = project.budget - project.spentCost;
          const marginPct = Math.round((projectProfit / project.budget) * 100);

          return (
            <div
              key={project.id}
              className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-border/90 transition-all flex flex-col justify-between gap-5"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-accent tracking-wider uppercase block mb-1">
                      {project.company} · {project.clientName}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      {project.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${stageCfg.color} shrink-0`}>
                    {stageCfg.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-text-muted font-medium">Deliverables Completion</span>
                    <span className="font-bold text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#181a22] rounded-full overflow-hidden border border-[#262934]">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Milestones Checklist */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="p-3.5 bg-[#181a22] border border-[#262934] rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Milestones & SLA Gateways
                  </span>
                  {project.milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-xs">
                      {m.done ? (
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-text-muted/40 shrink-0" />
                      )}
                      <span className={m.done ? 'line-through text-text-muted' : 'text-text font-medium'}>
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer: P&L and Team */}
              <div className="flex items-center justify-between pt-3 border-t border-border/80 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-text-muted block">Budget</span>
                    <span className="font-bold text-white">${project.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Spent</span>
                    <span className="font-mono text-rose-400 font-semibold">${project.spentCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Margin</span>
                    <span className="font-mono text-emerald-400 font-bold">+{marginPct}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-text-muted block">Deadline</span>
                  <span className="font-mono text-white flex items-center gap-1">
                    <Calendar size={11} className="text-accent" />
                    {project.deadline}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white">Create New Project Build</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Customer Outreach Agent"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Health Corp"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Operating Entity</label>
                  <select
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Aeitron AI">Aeitron AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Delivery Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="scoping">Scoping</option>
                    <option value="build">In Build</option>
                    <option value="testing">QA & Testing</option>
                    <option value="deployed">Deployed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Contract Budget ($ USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Target SLA Deadline</label>
                  <input
                    type="date"
                    required
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
