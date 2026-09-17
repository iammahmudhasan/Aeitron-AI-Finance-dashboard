import { useState } from 'react';
import { Menu, Plus, Search, Bell, Sun, Moon, ChevronRight, HelpCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../notifications/NotificationPanel';
import DownloadReportButton from '../shared/DownloadReportButton';

const VIEW_TITLES = {
  dashboard: 'Overview',
  products: 'Products',
  transactions: 'Transactions',
  reports: 'Reports & Analytics',
  messages: 'Team Chat',
  team: 'Team Performance',
  campaigns: 'Campaigns',
  clients: 'Customer List',
  channels: 'Channels',
  orders: 'Order Management',
  roles: 'Roles & Permissions',
  billing: 'Billing & Subscription',
  integrations: 'Integrations',
  support: 'Customer Support',
  help: 'Help Center',
  system: 'System Settings',
  expenses: 'Expense Tracker',
  invoices: 'Invoices',
  agents: 'AI Agents',
  discovery: 'Lead Discovery',
};

const VIEW_ACTIONS = {
  dashboard: 'New Transaction',
  invoices: 'New Invoice',
  transactions: 'New Transaction',
  clients: 'New Client',
  expenses: 'New Expense',
  leads: 'New Lead',
  team: 'Add Member',
  orders: 'New Order',
  campaigns: 'New Campaign',
  products: 'Add Product',
  system: 'New Automation',
  reports: 'Export Report',
  channels: 'New Channel',
  roles: 'Add Role',
  billing: 'New Subscription',
  integrations: 'New Integration',
  support: 'New Ticket',
  help: 'New Ticket',
  agents: 'Deploy Agent',
  discovery: 'Find Leads',
  messages: 'New Chat',
};

export default function Topbar({ onMenuClick, onAddClient, activeView, searchQuery = '', onSearchChange }) {
  const currentViewTitle = VIEW_TITLES[activeView] || 'Overview';
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const actionLabel = VIEW_ACTIONS[activeView] || 'New Action';

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-[68px] bg-bg/90 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sm:px-8">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text p-1 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text-muted">
          <span className="hover:text-text cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight size={14} className="text-text-muted/60" />
          <span className="text-text font-semibold">{currentViewTitle}</span>
        </div>
      </div>

      {/* Right: Search + Quick Tools + Theme + Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search with Pill Styling matching Mockup */}
        <div className="hidden md:flex items-center gap-2.5 h-10 px-4 bg-[#181a22] border border-[#262934] rounded-full w-64 lg:w-72 shadow-xs transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 shrink-0">
          <Search size={15} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-text-muted/60 w-full"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-text-muted/70 bg-[#12141a] border border-[#262934] rounded-full shadow-xs shrink-0">
            ⌘K
          </kbd>
        </div>

        {/* Contextual Action Button */}
        <button
          type="button"
          onClick={onAddClient}
          className="h-10 flex items-center gap-2 px-4.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0"
          title={actionLabel}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{actionLabel}</span>
        </button>

        {/* Download Report */}
        <DownloadReportButton />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-white bg-[#181a22] border border-[#262934] rounded-full transition-colors cursor-pointer shrink-0"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} className="text-warning" /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:text-white bg-[#181a22] border border-[#262934] rounded-full transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5530] ring-2 ring-[#181a22]" />
            )}
          </button>
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User Circular Avatar */}
        <div className="flex items-center gap-2 pl-1 shrink-0">
          <img
            src={currentUser?.avatar || '/aeitron_icon_fb.png'}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover border border-[#262934] shadow-xs cursor-pointer hover:ring-2 hover:ring-accent transition-all"
            title={`${currentUser?.name} (${currentUser?.role})`}
          />
        </div>
      </div>
    </header>
  );
}
