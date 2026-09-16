import { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Key,
  CheckCircle2,
  Trash2,
  Lock,
  Mail,
  User,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Settings,
  Sliders,
  Shield,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_MODULES } from '../../utils/auth';

const ROLE_PRESETS = {
  sales: {
    label: 'Sales Suite',
    icon: '💼',
    permissions: ['dashboard', 'products', 'transactions', 'clients', 'channels', 'orders', 'campaigns', 'messages', 'leads'],
  },
  finance: {
    label: 'Finance Suite',
    icon: '📊',
    permissions: ['dashboard', 'expenses', 'invoices', 'transactions', 'billing', 'reports', 'messages'],
  },
  operations: {
    label: 'AI Operations',
    icon: '🤖',
    permissions: ['dashboard', 'integrations', 'system', 'support', 'messages', 'channels'],
  },
  minimal: {
    label: 'Minimal (Chat & Overview)',
    icon: '🔒',
    permissions: ['dashboard', 'messages'],
  },
  all: {
    label: 'Full Access (All Modules)',
    icon: '🌟',
    permissions: AVAILABLE_MODULES.map((m) => m.id),
  },
};

export default function RolesManagementView() {
  const {
    currentUser,
    users,
    isCEO,
    addUser,
    updateUser,
    deleteUser,
    getUserPassword,
    setUserPassword,
  } = useAuth();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [configUser, setConfigUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [memberPassword, setMemberPassword] = useState('');
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Add Account Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Sales Operator');
  const [newDepartment, setNewDepartment] = useState('Sales & Growth');
  const [newPassword, setNewPassword] = useState('member@2026');

  // Toggle password visibility in cards
  const toggleCardPassword = (email) => {
    setVisiblePasswords((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  // Open Permissions & Password Control Modal for a team member
  const handleOpenConfig = (user) => {
    setConfigUser(user);
    setSelectedPermissions(Array.isArray(user.permissions) ? [...user.permissions] : ['dashboard', 'messages']);
    setMemberPassword(getUserPassword(user.email) || user.defaultPassword || 'member@2026');
    setShowMemberPassword(false);
    setSaveSuccess(false);
  };

  // Toggle individual module permission
  const handleToggleModule = (moduleId) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  // Apply a quick permission preset
  const handleApplyPreset = (presetKey) => {
    const preset = ROLE_PRESETS[presetKey];
    if (preset) {
      setSelectedPermissions([...preset.permissions]);
    }
  };

  // Save changes from Config Modal
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!configUser) return;

    // 1. Update password
    if (memberPassword && memberPassword.trim()) {
      await setUserPassword(configUser.email, memberPassword.trim());
    }

    // 2. Update user permissions & record
    updateUser({
      ...configUser,
      permissions: selectedPermissions,
      defaultPassword: memberPassword.trim() || configUser.defaultPassword,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setConfigUser(null);
    }, 800);
  };

  // Handle Add Member Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    // Assign initial permissions based on selected role
    let initialPerms = ROLE_PRESETS.sales.permissions;
    if (newRole.toLowerCase().includes('finance')) {
      initialPerms = ROLE_PRESETS.finance.permissions;
    } else if (newRole.toLowerCase().includes('operations') || newRole.toLowerCase().includes('ai')) {
      initialPerms = ROLE_PRESETS.operations.permissions;
    }

    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      roleKey: newRole.toLowerCase().includes('sales')
        ? 'sales'
        : newRole.toLowerCase().includes('finance')
        ? 'finance'
        : 'operator',
      department: newDepartment,
      badge: newRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces`,
      permissions: initialPerms,
      defaultPassword: newPassword || 'member@2026',
    });

    setAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('member@2026');
  };

  // Strict CEO access check
  if (!isCEO) {
    return (
      <div className="p-8 bg-bg-card border border-border rounded-2xl text-center max-w-lg mx-auto mt-12 space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
          <Lock size={24} />
        </div>
        <h2 className="text-base font-bold text-text">Executive Authorization Required</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          Only CEO Mahmud Hasan has permission to configure credentials and role-based dashboard controls for agency staff.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-accent" size={24} />
            Role-Based Dashboard Control & Access Management
          </h2>
          <p className="text-xs text-text-muted mt-1">
            As CEO, configure custom passwords and granular module access for each company operator.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Add Team Account</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => {
          const isUserCeo = u.email.toLowerCase() === 'ceo@aeitron.com' || u.role === 'CEO & Founder';
          const isCurrent = u.email.toLowerCase() === currentUser?.email.toLowerCase();
          const currentPassword = isUserCeo ? 'admin' : (getUserPassword(u.email) || u.defaultPassword || 'member@2026');
          const isPassVisible = visiblePasswords[u.email];
          const grantedCount = isUserCeo ? AVAILABLE_MODULES.length : (Array.isArray(u.permissions) ? u.permissions.length : 0);

          return (
            <div
              key={u.id || u.email}
              className={`bg-bg-card border rounded-2xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                isCurrent ? 'border-accent ring-2 ring-accent/15' : 'border-border/80 hover:border-border'
              }`}
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-text truncate">{u.name}</h3>
                        {isUserCeo ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            👑 Master CEO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-accent/10 text-accent">
                            {u.role}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent text-white">
                            Active Session
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted/80 font-mono mt-0.5 truncate">{u.email}</div>
                    </div>
                  </div>

                  {!isUserCeo && (
                    <button
                      type="button"
                      onClick={() => deleteUser(u.email)}
                      className="text-text-muted hover:text-danger p-1.5 rounded-lg hover:bg-bg transition-colors"
                      title="Remove team account"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Role-Based Permissions Summary */}
                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted text-[11px]">Dashboard Access</span>
                    <span className="font-semibold text-xs text-text">
                      {isUserCeo ? (
                        <span className="text-success font-bold">Full Master Access (18/18)</span>
                      ) : (
                        <span className="text-accent font-bold">
                          {grantedCount} of {AVAILABLE_MODULES.length} Modules Granted
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Module pills preview */}
                  {!isUserCeo && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Array.isArray(u.permissions) && u.permissions.slice(0, 5).map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 text-[10px] font-medium bg-bg text-text-muted rounded-md border border-border/80"
                        >
                          {perm}
                        </span>
                      ))}
                      {Array.isArray(u.permissions) && u.permissions.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-text-muted/70 bg-bg rounded-md border border-border/60">
                          +{u.permissions.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Credentials & Department Row */}
                <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-text-muted text-[11px] block">Department</span>
                    <span className="font-medium text-text">{u.department || 'Operations'}</span>
                  </div>

                  <div>
                    <span className="text-text-muted text-[11px] block">Login Password</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-text bg-bg px-2 py-0.5 rounded border border-border text-[11px]">
                        {isPassVisible ? currentPassword : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCardPassword(u.email)}
                        className="p-1 text-text-muted hover:text-text hover:bg-bg rounded transition-colors"
                        title={isPassVisible ? 'Hide password' : 'Show password'}
                      >
                        {isPassVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                {isUserCeo ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-success font-semibold px-2.5 py-1 rounded-lg bg-success/10 border border-success/20">
                    <CheckCircle2 size={13} />
                    Primary Administrator
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenConfig(u)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-bg hover:bg-accent/10 border border-border hover:border-accent/40 rounded-xl text-xs font-semibold text-text hover:text-accent transition-all cursor-pointer shadow-xs"
                  >
                    <Sliders size={14} className="text-accent" />
                    <span>Configure Dashboard Access & Password</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-Based Dashboard Control Modal (CEO Exclusive) */}
      {configUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-bg/30">
              <div className="flex items-center gap-3">
                <img
                  src={configUser.avatar}
                  alt={configUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-border"
                />
                <div>
                  <h3 className="text-sm font-bold text-text flex items-center gap-2">
                    <span>Role-Based Control: {configUser.name}</span>
                    <span className="text-[11px] font-semibold text-accent px-2 py-0.5 bg-accent/10 rounded-full">
                      {configUser.role}
                    </span>
                  </h3>
                  <p className="text-[11px] text-text-muted font-mono">{configUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setConfigUser(null)}
                className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveConfig} className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
              {/* Section 1: Dedicated Password Control */}
              <div className="bg-bg/50 border border-border/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text flex items-center gap-1.5">
                    <Key size={14} className="text-accent" />
                    <span>Member Login Password</span>
                  </label>
                  <span className="text-[10px] text-danger font-semibold">
                    Non-admin credential (cannot use 'admin')
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showMemberPassword ? 'text' : 'password'}
                    required
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="Enter custom password"
                    className="w-full pl-3 pr-10 py-2 bg-bg-card border border-border rounded-xl text-text font-mono text-xs outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMemberPassword(!showMemberPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showMemberPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-text-muted">
                  This operator will log in using this password. Only CEO Mahmud Hasan can edit or change it.
                </p>
              </div>

              {/* Section 2: Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text flex items-center gap-1.5">
                    <Sparkles size={14} className="text-accent" />
                    <span>Quick Access Presets</span>
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {selectedPermissions.length} of {AVAILABLE_MODULES.length} modules selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(ROLE_PRESETS).map(([key, preset]) => {
                    const isAllSelected = preset.permissions.every((p) => selectedPermissions.includes(p));
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleApplyPreset(key)}
                        className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                          isAllSelected
                            ? 'bg-accent/15 border-accent text-accent shadow-xs'
                            : 'bg-bg border-border/80 text-text-muted hover:text-text hover:border-border'
                        }`}
                      >
                        <span className="text-sm">{preset.icon}</span>
                        <span className="text-[11px] truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Granular Module Access Control Checkboxes */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-text block">
                  Granular Dashboard Modules Permission Matrix
                </span>

                {/* Group modules by category */}
                {['Main Menu', 'Customers & CRM', 'Finance & Operations', 'Support & System'].map((category) => {
                  const categoryModules = AVAILABLE_MODULES.filter((m) => m.category === category);
                  if (categoryModules.length === 0) return null;

                  return (
                    <div key={category} className="bg-bg/30 border border-border/60 rounded-xl p-3 space-y-2">
                      <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                        {category}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categoryModules.map((mod) => {
                          const isChecked = selectedPermissions.includes(mod.id);

                          return (
                            <label
                              key={mod.id}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-accent/10 border-accent/60 text-text'
                                  : 'bg-bg-card border-border/60 text-text-muted hover:border-border hover:text-text'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleModule(mod.id)}
                                className="mt-0.5 rounded text-accent focus:ring-accent accent-accent"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold flex items-center justify-between">
                                  <span>{mod.name}</span>
                                  {isChecked && (
                                    <span className="text-[9px] font-bold text-accent bg-accent/15 px-1.5 py-0.2 rounded">
                                      Allowed
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-text-muted/80 line-clamp-1 mt-0.5">
                                  {mod.description}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPermissions(AVAILABLE_MODULES.map((m) => m.id))}
                    className="text-[11px] text-accent hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-text-muted text-[10px]">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPermissions(['dashboard', 'messages'])}
                    className="text-[11px] text-text-muted hover:underline cursor-pointer"
                  >
                    Clear to Minimum
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfigUser(null)}
                    className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text hover:bg-bg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    {saveSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved & Applied!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Save Permissions & Password</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Create Business Account</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Login Email</label>
                <input
                  type="email"
                  required
                  placeholder="rachel@aeitron.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Role Position</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="Sales Operator">Sales Operator</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="AI Operations Lead">AI Operations Lead</option>
                    <option value="Account Executive">Account Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1 font-medium">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Client Success"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium flex items-center justify-between">
                  <span>Initial Password</span>
                  <span className="text-[10px] text-danger font-semibold">Non-admin credential</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. rachel@2026"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-text hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
