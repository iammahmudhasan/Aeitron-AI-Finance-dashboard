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
 * Built-in business team accounts for multi-role operations.
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
  },
  {
    id: 'usr_sales',
    name: 'Salung Prastyo',
    email: 'sales@aeitron.com',
    role: 'Sales Operator',
    roleKey: 'sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    department: 'Sales & Growth',
    badge: '💼 Commercial Lead',
    permissions: ['dashboard', 'products', 'transactions', 'clients', 'orders', 'campaigns', 'invoices', 'reports'],
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
    permissions: ['dashboard', 'expenses', 'invoices', 'transactions', 'billing', 'reports', 'team'],
  },
  {
    id: 'usr_ops',
    name: 'Alex Rivera',
    email: 'ops@aeitron.com',
    role: 'AI Operations Lead',
    roleKey: 'operations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    department: 'AI & Automations',
    badge: '🤖 Systems Architect',
    permissions: ['dashboard', 'agents', 'system', 'discovery', 'integrations'],
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
 */
export function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
 * Retrieves stored custom password credentials per user email.
 */
export function getStoredPasswordHash(email) {
  try {
    const raw = localStorage.getItem(`${STORAGE_CUSTOM_AUTH}_${email.trim().toLowerCase()}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.passwordHash) return parsed.passwordHash;
    }
  } catch (err) {
    console.error('[Auth] Error reading user password hash:', err);
  }
  return DEFAULT_PASSWORD_HASH;
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
  const expectedHash = getStoredPasswordHash(normalizedEmail);

  // Accept password if matching stored hash or default password hash
  if (inputHash === expectedHash || (password === 'admin' && inputHash === DEFAULT_PASSWORD_HASH)) {
    resetFailedAttempts();
    console.info(`[Auth] Successful login at ${new Date().toISOString()} for ${normalizedEmail} (${user.role})`);
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
        permissions: user.permissions || ['dashboard'],
      };
      updatedUsers = [...users, newUser];
    }
    localStorage.setItem(STORAGE_USERS_LIST, JSON.stringify(updatedUsers));
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
