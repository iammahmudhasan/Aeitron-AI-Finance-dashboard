import { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ArrowRight,
  ExternalLink,
  X,
  Layers,
  User,
  Trash2,
} from 'lucide-react';

const INITIAL_ORDERS = [
  {
    id: 'ord_101',
    client: 'Apex Dental Group',
    project: '24/7 After-Hours Voice AI Receptionist',
    stage: 'QA & Testing',
    assignedTo: 'Alex Rivera',
    value: 4500,
    deadline: 'Nov 12, 2025',
    progress: 75,
    milestones: [
      { text: 'Discovery & prompt engineering', done: true },
      { text: 'Twilio SIP & ElevenLabs integration', done: true },
      { text: 'End-to-end call testing & edge cases', done: false },
      { text: 'Client live cutover', done: false },
    ],
  },
  {
    id: 'ord_102',
    client: 'Nexus Real Estate',
    project: 'Automated Lead Qualification & CRM Sync',
    stage: 'Live Deployed',
    assignedTo: 'Salung Prastyo',
    value: 3800,
    deadline: 'Nov 2, 2025',
    progress: 100,
    milestones: [
      { text: 'Zillow & Facebook lead webhook', done: true },
      { text: 'SMS instant responder workflow', done: true },
      { text: 'Google Calendar booking automation', done: true },
      { text: 'HubSpot CRM sync active', done: true },
    ],
  },
  {
    id: 'ord_103',
    client: 'Skyline E-Commerce',
    project: 'Omni-Channel Returns & Order Tracking Bot',
    stage: 'In Development',
    assignedTo: 'Alex Rivera',
    value: 5200,
    deadline: 'Nov 18, 2025',
    progress: 50,
    milestones: [
      { text: 'Shopify API integration', done: true },
      { text: 'Zendesk ticket escalation engine', done: true },
      { text: 'Pinecone Vector DB knowledge base', done: false },
      { text: 'WhatsApp channel verification', done: false },
    ],
  },
  {
    id: 'ord_104',
    client: 'Solaria Legal Associates',
    project: 'Client Intake & Document Extraction Agent',
    stage: 'Discovery & Blueprint',
    assignedTo: 'Mahmud Hasan',
    value: 6500,
    deadline: 'Nov 24, 2025',
    progress: 25,
    milestones: [
      { text: 'Intake questionnaire architecture', done: true },
      { text: 'HIPAA & privacy compliance review', done: false },
      { text: 'Document parsing pipeline (OCR)', done: false },
      { text: 'PracticePanther CRM sync', done: false },
    ],
  },
];

const STAGES = ['All', 'Discovery & Blueprint', 'In Development', 'QA & Testing', 'Live Deployed'];

export default function OrdersManagementView() {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('aeitron_client_orders');
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('Alex Rivera');
  const [value, setValue] = useState(3500);
  const [deadline, setDeadline] = useState('Nov 20, 2025');
  const [stage, setStage] = useState('In Development');

  const saveOrders = (updated) => {
    setOrders(updated);
    try {
      localStorage.setItem('aeitron_client_orders', JSON.stringify(updated));
    } catch {}
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!client || !project) return;

    const newOrder = {
      id: `ord_${Math.floor(100 + Math.random() * 900)}`,
      client,
      project,
      stage,
      assignedTo,
      value: Number(value),
      deadline,
      progress: stage === 'Live Deployed' ? 100 : stage === 'QA & Testing' ? 75 : stage === 'In Development' ? 50 : 25,
      milestones: [
        { text: 'Scope of work & API keys confirmed', done: true },
        { text: 'Workflow built in n8n / Make', done: stage !== 'Discovery & Blueprint' },
        { text: 'Client testing & QA validation', done: stage === 'QA & Testing' || stage === 'Live Deployed' },
        { text: 'Production handover & retainer kickoff', done: stage === 'Live Deployed' },
      ],
    };

    saveOrders([newOrder, ...orders]);
    setModalOpen(false);
    setClient('');
    setProject('');
  };

  const advanceStage = (id) => {
    const stageFlow = ['Discovery & Blueprint', 'In Development', 'QA & Testing', 'Live Deployed'];
    const updated = orders.map((ord) => {
      if (ord.id !== id) return ord;
      const curIndex = stageFlow.indexOf(ord.stage);
      const nextStage = curIndex < stageFlow.length - 1 ? stageFlow[curIndex + 1] : stageFlow[curIndex];
      const nextProgress = nextStage === 'Live Deployed' ? 100 : nextStage === 'QA & Testing' ? 75 : nextStage === 'In Development' ? 50 : 25;
      return { ...ord, stage: nextStage, progress: nextProgress };
    });
    saveOrders(updated);
  };

  const handleDelete = (id) => {
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
  };

  const filtered = orders.filter((o) => {
    const matchesStage = stageFilter === 'All' || o.stage === stageFilter;
    const matchesSearch =
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.project.toLowerCase().includes(search.toLowerCase()) ||
      o.assignedTo.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalContractValue = orders.reduce((sum, o) => sum + (o.value || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.stage !== 'Live Deployed').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <ClipboardList className="text-accent" size={24} />
            Client AI Project Deliverables & Orders
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor client automation builds from blueprint architecture to live production deployment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus size={15} />
          <span>New Client Project</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Pipeline Project Value
          </span>
          <div className="text-2xl font-bold text-text mt-1">${totalContractValue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Across active contracts
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Workflows In Flight
          </span>
          <div className="text-2xl font-bold text-text mt-1">{activeOrdersCount} Projects</div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Currently being built & tested
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Completed & Deployed
          </span>
          <div className="text-2xl font-bold text-text mt-1">
            {orders.filter((o) => o.stage === 'Live Deployed').length} Live
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Generating monthly retainers
          </span>
        </div>
      </div>

      {/* Stage Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStageFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                stageFilter === s
                  ? 'bg-slate-900 text-white dark:bg-accent'
                  : 'bg-bg border border-border text-text-muted hover:text-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-56 focus:border-accent"
          />
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Client & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-mono font-bold text-text-muted block">
                    {ord.id} • {ord.client}
                  </span>
                  <h3 className="text-base font-bold text-text tracking-tight mt-0.5">
                    {ord.project}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StageBadge stage={ord.stage} />
                  <button
                    type="button"
                    onClick={() => handleDelete(ord.id)}
                    className="text-text-muted/50 hover:text-danger p-1 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 mb-4">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-text-muted font-medium">Build Progress</span>
                  <span className="font-bold text-text">{ord.progress}%</span>
                </div>
                <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      ord.progress === 100
                        ? 'bg-emerald-500'
                        : ord.progress >= 75
                        ? 'bg-accent'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${ord.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-1.5 mb-4 bg-bg/50 p-3 rounded-xl border border-border/50">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Execution Milestones
                </span>
                {ord.milestones?.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                        m.done
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'border border-border text-transparent'
                      }`}
                    >
                      {m.done ? '✓' : ''}
                    </span>
                    <span className={m.done ? 'text-text line-through opacity-75' : 'text-text'}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Row */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-text-muted uppercase">Contract Value</div>
                <div className="font-bold text-text text-sm">${ord.value.toLocaleString()}</div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-text-muted uppercase">Deadline</div>
                <div className="font-medium text-text">{ord.deadline}</div>
              </div>

              {ord.stage !== 'Live Deployed' ? (
                <button
                  type="button"
                  onClick={() => advanceStage(ord.id)}
                  className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Advance Stage</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  Live in Prod
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Initialize Client AI Project</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Clinic"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Project Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inbound Voice Appointment Agent"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Assigned Engineer</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  >
                    <option value="Alex Rivera">Alex Rivera (AI Ops)</option>
                    <option value="Salung Prastyo">Salung Prastyo (Sales/Ops)</option>
                    <option value="Mahmud Hasan">Mahmud Hasan (CEO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1 font-medium">Initial Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  >
                    <option value="Discovery & Blueprint">Discovery & Blueprint</option>
                    <option value="In Development">In Development</option>
                    <option value="QA & Testing">QA & Testing</option>
                    <option value="Live Deployed">Live Deployed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Contract Value ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1 font-medium">Delivery Deadline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 28, 2025"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
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

function StageBadge({ stage }) {
  if (stage === 'Live Deployed') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        Live Deployed
      </span>
    );
  }
  if (stage === 'QA & Testing') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/25">
        QA & Testing
      </span>
    );
  }
  if (stage === 'In Development') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
        In Development
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25">
      Discovery
    </span>
  );
}
