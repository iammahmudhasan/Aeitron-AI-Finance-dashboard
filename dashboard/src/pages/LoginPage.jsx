import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '../utils/auth';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function LoginPage() {
  const { login, resetPassword, restoreDefaults, getLockoutState } = useAuth();

  // Mode: 'login' | 'reset'
  const [mode, setMode] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Reset form state
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  // Status & Feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Check lockout on mount and tick down timer
  useEffect(() => {
    const { isLocked, remainingSeconds } = getLockoutState();
    if (isLocked) setLockoutSeconds(remainingSeconds);
  }, [getLockoutState]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // One-click quick fill
  const handleQuickFill = () => {
    setEmail(DEFAULT_EMAIL);
    setPassword(DEFAULT_PASSWORD);
    setError('');
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lockoutSeconds > 0) {
      setError(`Account temporarily locked for security. Please wait ${lockoutSeconds}s.`);
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (!result.success) {
        setError(result.error);
        if (result.isLocked && result.remainingSeconds) {
          setLockoutSeconds(result.remainingSeconds);
        }
      }
    } catch (err) {
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Password Reset
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (!resetEmail.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-type carefully.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(resetEmail, newPassword);
      if (res.success) {
        setResetSuccess('Password updated successfully! You can now sign in with your new password.');
        setEmail(resetEmail);
        setPassword(newPassword);
        setLockoutSeconds(0);
      } else {
        setError(res.error || 'Failed to update password.');
      }
    } catch (err) {
      setError(err?.message || 'Error occurred during password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Restore factory defaults
  const handleRestoreDefaults = () => {
    restoreDefaults();
    setEmail(DEFAULT_EMAIL);
    setPassword(DEFAULT_PASSWORD);
    setResetEmail(DEFAULT_EMAIL);
    setLockoutSeconds(0);
    setError('');
    setResetSuccess('Credentials restored to defaults (ceo@aeitron.com / admin).');
    setMode('login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-accent via-purple-500 to-indigo-500 opacity-40 blur-md group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-white p-2.5 shadow-xl border border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/aeitron_logo.jpeg"
                  alt="Aeitron AI Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if jpeg is blocked
                    e.currentTarget.src = '/aeitron_icon_fb.png';
                  }}
                />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text tracking-tight flex items-center justify-center gap-2">
            Aeitron AI
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              OS
            </span>
          </h1>
          <p className="text-text-muted text-sm mt-1.5">
            AI-Powered Agency Finance & Automation Platform
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-bg-card border border-border/80 rounded-2xl p-7 sm:p-8 shadow-xl backdrop-blur-md transition-all duration-300">
          {/* Header Switcher */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-border/60">
            <div>
              <h2 className="text-lg font-semibold text-text">
                {mode === 'login' ? 'Sign In to Dashboard' : 'Reset Password'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {mode === 'login'
                  ? 'Enter your credentials to access your workspace'
                  : 'Set a new password for your account'}
              </p>
            </div>
            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setResetSuccess('');
                }}
                className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-2 transition-colors"
              >
                Back to Login
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 text-xs text-danger bg-danger/10 border border-danger/25 rounded-xl p-3.5 mb-5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Authentication Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {resetSuccess && (
            <div className="flex items-start gap-2.5 text-xs text-success bg-success/10 border border-success/25 rounded-xl p-3.5 mb-5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Success</span>
                <span>{resetSuccess}</span>
              </div>
            </div>
          )}

          {/* ==================== LOGIN MODE ==================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    placeholder="ceo@aeitron.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-text-muted uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setResetEmail(email || DEFAULT_EMAIL);
                      setError('');
                      setResetSuccess('');
                    }}
                    className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/60 hover:text-text transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Security Badge */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                  />
                  <span className="text-xs text-text-muted">Remember session</span>
                </label>

                <div className="flex items-center gap-1 text-[11px] text-text-muted/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span>SHA-256 Encrypted</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : lockoutSeconds > 0 ? (
                  `Locked (${lockoutSeconds}s)`
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* One-Click Quick Fill Option */}
              <div className="pt-3">
                <div className="rounded-xl border border-dashed border-border bg-bg/50 p-3 flex items-center justify-between gap-2">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>Quick Demo Access</span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Default: <code className="text-accent font-mono">ceo@aeitron.com</code> / <code className="text-accent font-mono">admin</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="px-2.5 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium rounded-lg transition-colors border border-accent/20 shrink-0"
                  >
                    Quick Fill
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ==================== RESET PASSWORD MODE ==================== */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="resetEmail" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="ceo@aeitron.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password (min 4 chars)"
                    className="w-full pl-10 pr-10 py-2.5 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/60 hover:text-text transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-type your new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text text-sm placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Password...
                  </span>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Reset to Factory Defaults */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults (admin)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-text-muted/60 space-y-1">
          <p>&copy; {new Date().getFullYear()} Aeitron AI. All rights reserved.</p>
          <p className="text-[11px]">Empowering Agencies with Intelligent Automation</p>
        </div>
      </div>
    </div>
  );
}
