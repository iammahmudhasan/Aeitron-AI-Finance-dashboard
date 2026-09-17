import { useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Plus, UserCheck, ShieldCheck, MapPin, Laptop } from 'lucide-react';
import { useAttendanceLeave } from '../../context/AttendanceLeaveContext';
import { useAuth } from '../../context/AuthContext';

export default function AttendanceLeaveView() {
  const {
    attendance,
    leaveRequests,
    leaveBalances,
    isCheckedIn,
    checkInTime,
    clockIn,
    clockOut,
    applyLeave,
    updateLeaveStatus,
  } = useAttendanceLeave();

  const { currentUser } = useAuth();
  const isCEO = currentUser?.role === 'CEO';

  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves' | 'balances'
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    applyLeave({
      memberName: currentUser?.name || 'Mahmud Hasan',
      ...leaveForm,
      days: Number(leaveForm.days) || 1,
    });
    setModalOpen(false);
    setLeaveForm({ type: 'Casual', startDate: '', endDate: '', days: 1, reason: '' });
  };

  const myBalance = leaveBalances[currentUser?.name] || { sick: 10, casual: 10, annual: 15, used: 0 };

  return (
    <div className="space-y-6">
      {/* Header with Clock-in Widget & Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bg-card border border-border p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Attendance & Leave Management</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Live Web Portal
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track daily team check-ins, leave allowances, and approval workflows seamlessly
          </p>
        </div>

        {/* Daily Clock In / Out Quick Card */}
        <div className="flex items-center gap-3 bg-[#181a22] border border-[#262934] p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div className="text-xs">
              <span className="text-text-muted block text-[10px] uppercase font-bold">Status</span>
              <span className="font-semibold text-white">
                {isCheckedIn ? `Checked In (${checkInTime})` : 'Checked Out'}
              </span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#262934]" />

          {isCheckedIn ? (
            <button
              type="button"
              onClick={clockOut}
              className="h-9 px-4 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-full transition-all cursor-pointer"
            >
              Clock Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => clockIn(currentUser?.name || 'Mahmud Hasan')}
              className="h-9 px-4 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full transition-all cursor-pointer"
            >
              Clock In Now
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-9 flex items-center gap-1.5 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer"
          >
            <Plus size={15} />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-muted text-xs font-medium mb-2">
            <span>Casual Leave Balance</span>
            <Calendar size={15} className="text-accent" />
          </div>
          <div className="text-2xl font-bold text-white">{myBalance.casual} <span className="text-xs font-normal text-text-muted">Days left</span></div>
          <div className="text-[11px] text-text-muted mt-1">10 Days standard yearly quota</div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-muted text-xs font-medium mb-2">
            <span>Sick Leave Balance</span>
            <AlertCircle size={15} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{myBalance.sick} <span className="text-xs font-normal text-text-muted">Days left</span></div>
          <div className="text-[11px] text-text-muted mt-1">10 Days standard yearly quota</div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-muted text-xs font-medium mb-2">
            <span>Annual / Paid Leave</span>
            <CheckCircle size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{myBalance.annual} <span className="text-xs font-normal text-text-muted">Days left</span></div>
          <div className="text-[11px] text-text-muted mt-1">15 Days annual entitlement</div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-muted text-xs font-medium mb-2">
            <span>Total Used This Year</span>
            <Clock size={15} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{myBalance.used} <span className="text-xs font-normal text-text-muted">Days taken</span></div>
          <div className="text-[11px] text-text-muted mt-1">Approved & deducted</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'attendance' ? 'bg-accent text-white' : 'text-text-muted hover:text-white bg-[#181a22]'
          }`}
        >
          Daily Attendance Logs ({attendance.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'leaves' ? 'bg-accent text-white' : 'text-text-muted hover:text-white bg-[#181a22]'
          }`}
        >
          Leave Approval Requests ({leaveRequests.length})
        </button>
      </div>

      {/* Tab 1: Attendance Log */}
      {activeTab === 'attendance' && (
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Live Attendance Ledger</h3>
            <span className="text-xs text-text-muted font-mono">Real-time Timestamping</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-text-muted bg-[#14161f]/50">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Work Mode</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {attendance.map((row) => (
                  <tr key={row.id} className="hover:bg-[#181a22]/50 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs">
                        {row.memberName[0]}
                      </div>
                      <span>{row.memberName}</span>
                    </td>
                    <td className="p-4 text-text-secondary">{row.role}</td>
                    <td className="p-4 font-mono text-text-muted">{row.date}</td>
                    <td className="p-4 text-emerald-400 font-semibold">{row.checkIn}</td>
                    <td className="p-4 text-text-muted">{row.checkOut || 'Active Workday'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#202330] text-text-secondary border border-[#2c3040]">
                        {row.mode === 'Remote' ? <Laptop size={11} /> : <MapPin size={11} />}
                        {row.mode}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Leave Requests */}
      {activeTab === 'leaves' && (
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Leave Requests & Workflow</h3>
            <span className="text-xs text-text-muted">Auto-deducts from yearly balance upon approval</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-text-muted bg-[#14161f]/50">
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4 text-center">Status</th>
                  {isCEO && <th className="p-4 text-right">Executive Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#181a22]/50 transition-colors">
                    <td className="p-4 font-semibold text-white">{req.memberName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#202330] text-text border border-[#2a2e40]">
                        {req.type} Leave
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{req.days} Day(s)</td>
                    <td className="p-4 font-mono text-text-muted">{req.startDate} to {req.endDate}</td>
                    <td className="p-4 text-text-secondary max-w-xs truncate">{req.reason}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    {isCEO && (
                      <td className="p-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => updateLeaveStatus(req.id, 'approved')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeaveStatus(req.id, 'rejected')}
                              className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-text-muted text-[11px]">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white">Apply for Leave</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-semibold">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="Casual">Casual Leave (Balance: {myBalance.casual} days)</option>
                  <option value="Sick">Sick Leave (Balance: {myBalance.sick} days)</option>
                  <option value="Annual">Annual / Paid Leave (Balance: {myBalance.annual} days)</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={leaveForm.days}
                  onChange={(e) => setLeaveForm({ ...leaveForm, days: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Reason for Absence</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain brief reason for leave..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-white bg-[#181a22] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold cursor-pointer shadow-md shadow-accent/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
