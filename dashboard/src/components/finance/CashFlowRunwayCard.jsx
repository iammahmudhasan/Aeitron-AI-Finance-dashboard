import { useState } from 'react';
import { DollarSign, Flame, Clock, TrendingUp, TrendingDown, Building, ShieldCheck, CreditCard } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useProjectTask } from '../../context/ProjectTaskContext';

export default function CashFlowRunwayCard() {
  const { activeCompany } = useCompany();
  const { projects } = useProjectTask();

  // Financial figures
  const cashOnHand = 142500; // USD in bank
  const monthlyBurn = 18400; // payroll + cloud + tools
  const runwayMonths = (cashOnHand / monthlyBurn).toFixed(1);

  const clientPL = [
    { client: 'Acme Global Corp', project: 'NexusFlow AI Agent', revenue: 18500, cost: 8400, net: 10100, margin: '55%', company: 'Aeitron AI' },
    { client: 'Lumina Health Labs', project: 'Craftly Brand App', revenue: 12000, cost: 5600, net: 6400, margin: '53%', company: 'Craftly' },
    { client: 'Apex Logistics Ltd', project: 'Voice & WhatsApp Bot', revenue: 22000, cost: 3200, net: 18800, margin: '85%', company: 'Aeitron AI' },
    { client: 'Kite Payments', project: 'FinTech Lending Portal', revenue: 15000, cost: 7100, net: 7900, margin: '52%', company: 'Craftly' },
  ];

  const filteredPL = activeCompany === 'all'
    ? clientPL
    : clientPL.filter((item) => item.company.toLowerCase().includes(activeCompany));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Cash Flow, Burn Rate & Profitability</h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            Executive Financial Intelligence
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1">
          Monitor runway liquidity, deal-level unit economics, and per-client P&L margins
        </p>
      </div>

      {/* Runway & Burn Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cash in Bank */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Cash Liquidity on Hand</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            ${cashOnHand.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>Across City Bank & Standard Chartered Reserves</span>
          </div>
        </div>

        {/* Monthly Net Burn */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Average Monthly Burn Rate</span>
            <Flame size={16} className="text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 tracking-tight">
            ${monthlyBurn.toLocaleString()} <span className="text-xs font-normal text-text-muted">/ month</span>
          </div>
          <div className="text-[11px] text-text-muted mt-2">
            Payroll ($14.6k) + OpenAI & Cloud Infra ($2.8k) + SaaS Tools ($1k)
          </div>
        </div>

        {/* Estimated Runway */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Estimated Cash Runway</span>
            <Clock size={16} className="text-accent" />
          </div>
          <div className="text-3xl font-bold text-accent tracking-tight">
            {runwayMonths} <span className="text-base font-semibold text-white">Months</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">
            Solid liquidity without external fundraising
          </div>
        </div>
      </div>

      {/* Per-Client & Project P&L Matrix */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Client & Project Profitability (P&L Ledger)</h3>
            <p className="text-xs text-text-muted mt-0.5">Identifies scope creep by tracking billed revenue against direct delivery cost</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">Net Positive Margins</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-text-muted bg-[#14161f]/50">
                <th className="p-4">Client</th>
                <th className="p-4">Delivery Project</th>
                <th className="p-4">Entity</th>
                <th className="p-4 text-right">Contract Revenue</th>
                <th className="p-4 text-right">Direct Cost</th>
                <th className="p-4 text-right">Net Profit</th>
                <th className="p-4 text-right">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredPL.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#181a22]/60 transition-colors">
                  <td className="p-4 font-bold text-white">{row.client}</td>
                  <td className="p-4 text-text-secondary">{row.project}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1e202c] text-text border border-[#2a2d3e]">
                      <Building size={10} className="text-accent" />
                      {row.company}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-white/90">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-rose-400 font-medium">
                    ${row.cost.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    +${row.net.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {row.margin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
