import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Info,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
  Trash2,
  ExternalLink,
  Download,
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  {
    id: '#04910',
    customer: 'Ryan Korsgaard',
    product: 'Ergo Office Chair',
    status: 'Success',
    qty: 12,
    unitPrice: 3450,
    totalRevenue: 41400,
    date: 'Nov 6, 2025',
  },
  {
    id: '#04911',
    customer: 'Madelyn Lubin',
    product: 'Sunset Desk 02',
    status: 'Success',
    qty: 20,
    unitPrice: 2980,
    totalRevenue: 89200,
    date: 'Nov 5, 2025',
  },
  {
    id: '#04912',
    customer: 'Abram Bergson',
    product: 'Eco Bookshelf',
    status: 'Pending',
    qty: 22,
    unitPrice: 1750,
    totalRevenue: 75900,
    date: 'Nov 4, 2025',
  },
  {
    id: '#04913',
    customer: 'Phillip Mango',
    product: 'Green Leaf Desk',
    status: 'Refunded',
    qty: 24,
    unitPrice: 1950,
    totalRevenue: 19500,
    date: 'Nov 3, 2025',
  },
  {
    id: '#04914',
    customer: 'Sophia Chen',
    product: 'AI Automation Engine',
    status: 'Success',
    qty: 5,
    unitPrice: 4800,
    totalRevenue: 24000,
    date: 'Nov 2, 2025',
  },
  {
    id: '#04915',
    customer: 'Marcus Vance',
    product: 'Enterprise Workflow Agent',
    status: 'Success',
    qty: 3,
    unitPrice: 8500,
    totalRevenue: 25500,
    date: 'Nov 1, 2025',
  },
];

export default function TransactionsTable({ globalSearch = '' }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('aeitron_transactions');
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [tableSearch, setTableSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);
  const rowMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setHeaderMenuOpen(false);
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setHeaderMenuOpen(false);
        setActiveMenuId(null);
      }
    }

    if (headerMenuOpen || activeMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [headerMenuOpen, activeMenuId]);

  useEffect(() => {
    function handleOpenAdd() {
      setModalOpen(true);
    }
    window.addEventListener('open-add-transaction', handleOpenAdd);
    return () => window.removeEventListener('open-add-transaction', handleOpenAdd);
  }, []);

  const handleExportAllCsv = () => {
    const rows = [
      ['ID', 'Customer', 'Product', 'Status', 'Qty', 'Unit Price ($)', 'Total Revenue ($)', 'Date'],
      ...transactions.map((t) => [t.id, t.customer, t.product, t.status, t.qty, t.unitPrice, t.totalRevenue, t.date || '']),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transactions_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHeaderMenuOpen(false);
  };

  const handleResetSampleData = () => {
    saveTransactions(INITIAL_TRANSACTIONS);
    setHeaderMenuOpen(false);
  };

  // Form State for Add Transaction
  const [formCustomer, setFormCustomer] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState(1);
  const [formPrice, setFormPrice] = useState(1200);
  const [formStatus, setFormStatus] = useState('Success');

  const saveTransactions = (updated) => {
    setTransactions(updated);
    try {
      localStorage.setItem('aeitron_transactions', JSON.stringify(updated));
    } catch {}
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formCustomer || !formProduct) return;

    const newTx = {
      id: `#049${Math.floor(100 + Math.random() * 900)}`,
      customer: formCustomer,
      product: formProduct,
      status: formStatus,
      qty: Number(formQty),
      unitPrice: Number(formPrice),
      totalRevenue: Number(formQty) * Number(formPrice),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    setModalOpen(false);
    setFormCustomer('');
    setFormProduct('');
  };

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);
    setActiveMenuId(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)));
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const effectiveSearch = (tableSearch || globalSearch).toLowerCase().trim();

  const filteredTransactions = useMemo(() => {
    if (!effectiveSearch) return transactions;
    return transactions.filter(
      (t) =>
        t.customer.toLowerCase().includes(effectiveSearch) ||
        t.product.toLowerCase().includes(effectiveSearch) ||
        t.id.toLowerCase().includes(effectiveSearch) ||
        t.status.toLowerCase().includes(effectiveSearch)
    );
  }, [transactions, effectiveSearch]);

  return (
    <div className="bg-bg-card border border-border/80 rounded-2xl p-6 shadow-xs relative">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text uppercase tracking-wider">
            RECENT TRANSACTIONS
          </span>
          <Info size={13} className="text-text-muted/60" />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Table Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-bg border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-48 sm:w-56 focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Add Transaction Button */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-xl transition-all shadow-xs shrink-0"
          >
            <Plus size={14} />
            <span>Add Transaction</span>
          </button>

          {/* Header 3-Dot Options */}
          <div className="relative" ref={headerMenuRef}>
            <button
              type="button"
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                headerMenuOpen
                  ? 'bg-bg border-accent text-accent'
                  : 'text-text-muted hover:text-text hover:bg-bg border-transparent'
              }`}
              title="Table Options"
            >
              <MoreHorizontal size={16} />
            </button>

            {headerMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-card border border-border shadow-2xl rounded-2xl p-1.5 z-50 animate-fade-in text-xs">
                <button
                  type="button"
                  onClick={handleExportAllCsv}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-text hover:bg-bg rounded-xl transition-colors text-left"
                >
                  <Download size={13} className="text-accent" />
                  <span>Export Ledger to CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSampleData}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-text hover:bg-bg rounded-xl transition-colors text-left"
                >
                  <RotateCcw size={13} className="text-text-muted" />
                  <span>Reset Sample Ledger</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              <th className="py-3 px-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredTransactions.length > 0 &&
                    selectedIds.size === filteredTransactions.length
                  }
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">
                <span className="inline-flex items-center gap-1">ID <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3">
                <span className="inline-flex items-center gap-1">CUSTOMER <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3">
                <span className="inline-flex items-center gap-1">PRODUCT <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3">
                <span className="inline-flex items-center gap-1">STATUS <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3 text-center">
                <span className="inline-flex items-center gap-1">QTY <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3 text-right">
                <span className="inline-flex items-center gap-1 justify-end">UNIT PRICE <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3 text-right">
                <span className="inline-flex items-center gap-1 justify-end">TOTAL REVENUE <ArrowUpDown size={11} /></span>
              </th>
              <th className="py-3 px-3 text-center w-12">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {filteredTransactions.map((tx, index) => {
              const isSelected = selectedIds.has(tx.id);
              const openUpward = index >= Math.max(1, filteredTransactions.length - 2);

              return (
                <tr
                  key={tx.id}
                  className={`hover:bg-bg-hover/60 transition-colors ${
                    isSelected ? 'bg-accent/5' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(tx.id)}
                      className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-text-muted">
                    {tx.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-text">
                    {tx.customer}
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {tx.product}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-text">
                    {tx.qty}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-text-secondary">
                    ${tx.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-text">
                    ${tx.totalRevenue.toLocaleString()}
                  </td>
                  <td
                    className="py-3 px-3 text-center relative"
                    ref={activeMenuId === tx.id ? rowMenuRef : null}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMenuId((prev) => (prev === tx.id ? null : tx.id))}
                      className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer"
                      title="Row Actions"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    {activeMenuId === tx.id && (
                      <div
                        className={`absolute right-3 ${
                          openUpward ? 'bottom-8' : 'top-8'
                        } bg-bg-card border border-border shadow-xl rounded-xl p-1.5 z-40 min-w-[120px] text-left animate-fade-in`}
                      >
                        <button
                          type="button"
                          onClick={() => handleDelete(tx.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="py-10 text-center text-xs text-text-muted">
            No transactions match your search filter.
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Add New Transaction</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Product / Service</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Standing Desk"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Unit Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                >
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-text hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-semibold"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Success') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Success
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <span className="w-2 h-2 rounded-full bg-slate-400" />
      Refunded
    </span>
  );
}
