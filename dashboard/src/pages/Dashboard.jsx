import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  Download,
  Package,
  ShoppingCart,
  Megaphone,
  CreditCard,
  Layers,
  HelpCircle,
  Headphones,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewStatCards from '../components/cards/OverviewStatCards';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import RevenueBreakdownCard from '../components/charts/RevenueBreakdownCard';
import TransactionsTable from '../components/transactions/TransactionsTable';
import RolesManagementView from '../components/management/RolesManagementView';

// Existing Components
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
  const { currentUser } = useAuth();
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
          {/* Main Dashboard Overview */}
          {activeView === 'dashboard' && (
            <DashboardView currentUser={currentUser} searchQuery={searchQuery} />
          )}

          {/* Transactions dedicated view */}
          {activeView === 'transactions' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-text">Business Transactions</h2>
                <p className="text-xs text-text-muted mt-0.5">Real-time ledger of inbound and outbound sales</p>
              </div>
              <TransactionsTable globalSearch={searchQuery} />
            </div>
          )}

          {/* Roles & Permissions Management view */}
          {activeView === 'roles' && <RolesManagementView />}

          {/* Products View */}
          {activeView === 'products' && (
            <GenericCatalogView
              title="Products & Services"
              subtitle="Manage your agency services, AI packages, and hardware offerings"
              icon={Package}
            />
          )}

          {/* Orders View */}
          {activeView === 'orders' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-text">Order Management</h2>
                <p className="text-xs text-text-muted mt-0.5">Track fulfillment, shipping status, and client orders</p>
              </div>
              <TransactionsTable globalSearch={searchQuery} />
            </div>
          )}

          {/* Reports & Analytics View */}
          {activeView === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-text">Reports & Financial Analytics</h2>
                <p className="text-xs text-text-muted mt-0.5">Multi-channel performance metrics and forecasts</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SalesTrendChart />
                </div>
                <div>
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

          {/* Campaigns */}
          {activeView === 'campaigns' && (
            <GenericCatalogView
              title="Marketing & Growth Campaigns"
              subtitle="Automated email sequences, outbound outreach, and ad campaigns"
              icon={Megaphone}
            />
          )}

          {/* Billing & Subscription */}
          {activeView === 'billing' && (
            <GenericCatalogView
              title="Billing & Subscriptions"
              subtitle="Manage SaaS subscriptions, client retainer recurring payments, and merchant accounts"
              icon={CreditCard}
            />
          )}

          {/* Integrations */}
          {activeView === 'integrations' && (
            <GenericCatalogView
              title="App & API Integrations"
              subtitle="Connect Stripe, PayPal, Quickbooks, OpenAI, and custom webhooks"
              icon={Layers}
            />
          )}

          {/* Support & Help */}
          {(activeView === 'support' || activeView === 'help') && (
            <GenericCatalogView
              title="Customer Support & Help Desk"
              subtitle="24/7 Priority assistance for Aeitron AI Finance Platform"
              icon={Headphones}
            />
          )}

          {/* Standard Views */}
          {activeView === 'clients' && (
            <ClientsView
              onEdit={handleEditClient}
              onRequestDelete={handleRequestDelete}
              onViewDetail={setDetailClient}
              searchQuery={searchQuery}
            />
          )}
          {activeView === 'expenses' && (
            <ExpensesView onEdit={handleEditExpense} onRequestDelete={handleRequestDelete} searchQuery={searchQuery} />
          )}
          {activeView === 'leads' && (
            <LeadsView onEdit={handleEditLead} onRequestDelete={handleRequestDelete} searchQuery={searchQuery} />
          )}
          {activeView === 'invoices' && (
            <InvoicesView
              onEdit={handleEditInvoice}
              onView={setViewInvoice}
              onRequestDelete={handleRequestDelete}
              searchQuery={searchQuery}
            />
          )}
          {activeView === 'agents' && <AgentsView />}
          {activeView === 'discovery' && <LeadDiscovery />}
          {activeView === 'team' && (
            <TeamView
              onEdit={handleEditMember}
              onRequestDelete={handleRequestDelete}
            />
          )}
          {activeView === 'system' && (
            <SystemView
              onEdit={handleEditAutomation}
              onRequestDelete={handleRequestDelete}
            />
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
            Here's what's happening with your business finance today.
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

          {/* Date Picker Button */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-card border border-border rounded-xl text-xs font-semibold text-text shadow-xs">
            <Calendar size={13} className="text-text-muted" />
            <span>6 Nov 2025</span>
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
            Executive Intelligence & Operational Growth
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

function GenericCatalogView({ title, subtitle, icon: Icon }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent/15 text-accent rounded-2xl">
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text">{title}</h2>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="bg-bg-card border border-border/80 rounded-2xl p-8 text-center shadow-xs">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <Icon size={22} />
          </div>
          <h3 className="text-sm font-bold text-text">Connected Modules Live</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            All records for this module are automatically synchronized with the main finance ledger and transactions database.
          </p>
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

function InvoicesView({ onEdit, onView, onRequestDelete, searchQuery }) {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-text">Invoices & Settlements</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Create, track, and manage client invoices with multi-channel payment details
        </p>
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
