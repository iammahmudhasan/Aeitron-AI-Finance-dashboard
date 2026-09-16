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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RolesManagementView() {
  const { currentUser, users, addUser, deleteUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sales Operator');
  const [department, setDepartment] = useState('Sales & Growth');
  const [password, setPassword] = useState('admin');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!email || !name) return;

    addUser({
      name,
      email,
      role,
      roleKey: role.toLowerCase().includes('sales')
        ? 'sales'
        : role.toLowerCase().includes('finance')
        ? 'finance'
        : 'operator',
      department,
      badge: role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces`,
      permissions: ['dashboard', 'orders', 'clients', 'transactions'],
    });

    setModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-accent" size={24} />
            Roles & Permissions Management
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Configure access credentials and operational roles for company executives and operators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          <UserPlus size={15} />
          <span>Add Team Account</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => {
          const isCurrent = u.email.toLowerCase() === currentUser?.email.toLowerCase();

          return (
            <div
              key={u.id}
              className={`bg-bg-card border rounded-2xl p-5 shadow-xs transition-all relative ${
                isCurrent ? 'border-accent ring-2 ring-accent/15' : 'border-border/80 hover:border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text">{u.name}</h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent text-white">
                          Active Session
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted font-medium">{u.role}</div>
                    <div className="text-[11px] text-text-muted/80 font-mono mt-0.5">{u.email}</div>
                  </div>
                </div>

                {u.email !== 'ceo@aeitron.com' && (
                  <button
                    type="button"
                    onClick={() => deleteUser(u.email)}
                    className="text-text-muted hover:text-danger p-1 rounded-lg hover:bg-bg transition-colors"
                    title="Remove user"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              {/* Department and Permissions */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-text-muted text-[11px] block">Department</span>
                  <span className="font-semibold text-text">{u.department || 'Operations'}</span>
                </div>

                <div>
                  <span className="text-text-muted text-[11px] block">Default Pass</span>
                  <span className="font-mono text-text bg-bg px-2 py-0.5 rounded border border-border">admin</span>
                </div>

                <div>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-success font-semibold px-2.5 py-1 rounded-lg bg-success/10 border border-success/20">
                      <CheckCircle2 size={13} />
                      Current Session
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted px-2.5 py-1 rounded-lg bg-bg border border-border">
                      Registered Member
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Create Business Account</h3>
              <button
                onClick={() => setModalOpen(false)}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Login Email</label>
                <input
                  type="email"
                  required
                  placeholder="rachel@aeitron.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Role Position</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
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
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Initial Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
