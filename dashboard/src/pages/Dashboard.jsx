import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  Download,
  TrendingUp,
  Lock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewStatCards from '../components/cards/OverviewStatCards';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import RevenueBreakdownCard from '../components/charts/RevenueBreakdownCard';
import TransactionsTable from '../components/transactions/TransactionsTable';
import RolesManagementView from '../components/management/RolesManagementView';
import ProductsCatalogView from '../components/products/ProductsCatalogView';
import OrdersManagementView from '../components/orders/OrdersManagementView';
import ChannelsManagementView from '../components/channels/ChannelsManagementView';
import CampaignsView from '../components/campaigns/CampaignsView';
import MessagesView from '../components/messages/MessagesView';
import IntegrationsHubView from '../components/integrations/IntegrationsHubView';
import BillingSubscriptionsView from '../components/billing/BillingSubscriptionsView';
import SupportTicketsView from '../components/support/SupportTicketsView';
import HelpCenterView from '../components/help/HelpCenterView';

// Existing Modules
import StatCardGrid from '../components/cards/StatCardGrid';
import ClientForm from '../components/clients/ClientForm';
import ClientTable from '../components/clients/ClientTable';
import ClientSummaryCards from '../components/clients/ClientSummaryCards';
import ClientDetailPanel from '../components/clients/ClientDetailPanel';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import PaymentPieChart from '../components/charts/PaymentPieChart';
import ExpenseDonutChart from '../components/charts/ExpenseDonutChart';
import RevenueVsExpensesChart from '../components/charts/RevenueVsExpensesChart';
import ProjectedGrowthChart from '../components/charts/ProjectedGrowthChart';
import BurnRateCard from '../components/cards/BurnRateCard';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseSummaryCards from '../components/expenses/ExpenseSummaryCards';
import LeadBoard from '../components/leads/LeadBoard';
import LeadForm from '../components/leads/LeadForm';
import InvoiceTable from '../components/invoices/InvoiceTable';
import InvoiceForm from '../components/invoices/InvoiceForm';
import InvoiceDetail from '../components/invoices/InvoiceDetail';
import AutomationGrid from '../components/system/AutomationGrid';
import AutomationForm from '../components/system/AutomationForm';
import CreditMonitor from '../components/system/CreditMonitor';
import TestEmailButton from '../components/system/TestEmailButton';
import GoalTracker from '../components/cards/GoalTracker';
import CEOBriefing from '../components/cards/CEOBriefing';
import TeamGrid from '../components/team/TeamGrid';
import TeamForm from '../components/team/TeamForm';
import AgentGrid from '../components/agents/AgentGrid';
import LeadDiscovery from '../components/discovery/LeadDiscovery';
import PayoutCalculator from '../components/team/PayoutCalculator';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import AICopilot from '../components/copilot/AICopilot';
import useNotificationGenerator from '../hooks/useNotificationGenerator';

export default function Dashboard() {
  const { currentUser, isCEO, hasPermission } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [formOpen, setFormOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [detailClient, setDetailClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [automationFormOpen, setAutomationFormOpen] = useState(false);
  const [editAutomation, setEditAutomation] = useState(null);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-generate notifications based on data changes
  useNotificationGenerator();

  // Auto-redirect if active view is not permitted for current user
  useEffect(() => {
    if (!hasPermission(activeView)) {
      const firstAllowed = Array.isArray(currentUser?.permissions) && currentUser.permissions.length > 0
        ? currentUser.permissions[0]
        : 'messages';
      if (firstAllowed && firstAllowed !== activeView) {
        setActiveView(firstAllowed);
      }
    }
  }, [currentUser, activeView, hasPermission]);

  function handleAdd() {
    if (activeView === 'expenses') {
      setEditExpense(null);
      setExpenseFormOpen(true);
    } else if (activeView === 'leads') {
      setEditLead(null);
      setLeadFormOpen(true);
    } else if (activeView === 'invoices') {
      setEditInvoice(null);
      setInvoiceFormOpen(true);
    } else if (activeView === 'system') {
      setEditAutomation(null);
      setAutomationFormOpen(true);
    } else if (activeView === 'team') {
      setEditMember(null);
      setTeamFormOpen(true);
    } else {
      setEditClient(null);
      setFormOpen(true);
    }
  }

  function handleEditMember(member) {
    setEditMember(member);
    setTeamFormOpen(true);
  }

  function handleEditAutomation(automation) {
    setEditAutomation(automation);
    setAutomationFormOpen(true);
  }

  function handleEditClient(client) {
    setEditClient(client);
    setFormOpen(true);
  }

  function handleEditExpense(expense) {
    setEditExpense(expense);
    setExpenseFormOpen(true);
  }

  function handleEditLead(lead) {
    setEditLead(lead);
    setLeadFormOpen(true);
  }

  function handleEditInvoice(invoice) {
    setEditInvoice(invoice);
    setInvoiceFormOpen(true);
  }

  function handleRequestDelete(onConfirm, label) {
    setConfirmDelete({ onConfirm, label });
  }

  return (
    <DashboardLayout
      onAddClient={handleAdd}
      activeView={activeView}
      onNavigate={(view) => { setActiveView(view); setSearchQuery(''); }}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Permission Guard */}
          {!hasPermission(activeView) ? (
            <AccessRestrictedView
              onReturnAllowed={() => {
                const firstAllowed = Array.isArray(currentUser?.permissions) && currentUser.permissions.length > 0
                  ? currentUser.permissions[0]
                  : 'messages';
                setActiveView(firstAllowed);
              }}
            />
          ) : (
            <>
              {/* Main Dashboard Overview */}
              {activeView === 'dashboard' && (
                <DashboardView currentUser={currentUser} searchQuery={searchQuery} />
              )}

          {/* AI Products & Solutions Catalog */}
          {activeView === 'products' && <ProductsCatalogView />}

          {/* Transactions dedicated view */}
          {activeView === 'transactions' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-text">Business Transactions Ledger</h2>
                <p className="text-xs text-text-muted mt-0.5">Real-time ledger of agency settlements and client payments</p>
              </div>
              <TransactionsTable globalSearch={searchQuery} />
            </div>
          )}

          {/* Reports & Analytics */}
          {activeView === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-text">Reports & Financial Analytics</h2>
                <p className="text-xs text-text-muted mt-0.5">Comprehensive agency revenue trends, burn rates, and margin distribution</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <SalesTrendChart />
                </div>
                <div className="lg:col-span-4">
                  <RevenueBreakdownCard />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueVsExpensesChart />
                <ExpenseDonutChart />
                <PaymentPieChart />
              </div>
            </div>
          )}

          {/* Unified Messages */}
          {activeView === 'messages' && <MessagesView />}

          {/* Team Performance */}
          {activeView === 'team' && (
            <TeamView
              onEdit={handleEditMember}
              onRequestDelete={handleRequestDelete}
            />
          )}

          {/* Outbound Campaigns */}
          {activeView === 'campaigns' && <CampaignsView />}

          {/* Customers & CRM */}
          {activeView === 'clients' && (
            <ClientsView
              onEdit={handleEditClient}
              onRequestDelete={handleRequestDelete}
              onViewDetail={setDetailClient}
              searchQuery={searchQuery}
            />
          )}

          {/* Communication Channels */}
          {activeView === 'channels' && <ChannelsManagementView />}

          {/* Orders & Client Deliverables */}
          {activeView === 'orders' && <OrdersManagementView />}

          {/* Roles & Permissions */}
          {activeView === 'roles' && <RolesManagementView />}

          {/* Billing & Retainers */}
          {activeView === 'billing' && <BillingSubscriptionsView />}

          {/* API & Technical Integrations */}
          {activeView === 'integrations' && <IntegrationsHubView />}

          {/* Support Tickets */}
          {activeView === 'support' && <SupportTicketsView />}

          {/* Help Center & SOPs */}
          {activeView === 'help' && <HelpCenterView />}

          {/* Expenses */}
          {activeView === 'expenses' && (
            <ExpensesView onEdit={handleEditExpense} onRequestDelete={handleRequestDelete} searchQuery={searchQuery} />
          )}

          {/* Leads Pipeline */}
          {activeView === 'leads' && (
            <LeadsView onEdit={handleEditLead} onRequestDelete={handleRequestDelete} searchQuery={searchQuery} />
          )}

          {/* Invoices */}
          {activeView === 'invoices' && (
            <InvoicesView
              onEdit={handleEditInvoice}
              onView={setViewInvoice}
              onRequestDelete={handleRequestDelete}
              searchQuery={searchQuery}
              onAdd={() => {
                setEditInvoice(null);
                setInvoiceFormOpen(true);
              }}
            />
          )}

          {/* AI Autonomous Agents */}
          {activeView === 'agents' && <AgentsView />}

          {/* Lead Discovery Radar */}
          {activeView === 'discovery' && <LeadDiscovery />}

          {/* System Health */}
          {activeView === 'system' && (
            <SystemView
              onEdit={handleEditAutomation}
              onRequestDelete={handleRequestDelete}
            />
          )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <ClientForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditClient(null); }}
        editClient={editClient}
      />
      <ExpenseForm
        isOpen={expenseFormOpen}
        onClose={() => { setExpenseFormOpen(false); setEditExpense(null); }}
        editExpense={editExpense}
      />
      <LeadForm
        isOpen={leadFormOpen}
        onClose={() => { setLeadFormOpen(false); setEditLead(null); }}
        editLead={editLead}
      />
      <InvoiceForm
        isOpen={invoiceFormOpen}
        onClose={() => { setInvoiceFormOpen(false); setEditInvoice(null); }}
        editInvoice={editInvoice}
      />
      <AutomationForm
        isOpen={automationFormOpen}
        onClose={() => { setAutomationFormOpen(false); setEditAutomation(null); }}
        editAutomation={editAutomation}
      />
      <TeamForm
        isOpen={teamFormOpen}
        onClose={() => { setTeamFormOpen(false); setEditMember(null); }}
        editMember={editMember}
      />
      {viewInvoice && (
        <InvoiceDetail
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
      {detailClient && (
        <ClientDetailPanel
          client={detailClient}
          onClose={() => setDetailClient(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${confirmDelete?.label}"? This action cannot be undone.`}
        onConfirm={() => {
          if (confirmDelete) {
            confirmDelete.onConfirm();
          }
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
      <AICopilot />
    </DashboardLayout>
  );
}

/**
 * Main Overview Screen matching user reference image
 */
function DashboardView({ currentUser, searchQuery }) {
  const [timeframe, setTimeframe] = useState('Daily');
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Salung';

  // Real-time current date state
  const [currentDateStr, setCurrentDateStr] = useState(() => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  });
  const [dateIso, setDateIso] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // Keep date real-time and updated dynamically
  useEffect(() => {
    const updateRealtimeDate = () => {
      const d = new Date();
      setCurrentDateStr(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    };
    const timer = setInterval(updateRealtimeDate, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + "Total Revenue,$20320\n"
      + "Total Orders,10320\n"
      + "New Customers,4305\n"
      + "Conversion Rate,3.9%\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aeitron_Overview_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Here's what's happening across your AI Automation Agency today.
          </p>
        </div>

        {/* Right Tools: Daily dropdown, Date, Export CSV */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Daily / Monthly Dropdown */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-bg-card border border-border rounded-xl text-xs font-semibold text-text outline-none cursor-pointer hover:bg-bg transition-colors shadow-xs"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Real-time Interactive Date / Calendar Button */}
          <div className="relative flex items-center gap-1.5 px-3 py-2 bg-bg-card border border-border rounded-xl text-xs font-semibold text-text shadow-xs hover:border-accent/50 hover:shadow-sm transition-all cursor-pointer group">
            <Calendar size={13} className="text-accent shrink-0 group-hover:scale-110 transition-transform" />
            <span className="select-none font-semibold text-text">{currentDateStr}</span>
            <input
              type="date"
              value={dateIso}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                setDateIso(val);
                const [y, m, d] = val.split('-');
                const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                setCurrentDateStr(dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Click to select a date or view calendar"
            />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-accent dark:hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <OverviewStatCards />

      {/* Middle 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesTrendChart />
        </div>
        <div className="lg:col-span-4">
          <RevenueBreakdownCard />
        </div>
      </div>

      {/* Bottom Recent Transactions Table */}
      <TransactionsTable globalSearch={searchQuery} />

      {/* Advanced Executive Briefing & Strategy Accordion / Cards */}
      <div className="pt-4 border-t border-border/60">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            Executive Intelligence & Autonomous Workforce Health
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CEOBriefing />
          <GoalTracker />
        </div>
      </div>
    </div>
  );
}

function ClientsView({ onEdit, onRequestDelete, onViewDetail, searchQuery }) {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">Customer Portfolio</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Manage your enterprise client accounts and track contract volume
        </p>
      </div>
      <ClientSummaryCards />
      <ClientTable onEdit={onEdit} onRequestDelete={onRequestDelete} onViewDetail={onViewDetail} globalSearch={searchQuery} />
    </>
  );
}

function ExpensesView({ onEdit, onRequestDelete, searchQuery }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">Expenses</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Track and manage operational business expenses
          </p>
        </div>
      </div>
      <ExpenseSummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ExpenseTable onEdit={onEdit} onRequestDelete={onRequestDelete} globalSearch={searchQuery} />
        </div>
        <ExpenseDonutChart />
      </div>
    </>
  );
}

function LeadsView({ onEdit, onRequestDelete, searchQuery }) {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">Lead Pipeline</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Track prospects through your sales pipeline
        </p>
      </div>
      <LeadBoard onEdit={onEdit} onRequestDelete={onRequestDelete} globalSearch={searchQuery} />
    </>
  );
}

function InvoicesView({ onEdit, onView, onRequestDelete, searchQuery, onAdd }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Invoices & Client Settlements</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Create, track, and manage enterprise client invoices with multi-channel payment details
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Plus size={14} />
          <span>New Invoice</span>
        </button>
      </div>
      <InvoiceTable onEdit={onEdit} onView={onView} onRequestDelete={onRequestDelete} globalSearch={searchQuery} />
    </>
  );
}

function TeamView({ onEdit, onRequestDelete }) {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">Team & Compensation</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Manage team members, commission structures, and payouts
        </p>
      </div>
      <TeamGrid onEdit={onEdit} onRequestDelete={onRequestDelete} />
      <PayoutCalculator />
    </>
  );
}

function AgentsView() {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">AI Agents Workforce</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Autonomous AI agents operating your agency pipeline
        </p>
      </div>
      <AgentGrid />
    </>
  );
}

function SystemView({ onEdit, onRequestDelete }) {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">System Health & Automations</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Monitor webhook workflows, background jobs, and API credit usage
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AutomationGrid onEdit={onEdit} onRequestDelete={onRequestDelete} />
        </div>
        <div className="space-y-4">
          <CreditMonitor />
          <TestEmailButton />
        </div>
      </div>
    </>
  );
}

function AccessRestrictedView({ onReturnAllowed }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-bg-card border border-border rounded-2xl shadow-xs animate-fade-in max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-4 border border-danger/20">
        <Lock size={28} />
      </div>
      <h2 className="text-base font-bold text-text mb-1.5">
        Access Restricted: Module Not Assigned
      </h2>
      <p className="text-xs text-text-muted leading-relaxed max-w-sm mb-6">
        Your account permissions configured by CEO Mahmud Hasan do not include access to this dashboard section. Please contact your CEO if you require access.
      </p>
      <button
        type="button"
        onClick={onReturnAllowed}
        className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
      >
        Return to Allowed Workspace
      </button>
    </div>
  );
}
