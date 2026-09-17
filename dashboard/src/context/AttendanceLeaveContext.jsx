import { createContext, useContext, useState, useEffect } from 'react';

const AttendanceLeaveContext = createContext(null);

const STORAGE_ATTENDANCE_KEY = 'aeitron_attendance_records';
const STORAGE_LEAVES_KEY = 'aeitron_leave_requests';
const STORAGE_BALANCES_KEY = 'aeitron_leave_balances';

const INITIAL_ATTENDANCE = [
  { id: 'att-1', memberName: 'Mahmud Hasan', role: 'CEO / COO', date: '2026-09-17', checkIn: '08:45 AM', checkOut: null, status: 'Present', mode: 'Office' },
  { id: 'att-2', memberName: 'Salung Prastyo', role: 'Sales Lead', date: '2026-09-17', checkIn: '09:05 AM', checkOut: null, status: 'Present', mode: 'Remote' },
  { id: 'att-3', memberName: 'Sarah Jenkins', role: 'Finance Manager', date: '2026-09-17', checkIn: '09:12 AM', checkOut: null, status: 'Present', mode: 'Office' },
  { id: 'att-4', memberName: 'Alex Rivera', role: 'AI Ops Lead', date: '2026-09-17', checkIn: '08:50 AM', checkOut: null, status: 'Present', mode: 'Office' },
];

const INITIAL_LEAVE_REQUESTS = [
  { id: 'leave-1', memberName: 'Alex Rivera', type: 'Casual', startDate: '2026-09-22', endDate: '2026-09-23', days: 2, reason: 'Family engagement', status: 'approved', appliedAt: '2026-09-15' },
  { id: 'leave-2', memberName: 'Salung Prastyo', type: 'Sick', startDate: '2026-09-10', endDate: '2026-09-11', days: 2, reason: 'Viral fever recovery', status: 'approved', appliedAt: '2026-09-10' },
  { id: 'leave-3', memberName: 'Sarah Jenkins', type: 'Casual', startDate: '2026-09-28', endDate: '2026-09-29', days: 2, reason: 'Personal errands', status: 'pending', appliedAt: '2026-09-16' },
];

const INITIAL_BALANCES = {
  'Mahmud Hasan': { sick: 10, casual: 10, annual: 15, used: 0 },
  'Salung Prastyo': { sick: 8, casual: 10, annual: 15, used: 2 },
  'Sarah Jenkins': { sick: 10, casual: 10, annual: 15, used: 0 },
  'Alex Rivera': { sick: 10, casual: 8, annual: 15, used: 2 },
};

export function AttendanceLeaveProvider({ children }) {
  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEAVES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [leaveBalances, setLeaveBalances] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BALANCES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BALANCES;
    } catch {
      return INITIAL_BALANCES;
    }
  });

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:45 AM');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(attendance));
      localStorage.setItem(STORAGE_LEAVES_KEY, JSON.stringify(leaveRequests));
      localStorage.setItem(STORAGE_BALANCES_KEY, JSON.stringify(leaveBalances));
    } catch {
      // ignore
    }
  }, [attendance, leaveRequests, leaveBalances]);

  // Clock In
  const clockIn = (memberName = 'Mahmud Hasan', mode = 'Office') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `att-${Date.now()}`,
      memberName,
      role: 'CEO / COO',
      date: todayStr,
      checkIn: timeStr,
      checkOut: null,
      status: 'Present',
      mode,
    };
    setAttendance((prev) => [newEntry, ...prev]);
    setIsCheckedIn(true);
    setCheckInTime(timeStr);
  };

  // Clock Out
  const clockOut = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAttendance((prev) =>
      prev.map((item, idx) => (idx === 0 ? { ...item, checkOut: timeStr } : item))
    );
    setIsCheckedIn(false);
  };

  // Apply Leave Request
  const applyLeave = (request) => {
    const newReq = {
      id: `leave-${Date.now()}`,
      ...request,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  // Approve / Reject Leave
  const updateLeaveStatus = (leaveId, newStatus) => {
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === leaveId) {
          if (newStatus === 'approved' && req.status !== 'approved') {
            // Deduct balance
            setLeaveBalances((bPrev) => {
              const current = bPrev[req.memberName] || { sick: 10, casual: 10, annual: 15, used: 0 };
              const typeKey = req.type.toLowerCase() === 'sick' ? 'sick' : 'casual';
              return {
                ...bPrev,
                [req.memberName]: {
                  ...current,
                  [typeKey]: Math.max(0, current[typeKey] - req.days),
                  used: current.used + req.days,
                },
              };
            });
          }
          return { ...req, status: newStatus };
        }
        return req;
      })
    );
  };

  return (
    <AttendanceLeaveContext.Provider
      value={{
        attendance,
        leaveRequests,
        leaveBalances,
        isCheckedIn,
        checkInTime,
        clockIn,
        clockOut,
        applyLeave,
        updateLeaveStatus,
      }}
    >
      {children}
    </AttendanceLeaveContext.Provider>
  );
}

export function useAttendanceLeave() {
  const context = useContext(AttendanceLeaveContext);
  if (!context) {
    throw new Error('useAttendanceLeave must be used within an AttendanceLeaveProvider');
  }
  return context;
}
