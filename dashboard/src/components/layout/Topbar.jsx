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
  messages: 'Messages',
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

export default function Topbar({ onMenuClick, onAddClient, activeView, searchQuery = '', onSearchChange }) {
  const currentViewTitle = VIEW_TITLES[activeView] || 'Overview';
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-bg/90 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text p-1 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <span className="hover:text-text cursor-pointer">Dashboard</span>
          <ChevronRight size={13} className="text-text-muted/60" />
          <span className="text-text font-semibold">{currentViewTitle}</span>
        </div>
      </div>

      {/* Right: Search + Quick Tools + Theme + Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search with ⌘K Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border rounded-xl w-60 shadow-sm transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
          <Search size={14} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-transparent outline-none text-xs text-text placeholder:text-text-muted/50 w-full"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-text-muted/80 bg-bg border border-border rounded shadow-xs shrink-0">
            ⌘K
          </kbd>
        </div>

        {/* Download Report */}
        <DownloadReportButton />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-text-muted hover:text-text hover:bg-bg-hover rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={17} className="text-warning" /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-text-muted hover:text-text hover:bg-bg-hover rounded-xl transition-colors border border-transparent hover:border-border cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] flex items-center justify-center px-1 text-[9px] font-bold text-white bg-danger rounded-full ring-2 ring-bg-card">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User Circular Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/80">
          <img
            src={currentUser?.avatar || '/aeitron_icon_fb.png'}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover border border-border shadow-xs"
            title={`${currentUser?.name} (${currentUser?.role})`}
          />
        </div>
      </div>
    </header>
  );
}
