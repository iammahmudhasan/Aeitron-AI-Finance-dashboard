import { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { NOTIFICATIONS_STORAGE_KEY } from '../utils/constants';

const NotificationContext = createContext(null);

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const exists = state.notifications.some((n) => n.dedupKey === action.payload.dedupKey);
      if (exists) return state;
      return { notifications: [action.payload, ...state.notifications] };
    }
    case 'MARK_READ':
      return {
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_READ':
      return {
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case 'DISMISS':
      return {
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return { notifications: [] };
    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Web Audio API high-fidelity chime for real-time notifications
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Chime Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(784, now); // G5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Chime Note 2 (Upbeat)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.5, now + 0.08); // C6
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  } catch {
    // Autoplay or restricted audio context
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: loadFromStorage(),
  });
  const [messageToast, setMessageToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(state.notifications));
    } catch (e) {
      console.warn('Failed to persist notifications:', e);
    }
  }, [state.notifications]);

  // Real-Time Cross-Tab Synchronization via BroadcastChannel
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('aeitron_notifications_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ADD_NOTIFICATION') {
          const notif = event.data.payload;
          dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
          if (notif.type === 'team_message') {
            playNotificationSound();
            setMessageToast(notif);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => setMessageToast(null), 6000);
          }
        }
      };
    } catch {}

    return () => {
      bc?.close();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: newNotif,
    });

    if (newNotif.type === 'team_message') {
      playNotificationSound();
      setMessageToast(newNotif);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setMessageToast(null), 6000);
    }

    // Broadcast in milliseconds to other tabs/windows
    try {
      const bc = new BroadcastChannel('aeitron_notifications_sync');
      bc.postMessage({ type: 'SYNC_ADD_NOTIFICATION', payload: newNotif });
      bc.close();
    } catch {}
  }, []);

  const dismissMessageToast = useCallback(() => {
    setMessageToast(null);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        dispatch,
        addNotification,
        messageToast,
        dismissMessageToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
