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
import MetricFlowKpiCards from '../components/cards/MetricFlowKpiCards';
import MonthlySalesPerformanceChart from '../components/charts/MonthlySalesPerformanceChart';
import SalesByCountryCard from '../components/cards/SalesByCountryCard';
import TopProductSalesTable from '../components/tables/TopProductSalesTable';
import OverviewStatCards from '../components/cards/OverviewStatCards';
import EarningsLineChart from '../components/charts/EarningsLineChart';
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
import RealtimeCalendarPicker from '../components/shared/RealtimeCalendarPicker';
import ProjectsView from '../components/projects/ProjectsView';
import TaskBoardView from '../components/tasks/TaskBoardView';
import AttendanceLeaveView from '../components/hr/AttendanceLeaveView';
import PayrollView from '../components/hr/PayrollView';
import CrmPipelineView from '../components/crm/CrmPipelineView';
import CashFlowRunwayCard from '../components/finance/CashFlowRunwayCard';
import KnowledgeBaseView from '../components/knowledge/KnowledgeBaseView';

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
    } else if (activeView === 'dashboard' || activeView === 'transactions') {
      window.dispatchEvent(new CustomEvent('open-add-transaction'));
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

          {/* Projects Hub & Delivery */}
          {activeView === 'projects' && <ProjectsView />}

          {/* Task Board & Workflow */}
          {activeView === 'tasks' && <TaskBoardView />}

          {/* Attendance & Leave Tracking */}
          {activeView === 'attendance' && <AttendanceLeaveView />}

          {/* Payroll & Compensation */}
          {activeView === 'payroll' && <PayrollView />}

          {/* CRM Sales Pipeline */}
          {activeView === 'pipeline' && <CrmPipelineView />}

          {/* Cash Flow & Runway */}
          {activeView === 'cashflow' && <CashFlowRunwayCard />}

          {/* Internal Knowledge Base */}
          {activeView === 'knowledge' && <KnowledgeBaseView />}

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

  const handleExportCsv = () => {
    const kpis = {
      Daily: { rev: '$2,840', ord: '64', cust: '18', conv: '3.8%' },
      Weekly: { rev: '$14,650', ord: '420', cust: '95', conv: '3.5%' },
      Monthly: { rev: '$24,500', ord: '1,240', cust: '320', conv: '3.2%' },
      Yearly: { rev: '$298,400', ord: '15,620', cust: '3,950', conv: '3.6%' },
    }[timeframe] || { rev: '$2,840', ord: '64', cust: '18', conv: '3.8%' };

    const csvContent = "data:text/csv;charset=utf-8," 
      + `Aeitron Overview Report - Timeframe: ${timeframe}\n`
      + "Metric,Value\n"
      + `Total Revenue,${kpis.rev}\n`
      + `Total Orders,${kpis.ord}\n`
      + `New Customers,${kpis.cust}\n`
      + `Conversion Rate,${kpis.conv}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aeitron_Overview_${timeframe}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Here's what's happening across your AI Automation Agency today.
          </p>
        </div>

        {/* Right Tools: Daily dropdown, Date, Export CSV */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Daily / Monthly Dropdown */}
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="h-10 appearance-none pl-4 pr-8.5 bg-[#181a22] border border-[#262934] rounded-full text-xs sm:text-sm font-semibold text-text outline-none cursor-pointer hover:bg-[#202330] transition-colors shadow-xs"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Real-time Interactive Date / Calendar Picker */}
          <RealtimeCalendarPicker />

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-10 flex items-center gap-2 px-4.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Obsidian & Coral Metric Flow KPI Cards */}
      <MetricFlowKpiCards timeframe={timeframe} />

      {/* Row 2: Monthly Sales Performance (Full Width) */}
      <div className="w-full">
        <MonthlySalesPerformanceChart />
      </div>

      {/* Row 3: Sales by Country & Top Product Sales (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <SalesByCountryCard timeframe={timeframe} />
        </div>
        <div className="lg:col-span-7">
          <TopProductSalesTable timeframe={timeframe} />
        </div>
      </div>

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
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Customer Portfolio</h2>
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
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Expenses</h2>
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
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Lead Pipeline</h2>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Invoices & Client Settlements</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Create, track, and manage enterprise client invoices with multi-channel payment details
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="h-10 flex items-center gap-2 px-4.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} />
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
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Team & Compensation</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Manage team members, commission structures, and payouts
        </p>
      </div>
      <TeamGrid onEdit={onEdit} onRequestDelete={onRequestDelete} />
      <PayoutCalculator />
    </>
  );
}

function SystemView({ onEdit, onRequestDelete }) {
  return (
    <>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">System Health & Automations</h2>
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
