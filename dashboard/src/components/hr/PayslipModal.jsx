import { Printer, Download, X, ShieldCheck } from 'lucide-react';

export default function PayslipModal({ record, onClose }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141a] border border-[#262934] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top bar controls */}
        <div className="p-4 bg-[#181a22] border-b border-[#262934] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Official Executive Payslip</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Verified Settlement
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 flex items-center gap-1.5 px-3 bg-[#202330] hover:bg-[#282c3c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#2e3344]"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white bg-[#202330] rounded-lg transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-text-secondary bg-[#12141a]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262934] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="/aeitron_icon_fb.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <h1 className="text-lg font-bold text-white tracking-tight">Aeitron AI</h1>
              </div>
              <p className="text-[11px] text-text-muted">Enterprise AI Automation Agency Operating System</p>
              <p className="text-[11px] text-text-muted">Dhaka, Bangladesh · Global Autonomous Deliveries</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white uppercase">Salary Statement</div>
              <div className="text-sm font-bold text-accent mt-0.5">{record.month}</div>
              <div className="text-[11px] text-text-muted font-mono mt-1">Ref: PAY-{record.id.slice(-6)}</div>
            </div>
          </div>

          {/* Employee & Payment Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#181a22] border border-[#262934] rounded-xl">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Employee Name</span>
              <span className="font-bold text-white text-sm">{record.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Position / Role</span>
              <span className="font-semibold text-text">{record.role}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Entity Allocation</span>
              <span className="font-semibold text-text">{record.company}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Disbursement Date</span>
              <span className="font-mono text-emerald-400 font-semibold">{record.paidDate}</span>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="border border-[#262934] rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 bg-[#181a22] p-3 border-b border-[#262934] font-bold text-[11px] uppercase tracking-wider text-text-muted">
              <div>Earnings Breakdown</div>
              <div className="text-right">Amount (USD)</div>
            </div>

            <div className="divide-y divide-[#262934]/60">
              <div className="grid grid-cols-2 p-3 text-xs">
                <span className="text-text">Base Monthly Retainer / Salary</span>
                <span className="text-right font-mono font-semibold text-white">${record.baseSalary.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-xs">
                <span className="text-text">Performance Bonus / Milestone Incentive</span>
                <span className="text-right font-mono font-semibold text-emerald-400">+${record.bonus.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-xs">
                <span className="text-text">Unpaid Leave / Absence Deductions</span>
                <span className="text-right font-mono font-semibold text-rose-400">-${record.deductions.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 bg-[#181a22] p-4 border-t border-[#262934] font-bold text-sm">
              <span className="text-white">Net Take-Home Pay</span>
              <span className="text-right font-mono text-accent text-base">${record.netPay.toLocaleString()} USD</span>
            </div>
          </div>

          {/* Settlement Method & CEO Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div className="p-4 bg-[#181a22] border border-[#262934] rounded-xl">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Disbursement Channel</span>
              <span className="font-semibold text-white text-xs">{record.paymentMethod}</span>
              <span className="text-[10px] text-text-muted block mt-1">Bank Confirmation: STLT-{Date.now().toString().slice(-8)}</span>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
                <ShieldCheck size={14} />
                <span>Executive Verified</span>
              </div>
              <div className="text-xs font-bold text-white">Mahmud Hasan</div>
              <div className="text-[10px] text-text-muted">Founder & CEO, Aeitron AI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
