import { createContext, useContext, useState, useEffect } from 'react';

const PayrollContext = createContext(null);

const STORAGE_PAYROLL_KEY = 'aeitron_payroll_records';

const INITIAL_PAYROLL_MEMBERS = [
  {
    id: 'pay-1',
    name: 'Mahmud Hasan',
    role: 'CEO & Founder',
    company: 'Aeitron AI',
    baseSalary: 6500,
    deductions: 0,
    bonus: 1200,
    netPay: 7700,
    status: 'Paid',
    paymentMethod: 'Bank Transfer (City Bank)',
    month: 'September 2026',
    paidDate: '2026-09-05',
  },
  {
    id: 'pay-2',
    name: 'Sarah Jenkins',
    role: 'Finance Manager',
    company: 'Aeitron AI',
    baseSalary: 4200,
    deductions: 0,
    bonus: 450,
    netPay: 4650,
    status: 'Paid',
    paymentMethod: 'Bank Transfer (Standard Chartered)',
    month: 'September 2026',
    paidDate: '2026-09-05',
  },
  {
    id: 'pay-3',
    name: 'Salung Prastyo',
    role: 'Sales Lead',
    company: 'Aeitron AI',
    baseSalary: 3800,
    deductions: 150,
    bonus: 850,
    netPay: 4500,
    status: 'Paid',
    paymentMethod: 'Bank Transfer / Wire',
    month: 'September 2026',
    paidDate: '2026-09-05',
  },
  {
    id: 'pay-4',
    name: 'Alex Rivera',
    role: 'AI Operations Lead',
    company: 'Aeitron AI',
    baseSalary: 4800,
    deductions: 0,
    bonus: 600,
    netPay: 5400,
    status: 'Paid',
    paymentMethod: 'Bank Wire / bKash Settlement',
    month: 'September 2026',
    paidDate: '2026-09-05',
  },
];

export function PayrollProvider({ children }) {
  const [payrollRecords, setPayrollRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PAYROLL_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PAYROLL_MEMBERS;
    } catch {
      return INITIAL_PAYROLL_MEMBERS;
    }
  });

  const [selectedPayslip, setSelectedPayslip] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAYROLL_KEY, JSON.stringify(payrollRecords));
    } catch {
      // ignore
    }
  }, [payrollRecords]);

  const totalPayrollAmount = payrollRecords.reduce((sum, item) => sum + item.netPay, 0);

  const runMonthlyPayroll = (month = 'October 2026') => {
    const updated = payrollRecords.map((item) => ({
      ...item,
      id: `pay-${Date.now()}-${item.id}`,
      month,
      status: 'Paid',
      paidDate: new Date().toISOString().split('T')[0],
    }));
    setPayrollRecords(updated);
    return totalPayrollAmount;
  };

  return (
    <PayrollContext.Provider
      value={{
        payrollRecords,
        totalPayrollAmount,
        runMonthlyPayroll,
        selectedPayslip,
        setSelectedPayslip,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
}
