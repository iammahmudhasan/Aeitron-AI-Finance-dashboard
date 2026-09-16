import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  validateCredentials,
  resetPassword as authResetPassword,
  getLockoutState,
  setSession,
  clearSession,
  getActiveStorage,
  getActiveUser,
  setActiveUser as persistActiveUser,
  getAllUsers,
  saveUser as authSaveUser,
  deleteUser as authDeleteUser,
  getUserByEmail,
  setUserPassword as authSetUserPassword,
  getUserPassword as authGetUserPassword,
  isUserCEO,
  hasPermission as authHasPermission,
  AVAILABLE_MODULES,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return getActiveStorage() !== null;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return getActiveUser();
  });

  const [users, setUsers] = useState(() => {
    return getAllUsers();
  });

  // Sync users list whenever storage updates
  const refreshUsers = useCallback(() => {
    setUsers(getAllUsers());
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    const result = await validateCredentials(email, password);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setCurrentUser(result.user);
      setSession(rememberMe, result.user);
      return { success: true, user: result.user };
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

  const switchUser = useCallback((userEmail) => {
    const target = getUserByEmail(userEmail);
    if (target) {
      setCurrentUser(target);
      persistActiveUser(target, true);
      console.info(`[Auth] Switched active user to ${target.name} (${target.role})`);
      return true;
    }
    return false;
  }, []);

  const addUser = useCallback((userData) => {
    const ok = authSaveUser(userData);
    if (ok) refreshUsers();
    return ok;
  }, [refreshUsers]);

  const updateUser = useCallback((userData) => {
    const ok = authSaveUser(userData);
    if (ok) {
      refreshUsers();
      if (currentUser?.email.toLowerCase() === userData.email?.toLowerCase()) {
        const updated = getUserByEmail(userData.email);
        if (updated) {
          setCurrentUser(updated);
          persistActiveUser(updated, true);
        }
      }
    }
    return ok;
  }, [refreshUsers, currentUser]);

  const deleteUser = useCallback((email) => {
    const ok = authDeleteUser(email);
    if (ok) refreshUsers();
    return ok;
  }, [refreshUsers]);

  const resetPassword = useCallback(async (email, newPassword) => {
    return await authResetPassword(email, newPassword);
  }, []);

  const setUserPassword = useCallback(async (email, newPassword) => {
    const ok = await authSetUserPassword(email, newPassword);
    if (ok) refreshUsers();
    return ok;
  }, [refreshUsers]);

  const getUserPassword = useCallback((email) => {
    return authGetUserPassword(email);
  }, []);

  const isCEO = isUserCEO(currentUser);

  const hasPermission = useCallback((viewId) => {
    return authHasPermission(currentUser, viewId);
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        users,
        isCEO,
        hasPermission,
        availableModules: AVAILABLE_MODULES,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
        resetPassword,
        setUserPassword,
        getUserPassword,
        getLockoutState,
        refreshUsers,
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
