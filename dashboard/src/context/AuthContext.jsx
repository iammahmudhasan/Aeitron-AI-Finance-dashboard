import { createContext, useContext, useState, useCallback } from 'react';
import {
  validateCredentials,
  resetPassword as authResetPassword,
  restoreDefaultCredentials as authRestoreDefaults,
  getLockoutState,
  getRegisteredCredentials,
  setSession,
  clearSession,
  getActiveStorage,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return getActiveStorage() !== null;
  });

  const login = useCallback(async (email, password, rememberMe = false) => {
    const result = await validateCredentials(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setSession(rememberMe);
      return { success: true };
    }
    return {
      success: false,
      error: result.error || 'Invalid credentials',
      isLocked: result.isLocked || false,
      remainingSeconds: result.remainingSeconds || 0,
    };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    clearSession();
  }, []);

  const resetPassword = useCallback(async (email, newPassword) => {
    return await authResetPassword(email, newPassword);
  }, []);

  const restoreDefaults = useCallback(() => {
    return authRestoreDefaults();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        resetPassword,
        restoreDefaults,
        getLockoutState,
        getRegisteredCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
