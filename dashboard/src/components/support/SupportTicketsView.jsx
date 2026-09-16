import { useState } from 'react';
import {
  Headphones,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  User,
  Plus,
  X,
} from 'lucide-react';

const INITIAL_TICKETS = [
  {
    id: 'TCK-401',
    client: 'Apex Dental Group',
    title: 'Voice bot misunderstood out-of-network dental insurance question',
    priority: 'High',
    assignedTo: 'Alex Rivera',
    status: 'In Progress',
    time: '2 hours ago',
    category: 'Voice AI Calibration',
  },
  {
    id: 'TCK-402',
    client: 'Nexus Real Estate',
    title: 'Add 15 new luxury penthouse listings to Pinecone knowledge base',
    priority: 'Medium',
    assignedTo: 'Salung Prastyo',
    status: 'Resolved',
    time: 'Yesterday',
    category: 'Knowledge Base Update',
  },
  {
    id: 'TCK-403',
    client: 'Skyline E-Commerce',
    title: 'Shopify order status webhook delayed during flash sale load spike',
    priority: 'Urgent',
    assignedTo: 'Alex Rivera',
    status: 'In Progress',
    time: '35 mins ago',
    category: 'Webhook Latency',
  },
  {
    id: 'TCK-404',
    client: 'Solaria Legal Associates',
    title: 'Client intake PDF OCR failed on handwritten signature field',
    priority: 'Low',
    assignedTo: 'Mahmud Hasan',
    status: 'Open',
    time: '4 hours ago',
    category: 'OCR Pipeline',
  },
];

export default function SupportTicketsView() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const toggleResolve = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Resolved' ? 'In Progress' : 'Resolved' }
          : t
      )
    );
  };

  const filtered = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <Headphones className="text-accent" size={24} />
            Client AI Support Desk & SLA Management
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Resolve incoming client tickets, optimize prompt calibration, and track SLA resolution speed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl">
            Avg SLA: 28 Minutes
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-accent'
                  : 'bg-bg border border-border text-text-muted hover:text-text'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-56 focus:border-accent"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.map((t) => {
          const isResolved = t.status === 'Resolved';

          return (
            <div
              key={t.id}
              className={`bg-bg-card border rounded-2xl p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isResolved ? 'border-border/60 opacity-75' : 'border-border/80 hover:border-border'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-text-muted">{t.id}</span>
                  <span className="text-xs font-bold text-text">• {t.client}</span>
                  <PriorityBadge priority={t.priority} />
                  <span className="text-[10px] text-text-muted bg-bg px-2 py-0.5 rounded-md border border-border">
                    {t.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text">{t.title}</h3>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>Assigned to: <strong className="text-text">{t.assignedTo}</strong></span>
                  <span>• Received: {t.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => toggleResolve(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isResolved
                      ? 'bg-bg text-text-muted border-border hover:bg-bg-hover'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent shadow-xs'
                  }`}
                >
                  {isResolved ? 'Re-open Ticket' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  if (priority === 'Urgent') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/15 text-danger border border-danger/25">
        Urgent
      </span>
    );
  }
  if (priority === 'High') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
        High
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25">
      {priority}
    </span>
  );
}
