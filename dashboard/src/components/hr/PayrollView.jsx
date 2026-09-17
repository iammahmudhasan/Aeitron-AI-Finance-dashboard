import { useState } from 'react';
import { DollarSign, FileText, CheckCircle2, Play, Building, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { usePayroll } from '../../context/PayrollContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import PayslipModal from './PayslipModal';

export default function PayrollView() {
  const { payrollRecords, totalPayrollAmount, runMonthlyPayroll, selectedPayslip, setSelectedPayslip } = usePayroll();
  const { addExpense } = useExpenses?.() || {};
  const { currentUser } = useAuth();
  const isCEO = currentUser?.role === 'CEO';

  const [notification, setNotification] = useState('');

  const handleRunPayroll = () => {
    const total = runMonthlyPayroll('October 2026');
    // Auto sync to Expense Ledger
    if (addExpense) {
      addExpense({
        category: 'Salaries & Payroll',
        amount: total,
        description: 'Automated Monthly Salary Run for Aeitron AI Staff',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setNotification(`Successfully executed payroll for ${payrollRecords.length} team members ($${total.toLocaleString()} USD). Pushed directly into Expense Ledger.`);
    setTimeout(() => setNotification(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Payroll & Compensation Engine</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              Automated Ledger Sync
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Calculate salary distributions, absence deductions, bonuses, and generate verifiable payslips
          </p>
        </div>

        {isCEO && (
          <button
            type="button"
            onClick={handleRunPayroll}
            className="h-10 flex items-center gap-2 px-5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/25 cursor-pointer active:scale-95"
          >
            <Play size={15} className="fill-white" />
            <span>Run Monthly Payroll</span>
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-text-muted font-medium mb-1">Total Monthly Payroll Burn</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            ${totalPayrollAmount.toLocaleString()} <span className="text-xs font-normal text-text-muted">USD</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Direct integration with Expense Ledger</div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-text-muted font-medium mb-1">Total Enrolled Staff</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {payrollRecords.length} <span className="text-xs font-normal text-text-muted">Employees</span>
          </div>
          <div className="text-[11px] text-text-muted mt-1">Aeitron AI Enterprise</div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-text-muted font-medium mb-1">Current Payroll Cycle</div>
          <div className="text-2xl sm:text-3xl font-bold text-accent">
            September 2026
          </div>
          <div className="text-[11px] text-text-muted mt-1">Settled on 5th of month</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Compensation Breakdown by Member</h3>
          <span className="text-xs text-text-muted">Click any row to generate printable PDF payslip</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase font-bold text-text-muted bg-[#14161f]/50">
                <th className="p-4">Employee</th>
                <th className="p-4">Entity</th>
                <th className="p-4 text-right">Base Pay</th>
                <th className="p-4 text-right">Bonus</th>
                <th className="p-4 text-right">Deductions</th>
                <th className="p-4 text-right">Net Take-Home</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {payrollRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => setSelectedPayslip(record)}
                  className="hover:bg-[#181a22]/60 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-semibold text-white group-hover:text-accent transition-colors">
                    {record.name}
                    <span className="block text-[11px] text-text-muted font-normal">{record.role}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#1e202c] text-text border border-[#2a2d3e]">
                      <Building size={11} className="text-accent" />
                      {record.company}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-white/90">
                    ${record.baseSalary.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-400 font-medium">
                    +${record.bonus.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-rose-400 font-medium">
                    -${record.deductions.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-white text-sm">
                    ${record.netPay.toLocaleString()}
                  </td>
                  <td className="p-4 text-text-secondary text-[11px]">
                    {record.paymentMethod}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayslip(record);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-semibold"
                    >
                      <FileText size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal record={selectedPayslip} onClose={() => setSelectedPayslip(null)} />
      )}
    </div>
  );
}
