import { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  FileCode2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Bot,
  Sparkles,
} from 'lucide-react';

const SOPS = [
  {
    id: 'sop_1',
    title: 'New Client Automation Onboarding Protocol',
    category: 'Agency Operations',
    duration: '45 mins',
    summary: 'Standard procedure for client kickoff, security clearance, API credential collection, and setting up dedicated webhook endpoints.',
    steps: [
      'Send onboarding form collecting Twilio, CRM, and OpenAI API access.',
      'Initialize client project in Aeitron Orders Management with assigned engineer.',
      'Setup client retainer agreement and automated payment link (Stripe/Bank).',
      'Create shared client communication channel in Agency Messages.',
    ],
  },
  {
    id: 'sop_2',
    title: 'Voice AI Quality Assurance & Latency Benchmark Checklist',
    category: 'Technical QA',
    duration: '30 mins',
    summary: 'Rigorous 12-point testing protocol before deploying conversational phone agents to live client telephone lines.',
    steps: [
      'Verify end-to-end speech latency is below 550ms using ElevenLabs Turbo v2.',
      'Simulate ambient background noise and test interruption speech recognition.',
      'Test emergency keyword fallback for immediate human operator transfer.',
      'Verify calendar appointment booking slot locking in Google Calendar / Calendly.',
    ],
  },
  {
    id: 'sop_3',
    title: 'Multi-Agent Outbound Lead Generation SOP',
    category: 'Sales & Growth',
    duration: '20 mins',
    summary: 'Guide for sourcing verified B2B decision-makers, warming secondary domains, and launching personalized cold outreach.',
    steps: [
      'Extract decision-maker emails using Apollo.io or Lead Discovery with valid MX checks.',
      'Ensure daily sending volume does not exceed 35 emails per mailbox.',
      'Utilize Claude 3.5 Sonnet to dynamically reference prospect website pain points.',
      'Route positive replies immediately to Sales Operator via Telegram alerts.',
    ],
  },
];

const PROMPT_BLUEPRINTS = [
  {
    id: 'prompt_1',
    title: 'Production Inbound Voice Receptionist Prompt',
    role: 'Voice AI',
    content: `You are an elite, professional receptionist for [Company Name]. Your goal is to warmly greet callers, answer basic questions using verified knowledge base facts, qualify their inquiry, and seamlessly book them into the calendar.
- Keep responses concise (under 2 sentences) to maintain conversational pacing.
- Never invent prices or services outside of provided documents.
- If the caller has an urgent emergency, transfer immediately to [Emergency Phone].`,
  },
  {
    id: 'prompt_2',
    title: 'E-Commerce AI Customer Support & Returns Prompt',
    role: 'Chatbot & WhatsApp',
    content: `You are the customer care specialist for [Store Name]. You have direct access to order lookups.
1. When asked about order status, politely ask for the 6-digit order ID and email.
2. If order status is "Shipped", provide tracking URL and expected delivery window.
3. If customer requests a refund, check if purchase is within 30 days. If valid, generate return label.`,
  },
];

export default function HelpCenterView() {
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState('');

  const copyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSops = SOPS.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <HelpCircle className="text-accent" size={24} />
            Agency Knowledge Base, SOPs & Prompt Blueprints
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Internal operating manuals, quality assurance checklists, and tested AI system prompt blueprints.
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search SOPs and guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-60 focus:border-accent"
          />
        </div>
      </div>

      {/* SOP Section */}
      <div>
        <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-accent" />
          Standard Operating Procedures (SOPs)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredSops.map((sop) => (
            <div
              key={sop.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    {sop.category}
                  </span>
                  <span className="text-[11px] text-text-muted">{sop.duration}</span>
                </div>

                <h4 className="text-sm font-bold text-text tracking-tight mb-2">{sop.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-4">{sop.summary}</p>

                <div className="space-y-1.5 bg-bg/50 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                    Standard Checklist
                  </span>
                  {sop.steps.map((st, i) => (
                    <div key={i} className="text-xs text-text flex items-start gap-2">
                      <span className="font-bold text-accent mt-0.5">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Prompt Blueprints */}
      <div className="pt-4 border-t border-border/60">
        <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
          <FileCode2 size={16} className="text-accent" />
          Production-Tested AI Prompt Blueprints
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROMPT_BLUEPRINTS.map((p) => (
            <div
              key={p.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-text">{p.title}</h4>
                  <span className="text-[10px] font-semibold text-text-muted bg-bg px-2 py-0.5 rounded border border-border">
                    {p.role}
                  </span>
                </div>

                <div className="bg-bg p-3 rounded-xl border border-border/70 font-mono text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap my-3 max-h-44 overflow-y-auto">
                  {p.content}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => copyText(p.content, p.id)}
                  className="px-3 py-1.5 bg-bg hover:bg-bg-hover text-text border border-border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {copiedId === p.id ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Prompt Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
