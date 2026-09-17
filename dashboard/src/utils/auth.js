// Production-Grade Auth Configuration & Security Utilities
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours
export const DEFAULT_EMAIL = 'ceo@aeitron.com';
export const DEFAULT_PASSWORD = 'admin';
// SHA-256 hash of "admin"
export const DEFAULT_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

// Brute-force & Lockout configurations (as specified in AGENT.md)
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout
const STORAGE_CUSTOM_AUTH = 'aeitron_custom_credentials';
const STORAGE_FAILED_ATTEMPTS = 'aeitron_failed_login_attempts';
const STORAGE_LOCKOUT_UNTIL = 'aeitron_lockout_until';
export const STORAGE_USERS_LIST = 'aeitron_users_list';
export const STORAGE_ACTIVE_USER = 'aeitron_active_user';

/**
 * Granular Dashboard Modules available for CEO Role-Based Control.
 */
export const AVAILABLE_MODULES = [
  { id: 'dashboard', name: 'Dashboard Overview', category: 'Main Menu', description: 'Executive KPI cards, revenue metrics, goal tracking' },
  { id: 'projects', name: 'Projects Hub & Delivery', category: 'Client & Project Delivery', description: 'Client automation projects, stages, milestones, and SLA deadlines' },
  { id: 'tasks', name: 'Task & Team Workflow', category: 'Task & Team Workflow', description: 'Kanban task board, assignments, priorities, and billable timer' },
  { id: 'attendance', name: 'Attendance & Leave Tracking', category: 'Team & HR', description: 'Daily web check-in/out, leave quota deduction, and approval workflow' },
  { id: 'payroll', name: 'Payroll & Compensation', category: 'Team & HR', description: 'Monthly salary calculation, leave deduction, payslips, and expense rollup' },
  { id: 'pipeline', name: 'CRM & Sales Pipeline', category: 'Client & Project Delivery', description: 'Kanban lead stages (Lead, Qualified, Proposal, Won) and conversion' },
  { id: 'cashflow', name: 'Cash Flow & Runway', category: 'Finance & Accounting', description: 'Cash runway, monthly net burn rate, and per-client profitability' },
  { id: 'knowledge', name: 'Internal Knowledge Base', category: 'Knowledge & AI', description: 'Departmental SOPs, prompt libraries, and onboarding checklists' },
  { id: 'products', name: 'Products & Solutions', category: 'Main Menu', description: 'AI products catalog, pricing tiers, and packages' },
  { id: 'transactions', name: 'Transactions Ledger', category: 'Main Menu', description: 'Live settlement audit records and transaction history' },
  { id: 'reports', name: 'Reports & Analytics', category: 'Main Menu', description: 'Financial analytics, revenue charts, and margin breakdown' },
  { id: 'messages', name: 'Internal Team Chat', category: 'Main Menu', description: 'Agency communication channels and direct team messages' },
  { id: 'team', name: 'Employee Directory & Org', category: 'Team & HR', description: 'Staff directory, organizational structure, and compensation overview' },
  { id: 'campaigns', name: 'Campaigns', category: 'Main Menu', description: 'Outbound sales campaigns and conversion analytics' },

  { id: 'clients', name: 'Customer Portfolio', category: 'Client & Project Delivery', description: 'Enterprise client CRM records and contract values' },
  { id: 'channels', name: 'Channels', category: 'Client & Project Delivery', description: 'Client acquisition channels and pipeline tracking' },
  { id: 'orders', name: 'Order Management', category: 'Client & Project Delivery', description: 'Client project deliverables and fulfillment status' },

  { id: 'expenses', name: 'Expense Tracker', category: 'Finance & Accounting', description: 'Operational agency expenditures and category burn rates' },
  { id: 'invoices', name: 'Invoices & Billing', category: 'Finance & Accounting', description: 'Client invoicing, draft settlements, and paid receipts' },
  { id: 'billing', name: 'Billing & Subscriptions', category: 'Finance & Accounting', description: 'Agency software retainers and subscription plans' },
  { id: 'integrations', name: 'Integrations Hub', category: 'Knowledge & AI', description: 'API endpoints, telephony webhooks, and automation tools' },

  { id: 'support', name: 'Customer Support', category: 'Support & System', description: 'Client support tickets, SLA tracking, and responses' },
  { id: 'help', name: 'Help Center & Guides', category: 'Support & System', description: 'Agency standard operating procedures and documentation' },
  { id: 'system', name: 'System Settings', category: 'Support & System', description: 'Automations, telephony triggers, and system configuration' },
];

/**
 * Built-in business team accounts for multi-role operations.
 * CEO retains 'admin' default password and master access.
 * Non-CEO accounts have individual dedicated passwords and role-based permissions.
 */
export const DEFAULT_USERS = [
  {
    id: 'usr_ceo',
    name: 'Mahmud Hasan',
    email: 'ceo@aeitron.com',
    role: 'CEO & Founder',
    roleKey: 'ceo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    department: 'Executive',
    badge: '👑 Master Access',
    permissions: ['all'],
    defaultPassword: 'admin',
  },
  {
    id: 'usr_sales',
    name: 'Salung Prastyo',
    email: 'sales@aeitron.com',
    role: 'Sales Operator',
    roleKey: 'sales',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    department: 'Sales & Growth',
    badge: '💼 Commercial Lead',
    permissions: ['dashboard', 'pipeline', 'clients', 'orders', 'campaigns', 'products', 'transactions', 'messages', 'tasks', 'knowledge', 'attendance'],
    defaultPassword: 'sales@2026',
  },
  {
    id: 'usr_finance',
    name: 'Sarah Jenkins',
    email: 'finance@aeitron.com',
    role: 'Finance Manager',
    roleKey: 'finance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    department: 'Treasury & Accounts',
    badge: '📊 Financial Controller',
    permissions: ['dashboard', 'expenses', 'invoices', 'transactions', 'cashflow', 'payroll', 'billing', 'reports', 'messages', 'knowledge', 'attendance'],
    defaultPassword: 'finance@2026',
  },
  {
    id: 'usr_ops',
    name: 'Alex Rivera',
    email: 'ops@aeitron.com',
    role: 'AI Operations Lead',
    roleKey: 'operations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    department: 'AI & Automations',
    badge: '🤖 Systems Architect',
    permissions: ['dashboard', 'projects', 'tasks', 'integrations', 'system', 'support', 'messages', 'channels', 'knowledge', 'attendance'],
    defaultPassword: 'ops@2026',
  },
];

/**
 * Computes SHA-256 hash of string using Web Crypto API.
 */
export async function hashPassword(password) {
  if (typeof password !== 'string') return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates email format using standard regex.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Retrieves all registered users from storage or defaults.
 * Automatically upgrades existing storage so non-CEO accounts receive dedicated default passwords.
 */
export function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        const upgraded = parsed.map((u) => {
          const def = DEFAULT_USERS.find((d) => d.email.toLowerCase() === u.email?.toLowerCase());
          // Ensure non-CEO users do not inherit 'admin' as default password
          if (def) {
            const isNonCeo = u.email.toLowerCase() !== DEFAULT_EMAIL.toLowerCase();
            const needsPass = !u.defaultPassword || (isNonCeo && u.defaultPassword === 'admin');
            const needsPerms = !Array.isArray(u.permissions) || u.permissions.length === 0;
            if (needsPass || needsPerms) {
              changed = true;
              return {
                ...u,
                defaultPassword: needsPass ? def.defaultPassword : u.defaultPassword,
                permissions: needsPerms ? def.permissions : u.permissions,
              };
            }
          }
          return u;
        });

        if (changed) {
          localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(upgraded));
        }
        return upgraded;
      }
    }
  } catch (err) {
    console.error('[Auth] Error reading users list:', err);
  }
  // Initialize storage with defaults
  try {
    localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(DEFAULT_USERS));
  } catch {}
  return DEFAULT_USERS;
}

/**
 * Find user by email (case-insensitive).
 */
export function getUserByEmail(email) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

/**
 * Check if a user is the CEO (Mahmud Hasan).
 */
export function isUserCEO(user) {
  if (!user) return false;
  const emailMatch = user.email?.trim().toLowerCase() === DEFAULT_EMAIL.toLowerCase();
  const roleMatch = user.role === 'CEO & Founder' || user.roleKey === 'ceo';
  const hasAll = Array.isArray(user.permissions) && user.permissions.includes('all');
  return emailMatch || roleMatch || hasAll;
}

/**
 * Checks whether a user has permission to view a given dashboard module.
 */
export function hasPermission(user, viewId) {
  if (!user || !viewId) return false;
  // CEO has unconditional master access to all modules
  if (isUserCEO(user)) return true;
  // 'roles' (Roles & Permissions) is strictly CEO-exclusive
  if (viewId === 'roles') return false;
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(viewId) || user.permissions.includes('all');
  }
  return false;
}

/**
 * Get current plain password for user (for CEO view & credentials management).
 */
export function getUserPassword(email) {
  if (!email) return '';
  const normalized = email.trim().toLowerCase();
  try {
    const raw = localStorage.getItem(`${STORAGE_CUSTOM_AUTH}_${normalized}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.plainPassword) return parsed.plainPassword;
    }
  } catch {}
  const u = getUserByEmail(normalized);
  if (u?.defaultPassword) return u.defaultPassword;
  return normalized === DEFAULT_EMAIL.toLowerCase() ? DEFAULT_PASSWORD : 'user@2026';
}

/**
 * Allows the CEO to update a team member's password directly.
 */
export async function setUserPassword(email, newPassword) {
  if (!email || !newPassword) return false;
  const normalized = email.trim().toLowerCase();
  try {
    const passwordHash = await hashPassword(newPassword);
    const data = {
      email: normalized,
      passwordHash,
      plainPassword: newPassword,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${STORAGE_CUSTOM_AUTH}_${normalized}`, JSON.stringify(data));

    // Also update defaultPassword in users list
    const users = getAllUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === normalized);
    if (idx >= 0) {
      users[idx] = { ...users[idx], defaultPassword: newPassword };
      localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(users));
    }
    return true;
  } catch (err) {
    console.error('[Auth] Failed to set user password:', err);
    return false;
  }
}

/**
 * Retrieves stored custom password credentials per user email.
 */
export async function getStoredPasswordHash(email) {
  const normalized = (email || '').trim().toLowerCase();
  try {
    const raw = localStorage.getItem(`${STORAGE_CUSTOM_AUTH}_${normalized}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.passwordHash) return parsed.passwordHash;
    }
  } catch (err) {
    console.error('[Auth] Error reading user password hash:', err);
  }

  // Check user record for dedicated defaultPassword
  const user = getUserByEmail(normalized);
  if (user?.defaultPassword) {
    return await hashPassword(user.defaultPassword);
  }

  // Only CEO falls back to DEFAULT_PASSWORD_HASH ('admin')
  if (normalized === DEFAULT_EMAIL.toLowerCase()) {
    return DEFAULT_PASSWORD_HASH;
  }

  // Non-CEO with no set password defaults to 'user@2026'
  return await hashPassword('user@2026');
}

/**
 * Retrieves the currently active user profile from storage.
 */
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_USER) || sessionStorage.getItem(STORAGE_ACTIVE_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email) {
        const latest = getUserByEmail(parsed.email);
        return latest || parsed;
      }
    }
  } catch (err) {
    console.error('[Auth] Error getting active user:', err);
  }
  // Default to Sales Operator (matching reference UI) or CEO
  const users = getAllUsers();
  return users.find((u) => u.roleKey === 'sales') || users[0];
}

/**
 * Saves or updates active user session.
 */
export function setActiveUser(user, rememberMe = true) {
  if (!user) return;
  const storage = rememberMe ? localStorage : sessionStorage;
  try {
    storage.setItem(STORAGE_ACTIVE_USER, JSON.stringify(user));
  } catch (err) {
    console.error('[Auth] Failed to set active user:', err);
  }
}

/**
 * Checks if the user is currently locked out due to excessive failed attempts.
 */
export function getLockoutState() {
  try {
    const lockoutUntil = Number(localStorage.getItem(STORAGE_LOCKOUT_UNTIL) || 0);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    if (lockoutUntil > 0) {
      localStorage.removeItem(STORAGE_LOCKOUT_UNTIL);
      localStorage.removeItem(STORAGE_FAILED_ATTEMPTS);
    }
  } catch (err) {
    console.error('[Auth] Error checking lockout state:', err);
  }
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Records a failed attempt and triggers lockout if threshold reached.
 */
function recordFailedAttempt() {
  try {
    const current = Number(localStorage.getItem(STORAGE_FAILED_ATTEMPTS) || 0) + 1;
    localStorage.setItem(STORAGE_FAILED_ATTEMPTS, String(current));

    if (current >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_LOCKOUT_UNTIL, String(lockoutUntil));
      console.warn(`[Auth] Brute-force protection activated: locked out until ${new Date(lockoutUntil).toISOString()}`);
    }
  } catch (err) {
    console.error('[Auth] Error recording failed attempt:', err);
  }
}

/**
 * Clears failed attempt counter on successful login.
 */
function resetFailedAttempts() {
  try {
    localStorage.removeItem(STORAGE_FAILED_ATTEMPTS);
    localStorage.removeItem(STORAGE_LOCKOUT_UNTIL);
  } catch (err) {
    console.error('[Auth] Error resetting failed attempts:', err);
  }
}

/**
 * Validates user login credentials with multi-role support.
 */
export async function validateCredentials(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  // 1. Lockout Check
  const lockout = getLockoutState();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `Too many failed attempts. Locked out for ${lockout.remainingSeconds}s.`,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
    };
  }

  // 2. Input validation
  if (!normalizedEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const user = getUserByEmail(normalizedEmail);
  if (!user) {
    recordFailedAttempt();
    return { success: false, error: 'No account found with this email address.' };
  }

  const inputHash = await hashPassword(password);
  const expectedHash = await getStoredPasswordHash(normalizedEmail);
  const isCEO = normalizedEmail === DEFAULT_EMAIL.toLowerCase();

  // For CEO (Mahmud Hasan): accept either custom stored hash or default password 'admin'
  if (isCEO && (inputHash === expectedHash || (password === DEFAULT_PASSWORD && inputHash === DEFAULT_PASSWORD_HASH))) {
    resetFailedAttempts();
    console.info(`[Auth] Successful login for CEO Mahmud Hasan`);
    return { success: true, user };
  }

  // For all other team members: strictly require their assigned password (never accept 'admin' unless assigned)
  if (!isCEO && inputHash === expectedHash) {
    resetFailedAttempts();
    console.info(`[Auth] Successful login for ${normalizedEmail} (${user.role})`);
    return { success: true, user };
  }

  recordFailedAttempt();
  const postLockout = getLockoutState();
  if (postLockout.isLocked) {
    return {
      success: false,
      error: `Too many failed attempts. Locked out for ${postLockout.remainingSeconds}s.`,
      isLocked: true,
      remainingSeconds: postLockout.remainingSeconds,
    };
  }

  const attemptsLeft = MAX_ATTEMPTS - Number(localStorage.getItem(STORAGE_FAILED_ATTEMPTS) || 0);
  return {
    success: false,
    error: `Invalid password. (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining)`,
  };
}

/**
 * Resets password for a specific account.
 */
export async function resetPassword(email, newPassword) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  const user = getUserByEmail(normalizedEmail);
  if (!user) {
    return { success: false, error: 'No user account found with this email.' };
  }

  try {
    const passwordHash = await hashPassword(newPassword);
    const data = {
      email: normalizedEmail,
      passwordHash,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${STORAGE_CUSTOM_AUTH}_${normalizedEmail}`, JSON.stringify(data));
    resetFailedAttempts();

    console.info(`[Auth] Password reset successfully for ${normalizedEmail}`);
    return { success: true, message: `Password updated successfully for ${user.name}! You can now log in.` };
  } catch (err) {
    console.error('[Auth] Failed to reset password:', err);
    return { success: false, error: 'Failed to update password. Please try again.' };
  }
}

/**
 * Adds or updates a user account.
 */
export function saveUser(user) {
  if (!user || !user.email) return false;
  try {
    const users = getAllUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    let updatedUsers;
    if (existingIndex >= 0) {
      updatedUsers = [...users];
      updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], ...user };
    } else {
      const newUser = {
        id: user.id || `usr_${Date.now()}`,
        name: user.name || 'Team Member',
        email: user.email.trim().toLowerCase(),
        role: user.role || 'Operator',
        roleKey: user.roleKey || 'operator',
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff`,
        department: user.department || 'Operations',
        badge: user.badge || 'Team Member',
        permissions: user.permissions || ['dashboard', 'messages'],
        defaultPassword: user.defaultPassword || 'member@2026',
      };
      updatedUsers = [...users, newUser];
    }
    localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(updatedUsers));

    if (user.defaultPassword) {
      setUserPassword(user.email, user.defaultPassword);
    }
    return true;
  } catch (err) {
    console.error('[Auth] Failed to save user:', err);
    return false;
  }
}

/**
 * Removes a user account (cannot remove primary CEO).
 */
export function deleteUser(email) {
  if (!email || email.toLowerCase() === DEFAULT_EMAIL.toLowerCase()) return false;
  try {
    const users = getAllUsers();
    const filtered = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('[Auth] Failed to delete user:', err);
    return false;
  }
}

export function isSessionValid(storage) {
  if (!storage) return false;
  try {
    const authFlag = storage.getItem('aeitron_auth');
    if (authFlag !== 'true') return false;

    const timestamp = storage.getItem('aeitron_auth_ts');
    if (!timestamp) return false;

    return Date.now() - Number(timestamp) < SESSION_TIMEOUT_MS;
  } catch {
    return false;
  }
}

export function setSession(rememberMe = true, user = null) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('aeitron_auth', 'true');
  storage.setItem('aeitron_auth_ts', String(Date.now()));
  if (user) {
    setActiveUser(user, rememberMe);
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem('aeitron_auth');
    sessionStorage.removeItem('aeitron_auth_ts');
    sessionStorage.removeItem(STORAGE_ACTIVE_USER);
    localStorage.removeItem('aeitron_auth');
    localStorage.removeItem('aeitron_auth_ts');
    localStorage.removeItem(STORAGE_ACTIVE_USER);
  } catch (err) {
    console.error('[Auth] Error clearing session:', err);
  }
}

export function getActiveStorage() {
  if (isSessionValid(localStorage)) return localStorage;
  if (isSessionValid(sessionStorage)) return sessionStorage;
  return null;
}
