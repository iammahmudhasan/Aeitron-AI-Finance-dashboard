import { useState, useEffect } from 'react';
import { BookOpen, Search, Code, Bot, CheckSquare, Sparkles, FileText, ChevronRight, Plus, X } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'all', name: 'All Resources' },
  { id: 'prompts', name: 'AI Prompts & Agents' },
  { id: 'tech', name: 'Tech & Architecture' },
  { id: 'sales', name: 'Sales & Client Onboarding' },
  { id: 'hr', name: 'HR & Operations SOPs' },
];

const INITIAL_KNOWLEDGE_ITEMS = [
  {
    id: 'kb-1',
    category: 'prompts',
    title: 'Customer Service Voice Bot System Prompt Template',
    dept: 'AI Prompts & Agents',
    readTime: '3 min',
    summary: 'Standardized meta-prompt with strict tool-calling safety boundaries, tone calibration, and escalation triggers.',
    content: `You are an executive customer service AI agent for [Client Name].
- Speak clearly, concisely, and empathetically.
- Always check customer balance and order ID before triggering financial settlements.
- If customer requests a manager or is dissatisfied, immediately call the escalate_to_human tool with context.`,
  },
  {
    id: 'kb-2',
    category: 'tech',
    title: 'Next.js 15 & Supabase RLS Security Policy Standard',
    dept: 'Tech & Architecture',
    readTime: '5 min',
    summary: 'Architectural guideline on configuring Row-Level Security on Postgres tables and enforcing RBAC via server actions.',
    content: `Every PostgreSQL table containing client contracts, financial settlements, or employee compensation must have:
1. ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;
2. Policies for SELECT, INSERT, UPDATE scoped to auth.uid() and role claims.
3. CEO and COO retains master bypass policies for financial auditing.`,
  },
  {
    id: 'kb-3',
    category: 'sales',
    title: 'Client Scoping Call Framework & SOW Pricing Guide',
    dept: 'Sales & Client Onboarding',
    readTime: '4 min',
    summary: 'Discovery qualification questions, fixed-scope contract packaging, and milestone billing templates.',
    content: `Phase 1: Discovery & Technical Audit (25% upfront retainer).
Phase 2: Architecture & Vector Database Scaffold (35% milestone).
Phase 3: Integration, UAT testing, & Production Deployment (40% completion settlement).`,
  },
  {
    id: 'kb-4',
    category: 'hr',
    title: 'New Employee 7-Day Onboarding Checklist',
    dept: 'HR & Operations SOPs',
    readTime: '2 min',
    summary: 'Automated onboarding sequence for newly hired engineers, project leads, and sales reps across Aeitron AI.',
    content: `Day 1: Setup company email (@aeitron.com), join Slack/Discord, complete NID & Bank details.
Day 2: Review Security Guidelines & sign NDA.
Day 3: Clone repository, setup local dev environment, and verify Prisma DB connection.
Day 5: Pair with Alex Rivera or Mahmud Hasan on first client deliverable task.`,
  },
];

export default function KnowledgeBaseView() {
  const [items, setItems] = useState(INITIAL_KNOWLEDGE_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeItem, setActiveItem] = useState(INITIAL_KNOWLEDGE_ITEMS[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'prompts',
    dept: 'AI Prompts & Agents',
    summary: '',
    content: '',
  });

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener('open-new-sop-modal', handler);
    return () => window.removeEventListener('open-new-sop-modal', handler);
  }, []);

  const handleAddSop = (e) => {
    e.preventDefault();
    const deptName = DEPARTMENTS.find((d) => d.id === form.category)?.name || 'General';
    const newItem = {
      id: `kb-${Date.now()}`,
      category: form.category,
      title: form.title,
      dept: deptName,
      readTime: '3 min',
      summary: form.summary,
      content: form.content,
    };
    setItems([newItem, ...items]);
    setActiveItem(newItem);
    setModalOpen(false);
    setForm({ title: '', category: 'prompts', dept: 'AI Prompts & Agents', summary: '', content: '' });
  };

  const filteredItems = items.filter((item) => {
    const matchesDept = selectedDept === 'all' || item.category === selectedDept;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.summary.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Internal Knowledge Base & Prompt Library</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              Standard Operating Procedures
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Centralized agency SOPs, reusable agent prompt libraries, tech architecture, and onboarding checklists
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search docs & prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[#181a22] border border-[#262934] rounded-full text-xs text-white placeholder:text-text-muted/60 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDept(dept.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDept === dept.id
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-white bg-[#181a22]'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* 2-Column Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of docs */}
        <div className="lg:col-span-5 space-y-3">
          {filteredItems.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c1e29] border-accent shadow-md shadow-accent/10'
                    : 'bg-bg-card border-border hover:border-border/90'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
                  <span className="font-semibold text-accent uppercase tracking-wider">{item.dept}</span>
                  <span>{item.readTime} read</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 leading-snug">{item.title}</h4>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{item.summary}</p>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center bg-bg-card border border-border rounded-2xl text-text-muted text-xs">
              No matching documentation found.
            </div>
          )}
        </div>

        {/* Right Column: Active Document Content */}
        <div className="lg:col-span-7 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
              {activeItem.dept} · {activeItem.readTime}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">{activeItem.title}</h3>
            <p className="text-xs text-text-secondary mt-1">{activeItem.summary}</p>
          </div>

          <div className="p-4 bg-[#14161f] border border-[#262934] rounded-xl font-mono text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
            {activeItem.content}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-text-muted border-t border-border/60">
            <span>Last reviewed by COO Mahmud Hasan</span>
            <span className="text-emerald-400 font-semibold">Active Operational Guideline</span>
          </div>
        </div>
      </div>

      {/* New SOP Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-base font-bold text-white">Create SOP or AI Prompt</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSop} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inbound Voice Agent Prompt v2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 px-3 bg-[#14161f] border border-[#262934] rounded-xl text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Category / Department</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 px-3 bg-[#14161f] border border-[#262934] rounded-xl text-xs text-white outline-none focus:border-accent"
                >
                  <option value="prompts">AI Prompts & Agents</option>
                  <option value="tech">Tech & Architecture</option>
                  <option value="sales">Sales & Client Onboarding</option>
                  <option value="hr">HR & Operations SOPs</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Summary / Objective</label>
                <input
                  type="text"
                  required
                  placeholder="Brief description of when this procedure is used"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full h-10 px-3 bg-[#14161f] border border-[#262934] rounded-xl text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Document Content / System Prompt</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Full instructions, markdown content, or prompt system instructions..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full p-3 bg-[#14161f] border border-[#262934] rounded-xl text-xs text-white font-mono outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white hover:bg-bg-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl shadow-md shadow-accent/20 transition-all cursor-pointer"
                >
                  Publish Guideline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
