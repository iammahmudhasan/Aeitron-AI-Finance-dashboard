import { useState } from 'react';
import { X, Plus, DollarSign, User, Package, Hash } from 'lucide-react';

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

export default function TransactionModal({ isOpen, onClose, onSuccess }) {
  const [formCustomer, setFormCustomer] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState(1);
  const [formPrice, setFormPrice] = useState(1200);
  const [formStatus, setFormStatus] = useState('Success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formCustomer.trim() || !formProduct.trim()) return;

    setIsSubmitting(true);
    const newTx = {
      id: `#049${Math.floor(100 + Math.random() * 900)}`,
      customer: formCustomer.trim(),
      product: formProduct.trim(),
      status: formStatus,
      qty: Number(formQty) || 1,
      unitPrice: Number(formPrice) || 0,
      totalRevenue: (Number(formQty) || 1) * (Number(formPrice) || 0),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    try {
      const stored = localStorage.getItem('aeitron_transactions');
      const existing = stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
      const updated = [newTx, ...existing];
      localStorage.setItem('aeitron_transactions', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('transactions-updated', { detail: newTx }));
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }

    setIsSubmitting(false);
    setFormCustomer('');
    setFormProduct('');
    setFormQty(1);
    setFormPrice(1200);
    setFormStatus('Success');
    onSuccess?.(newTx);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text tracking-tight">Add New Transaction</h3>
              <p className="text-[11px] text-text-muted">Record client payment or order deliverable</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-bg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="flex items-center gap-1.5 text-text-muted mb-1.5 font-medium">
              <User size={13} className="text-accent" /> Customer Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={formCustomer}
              onChange={(e) => setFormCustomer(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-text-muted mb-1.5 font-medium">
              <Package size={13} className="text-accent" /> Product / Automation Service
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Voice AI Agent"
              value={formProduct}
              onChange={(e) => setFormProduct(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-text-muted mb-1.5 font-medium">
                <Hash size={13} className="text-accent" /> Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-text-muted mb-1.5 font-medium">
                <DollarSign size={13} className="text-accent" /> Unit Price ($)
              </label>
              <input
                type="number"
                min="1"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted mb-1.5 font-medium">Settlement Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="Success">Success (Paid)</option>
              <option value="Pending">Pending (Processing)</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="p-2.5 bg-bg border border-border/80 rounded-xl flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Total Transaction Revenue:</span>
            <span className="font-bold text-accent text-sm">
              ${((Number(formQty) || 1) * (Number(formPrice) || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-xl text-text hover:bg-bg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-semibold shadow-md shadow-accent/20 cursor-pointer disabled:opacity-50"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
