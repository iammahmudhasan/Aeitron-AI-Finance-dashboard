import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  FileText,
  BarChart3,
  MessageSquare,
  Users,
  Megaphone,
  UsersRound,
  Globe,
  ClipboardList,
  ShieldCheck,
  CreditCard,
  Layers,
  Headphones,
  HelpCircle,
  Settings,
  ChevronsUpDown,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  FolderKanban,
  CheckSquare,
  CalendarCheck,
  Banknote,
  GitPullRequest,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileSettingsModal from '../profile/ProfileSettingsModal';

const NAV_GROUPS = [
  {
    label: 'Main Operations',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
      { icon: FolderKanban, label: 'Projects Hub', view: 'projects' },
      { icon: CheckSquare, label: 'Task Board', view: 'tasks' },
      { icon: MessageSquare, label: 'Team Messages', view: 'messages' },
      { icon: Package, label: 'Products & AI', view: 'products' },
      { icon: Megaphone, label: 'Campaigns', view: 'campaigns' },
    ],
  },
  {
    label: 'Team & HR',
    items: [
      { icon: Users, label: 'Employee Directory', view: 'team' },
      { icon: CalendarCheck, label: 'Attendance & Leaves', view: 'attendance' },
      { icon: Banknote, label: 'Payroll & Comp', view: 'payroll' },
    ],
  },
  {
    label: 'Finance & Accounts',
    items: [
      { icon: FileText, label: 'Invoices & Billing', view: 'invoices' },
      { icon: Receipt, label: 'Transactions', view: 'transactions' },
      { icon: TrendingUp, label: 'Cash Flow & Runway', view: 'cashflow' },
      { icon: BarChart3, label: 'Reports & Analytics', view: 'reports' },
      { icon: CreditCard, label: 'Billing & Plans', view: 'billing' },
    ],
  },
  {
    label: 'Client & Delivery',
    items: [
      { icon: GitPullRequest, label: 'Sales CRM Pipeline', view: 'pipeline' },
      { icon: UsersRound, label: 'Customer Portfolio', view: 'clients' },
      { icon: ClipboardList, label: 'Order Deliverables', view: 'orders' },
      { icon: Globe, label: 'Acquisition Channels', view: 'channels' },
    ],
  },
  {
    label: 'Knowledge & Integrations',
    items: [
      { icon: BookOpen, label: 'Knowledge Base', view: 'knowledge' },
      { icon: Layers, label: 'Integrations Hub', view: 'integrations' },
    ],
  },
  {
    label: 'Settings & Admin',
    items: [
      { icon: ShieldCheck, label: 'Roles & Permissions', view: 'roles' },
      { icon: Headphones, label: 'Customer Support', view: 'support' },
      { icon: HelpCircle, label: 'Help Center', view: 'help' },
      { icon: Settings, label: 'System Settings', view: 'system' },
    ],
  },
];

export default function Sidebar({ open, onClose, activeView, onNavigate }) {
  const { currentUser, logout, isCEO, hasPermission } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('aeitron_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Dynamic unread count for messages - strictly 0 when user is viewing messages
  const [unreadMessages, setUnreadMessages] = useState(() => {
    if (activeView === 'messages') return 0;
    try {
      const stored = localStorage.getItem('aeitron_team_hub_channel_v4');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.reduce((sum, t) => sum + (Number(t.unread) || 0), 0);
      }
    } catch {}
    return 0;
  });

  // Whenever activeView becomes 'messages', immediately remove the badge
  useEffect(() => {
    if (activeView === 'messages') {
      setUnreadMessages(0);
      try {
        const stored = localStorage.getItem('aeitron_team_hub_channel_v4');
        if (stored) {
          const parsed = JSON.parse(stored);
          const cleared = parsed.map((t) => ({ ...t, unread: 0 }));
          localStorage.setItem('aeitron_team_hub_channel_v4', JSON.stringify(cleared));
        }
      } catch {}
    }
  }, [activeView]);

  // Real-time unread count updates via BroadcastChannel and storage events
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('aeitron_team_chat_channel');
      bc.onmessage = (e) => {
        if (e.data?.type === 'SYNC_THREADS' && Array.isArray(e.data.threads)) {
          if (activeView === 'messages') {
            setUnreadMessages(0);
          } else {
            const count = e.data.threads.reduce((sum, t) => sum + (Number(t.unread) || 0), 0);
            setUnreadMessages(count);
          }
        }
      };
    } catch {}

    const handleStorage = (e) => {
      if (e.key === 'aeitron_team_hub_channel_v4' && e.newValue) {
        if (activeView === 'messages') {
          setUnreadMessages(0);
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            const count = parsed.reduce((sum, t) => sum + (Number(t.unread) || 0), 0);
            setUnreadMessages(count);
          } catch {}
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeView]);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileMenuOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('aeitron_sidebar_collapsed', String(next));
    } catch {}
  }

  function handleNav(view) {
    if (view === 'messages') {
      // Immediately clear unread messages when clicked
      setUnreadMessages(0);
      try {
        const stored = localStorage.getItem('aeitron_team_hub_channel_v4');
        if (stored) {
          const parsed = JSON.parse(stored);
          const cleared = parsed.map((t) => ({ ...t, unread: 0 }));
          localStorage.setItem('aeitron_team_hub_channel_v4', JSON.stringify(cleared));
          const bc = new BroadcastChannel('aeitron_team_chat_channel');
          bc.postMessage({ type: 'SYNC_THREADS', threads: cleared });
          bc.close();
        }
      } catch {}
    }
    onNavigate(view);
    onClose();
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border
          flex flex-col transition-all duration-200 select-none
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'w-[76px]' : 'w-[260px]'}
          ${open ? 'translate-x-0 animate-slide-in' : '-translate-x-full'}
        `}
      >
        {/* Header Agency Brand Header */}
        <div className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white p-1.5 shadow-sm border border-white/20 flex items-center justify-center shrink-0">
              <img
                src="/aeitron_logo.jpeg"
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/aeitron_icon_fb.png';
                }}
              />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="text-[17px] font-bold text-sidebar-text-active tracking-tight truncate block">
                  Aeitron AI
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={onClose}
              className="lg:hidden text-sidebar-text hover:text-sidebar-text-active p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapse button (Desktop only) */}
        <div className={`hidden lg:flex px-3 pt-2 ${collapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            onClick={toggleCollapsed}
            className="p-1 rounded-md text-sidebar-text/60 hover:text-sidebar-text-active hover:bg-sidebar-hover transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* Navigation items list filtered by CEO-assigned permissions */}
        <nav
          className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {NAV_GROUPS.map((group) => {
            // Filter items based on user's granted permissions
            const visibleItems = group.items.filter((item) => {
              if (item.view === 'roles') return isCEO;
              return hasPermission(item.view);
            });

            // If no items in this group are permitted for this user, do not render this group
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 py-1 text-[11px] font-semibold text-sidebar-text/50 uppercase tracking-wider">
                    {group.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = activeView === item.view;
                    const Icon = item.icon;
                    const itemBadge = item.view === 'messages'
                      ? (activeView === 'messages' || unreadMessages <= 0 ? null : unreadMessages)
                      : item.badge;

                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNav(item.view)}
                        title={collapsed ? item.label : undefined}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium
                          transition-all duration-150 cursor-pointer
                          ${collapsed ? 'justify-center px-2 py-2.5' : ''}
                          ${isActive
                            ? 'bg-accent/15 text-accent font-semibold shadow-xs'
                            : 'text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover'
                          }
                        `}
                      >
                        <Icon size={17} className={isActive ? 'text-accent' : 'text-sidebar-text/70'} />
                        {!collapsed && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}
                        {!collapsed && itemBadge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-accent/20 text-accent dark:bg-accent-light dark:text-accent">
                            {itemBadge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Profile Widget & Menu */}
        <div className="p-3 border-t border-sidebar-border relative" ref={profileMenuRef}>
          {/* Profile Dropdown Popup */}
          {profileMenuOpen && (
            <div className={`
              absolute bottom-full mb-2 bg-bg-card border border-border shadow-2xl rounded-2xl p-2.5 z-50 text-text
              animate-fade-in
              ${collapsed ? 'left-3 w-64' : 'left-3 right-3'}
            `}>
              <div className="p-2 border-b border-border/70 mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser?.avatar || '/aeitron_icon_fb.png'}
                    alt={currentUser?.name}
                    className="w-9 h-9 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-text truncate">{currentUser?.name}</div>
                    <div className="text-[11px] text-text-muted truncate">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-1 rounded-lg">
                  <span>{currentUser?.badge || currentUser?.role}</span>
                </div>
              </div>

              <div className="space-y-0.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setProfileSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-text hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
                >
                  <Settings size={14} className="text-text-muted" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Card Button */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`
              w-full flex items-center gap-3 p-2 rounded-xl
              bg-sidebar-hover/60 hover:bg-sidebar-hover text-sidebar-text-active
              transition-all border border-sidebar-border cursor-pointer
              ${collapsed ? 'justify-center p-2' : 'justify-between'}
            `}
            title={collapsed ? `${currentUser?.name} (${currentUser?.role})` : undefined}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || '/aeitron_icon_fb.png'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0"
              />
              {!collapsed && (
                <div className="min-w-0 text-left">
                  <div className="text-xs font-semibold text-sidebar-text-active truncate">
                    {currentUser?.name || 'Salung Prastyo'}
                  </div>
                  <div className="text-[11px] text-sidebar-text/60 truncate">
                    {currentUser?.role || 'Sales Operator'}
                  </div>
                </div>
              )}
            </div>
            {!collapsed && (
              <ChevronsUpDown size={14} className="text-sidebar-text/50 shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Profile Customization Settings Modal */}
      <ProfileSettingsModal
        isOpen={profileSettingsOpen}
        onClose={() => setProfileSettingsOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
