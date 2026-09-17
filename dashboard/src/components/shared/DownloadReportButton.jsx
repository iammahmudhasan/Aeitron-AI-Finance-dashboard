import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useLeads } from '../../context/LeadsContext';
import { useInvoices } from '../../context/InvoiceContext';
import { useSystemHealth } from '../../context/SystemHealthContext';
import { useApiCredits } from '../../context/ApiCreditsContext';
import { exportToCsv, CLIENT_COLUMNS, EXPENSE_COLUMNS, INVOICE_COLUMNS, LEAD_COLUMNS } from '../../utils/exportCsv';

export default function DownloadReportButton() {
  const { clients } = useClients();
  const { expenses } = useExpenses();
  const { leads } = useLeads();
  const { invoices } = useInvoices();
  const { automations } = useSystemHealth();
  const { services } = useApiCredits();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function downloadJson() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalClients: clients.length,
        totalLeads: leads.length,
        totalInvoices: invoices.length,
        totalAutomations: automations.length,
      },
      clients,
      expenses,
      leads,
      invoices,
      automations,
      apiCredits: services,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeitron-report-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  function downloadCsv(type) {
    const date = new Date().toISOString().split('T')[0];
    const map = {
      clients: { data: clients, columns: CLIENT_COLUMNS, name: 'clients' },
      expenses: { data: expenses, columns: EXPENSE_COLUMNS, name: 'expenses' },
      invoices: { data: invoices, columns: INVOICE_COLUMNS, name: 'invoices' },
      leads: { data: leads, columns: LEAD_COLUMNS, name: 'leads' },
    };
    const config = map[type];
    exportToCsv(`aeitron-${config.name}-${date}.csv`, config.columns, config.data);
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-white bg-[#181a22] border border-[#262934] rounded-full hover:bg-[#202330] transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
        title="Download Report"
      >
        <Download size={15} className="text-text-muted shrink-0" />
        <span className="hidden 2xl:inline whitespace-nowrap">Report</span>
        <ChevronDown size={14} className={`text-text-muted transition-transform duration-150 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#181a22] border border-[#262934] rounded-2xl shadow-2xl py-1.5 z-50 animate-fade-in text-xs">
          <button onClick={downloadJson} className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-[#202330] transition-colors">
            Full Report (JSON)
          </button>
          <div className="border-t border-[#262934] my-1" />
          <p className="px-4 py-1 text-[10px] text-text-muted font-semibold uppercase tracking-wider">Export as CSV</p>
          <button onClick={() => downloadCsv('clients')} className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-[#202330] transition-colors">
            Clients
          </button>
          <button onClick={() => downloadCsv('expenses')} className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-[#202330] transition-colors">
            Expenses
          </button>
          <button onClick={() => downloadCsv('invoices')} className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-[#202330] transition-colors">
            Invoices
          </button>
          <button onClick={() => downloadCsv('leads')} className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-[#202330] transition-colors">
            Leads
          </button>
        </div>
      )}
    </div>
  );
}
