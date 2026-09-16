import { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Server,
  Zap,
} from 'lucide-react';

const INITIAL_RETAINERS = [
  {
    id: 'ret_1',
    client: 'Apex Dental Group',
    package: '24/7 Voice AI Retainer & Call Monitoring',
    amount: 850,
    interval: 'Monthly',
    method: 'Stripe Autopay',
    renewalDate: 'Nov 15, 2025',
    status: 'Active',
  },
  {
    id: 'ret_2',
    client: 'Nexus Real Estate',
    package: 'CRM Lead Router & SMS Bot Retainer',
    amount: 1200,
    interval: 'Monthly',
    method: 'Bank Wire / ACH',
    renewalDate: 'Nov 20, 2025',
    status: 'Active',
  },
  {
    id: 'ret_3',
    client: 'Skyline E-Commerce',
    package: 'Zendesk & Shopify AI Sync Retainer',
    amount: 650,
    interval: 'Monthly',
    method: 'PayPal Recurring',
    renewalDate: 'Nov 22, 2025',
    status: 'Active',
  },
  {
    id: 'ret_4',
    client: 'Solaria Legal Associates',
    package: 'Intake OCR & Document Parser Retainer',
    amount: 950,
    interval: 'Monthly',
    method: 'Bank Transfer',
    renewalDate: 'Nov 28, 2025',
    status: 'Active',
  },
];

const SAAS_EXPENSES = [
  { tool: 'OpenAI API Token Usage', cost: 340, purpose: 'GPT-4o voice & inference models' },
  { tool: 'Anthropic Claude API', cost: 180, purpose: 'Complex coding & reasoning pipelines' },
  { tool: 'Make.com Pro Team', cost: 59, purpose: 'Enterprise webhook routing & queue' },
  { tool: 'Twilio SIP Telephony', cost: 45, purpose: '4 Dedicated inbound phone numbers' },
  { tool: 'Supabase & Cloud Hosting', cost: 50, purpose: 'Database, pgvector & edge functions' },
];

export default function BillingSubscriptionsView() {
  const [retainers, setRetainers] = useState(INITIAL_RETAINERS);

  const totalMrr = retainers.reduce((sum, r) => sum + r.amount, 0);
  const totalSaasCost = SAAS_EXPENSES.reduce((sum, s) => sum + s.cost, 0);
  const netMargin = totalMrr - totalSaasCost;
  const marginPercentage = Math.round((netMargin / (totalMrr || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <CreditCard className="text-accent" size={24} />
            Billing, Retainers & Recurring Agency Cash Flow
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Automated tracking of client monthly recurring retainers (MRR) versus software infrastructure costs.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Total Client MRR
          </span>
          <div className="text-2xl font-bold text-text mt-1">${totalMrr.toLocaleString()}/mo</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% On-time renewal rate
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Software Overhead Cost
          </span>
          <div className="text-2xl font-bold text-text mt-1">${totalSaasCost.toLocaleString()}/mo</div>
          <span className="text-[11px] text-text-muted font-medium">
            API tokens & servers
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Net Recurring Profit
          </span>
          <div className="text-2xl font-bold text-accent mt-1">${netMargin.toLocaleString()}/mo</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {marginPercentage}% Net agency margin
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Annualized Run Rate (ARR)
          </span>
          <div className="text-2xl font-bold text-text mt-1">${(totalMrr * 12).toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Compounding contract growth
          </span>
        </div>
      </div>

      {/* Tables Row: Client Retainers (left) & SaaS Tooling (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client Retainers */}
        <div className="lg:col-span-8 bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-3">
            <h3 className="text-sm font-bold text-text">Active Client Maintenance Retainers</h3>
            <span className="text-xs text-text-muted">{retainers.length} Contracts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[10px] text-text-muted uppercase font-semibold">
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Retainer Scope</th>
                  <th className="py-2.5 px-3">Monthly Rate</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Next Renewal</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {retainers.map((r) => (
                  <tr key={r.id} className="hover:bg-bg-hover/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text">{r.client}</td>
                    <td className="py-3 px-3 text-text-muted">{r.package}</td>
                    <td className="py-3 px-3 font-bold text-text">${r.amount}/mo</td>
                    <td className="py-3 px-3 text-text-secondary">{r.method}</td>
                    <td className="py-3 px-3 text-text-muted font-medium">{r.renewalDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agency Software Tooling Costs */}
        <div className="lg:col-span-4 bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-3">
              <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
                <Server size={15} className="text-accent" />
                Infrastructure & API Costs
              </h3>
              <span className="font-bold text-text text-xs">${totalSaasCost}/mo</span>
            </div>

            <div className="space-y-3">
              {SAAS_EXPENSES.map((exp, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-bg/50 rounded-xl border border-border/40">
                  <div>
                    <div className="font-semibold text-text">{exp.tool}</div>
                    <div className="text-[10px] text-text-muted">{exp.purpose}</div>
                  </div>
                  <span className="font-mono font-bold text-text">${exp.cost}/mo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 mt-4 text-xs text-text-muted flex items-center justify-between">
            <span>Billing Auto-Sync:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Synced to Ledger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
