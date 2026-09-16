// Production-Grade Auth Configuration & Security Utilities
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours
export const DEFAULT_EMAIL = 'ceo@aeitron.com';
export const DEFAULT_PASSWORD = 'admin';
// SHA-256 hash of "admin"
const DEFAULT_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

// Brute-force & Lockout configurations (as specified in AGENT.md)
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout
const STORAGE_CUSTOM_AUTH = 'aeitron_custom_credentials';
const STORAGE_FAILED_ATTEMPTS = 'aeitron_failed_login_attempts';
const STORAGE_LOCKOUT_UNTIL = 'aeitron_lockout_until';

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
 * Retrieves the currently active credentials (custom if reset, or defaults).
 */
export function getRegisteredCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_AUTH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.passwordHash) {
        return {
          email: parsed.email || DEFAULT_EMAIL,
          passwordHash: parsed.passwordHash,
          isCustom: true,
        };
      }
    }
  } catch (err) {
    console.error('[Auth] Error reading stored credentials:', err);
  }

  return {
    email: DEFAULT_EMAIL,
    passwordHash: DEFAULT_PASSWORD_HASH,
    isCustom: false,
  };
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
    // Lockout expired, clean up
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
 * Validates user login credentials with brute force protection.
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

  const credentials = getRegisteredCredentials();
  const inputHash = await hashPassword(password);

  // Allow login if email matches registered email (or default email) AND password hash matches
  const emailMatch =
    normalizedEmail === credentials.email.toLowerCase() ||
    normalizedEmail === DEFAULT_EMAIL.toLowerCase();

  const passwordMatch = inputHash === credentials.passwordHash;

  if (emailMatch && passwordMatch) {
    resetFailedAttempts();
    console.info(`[Auth] Successful login at ${new Date().toISOString()} for ${normalizedEmail}`);
    return { success: true };
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
  console.warn(`[Auth] Failed login attempt for ${normalizedEmail}. Attempts left: ${attemptsLeft}`);

  return {
    success: false,
    error: `Invalid email or password. (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining)`,
  };
}

/**
 * Resets the password and assigns a new password to the given email.
 */
export async function resetPassword(email, newPassword) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  try {
    const passwordHash = await hashPassword(newPassword);
    const data = {
      email: normalizedEmail,
      passwordHash,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_CUSTOM_AUTH, JSON.stringify(data));
    resetFailedAttempts();

    console.info(`[Auth] Password reset successfully for ${normalizedEmail}`);
    return { success: true, message: 'Password updated successfully! You can now log in.' };
  } catch (err) {
    console.error('[Auth] Failed to reset password:', err);
    return { success: false, error: 'Failed to update password. Please try again.' };
  }
}

/**
 * Resets credentials back to system defaults.
 */
export function restoreDefaultCredentials() {
  try {
    localStorage.removeItem(STORAGE_CUSTOM_AUTH);
    resetFailedAttempts();
    return { success: true, message: 'Default credentials restored (ceo@aeitron.com / admin).' };
  } catch (err) {
    return { success: false, error: err.message };
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

export function setSession(rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('aeitron_auth', 'true');
  storage.setItem('aeitron_auth_ts', String(Date.now()));
}

export function clearSession() {
  try {
    sessionStorage.removeItem('aeitron_auth');
    sessionStorage.removeItem('aeitron_auth_ts');
    localStorage.removeItem('aeitron_auth');
    localStorage.removeItem('aeitron_auth_ts');
  } catch (err) {
    console.error('[Auth] Error clearing session:', err);
  }
}

export function getActiveStorage() {
  if (isSessionValid(localStorage)) return localStorage;
  if (isSessionValid(sessionStorage)) return sessionStorage;
  return null;
}
