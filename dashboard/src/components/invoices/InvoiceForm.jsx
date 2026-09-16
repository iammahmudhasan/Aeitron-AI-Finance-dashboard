import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building2, CreditCard, Wallet } from 'lucide-react';
import { useInvoices } from '../../context/InvoiceContext';
import { useClients } from '../../context/ClientContext';
import { INVOICE_STATUSES, BANK_DETAILS_STORAGE_KEY, PAYMENT_METHODS_STORAGE_KEY } from '../../utils/constants';

const emptyLineItem = { description: '', quantity: 1, unitPrice: '' };

const defaultBankDetails = {
  enabled: false,
  bankName: '',
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  swiftCode: '',
};

const defaultStripeDetails = {
  enabled: false,
  paymentLink: '',
  note: '',
};

const defaultPaypalDetails = {
  enabled: false,
  email: '',
  paypalMe: '',
};

function generateInvoiceNumber(invoices) {
  const num = invoices.length + 1;
  return `INV-${String(num).padStart(4, '0')}`;
}

export default function InvoiceForm({ isOpen, onClose, editInvoice }) {
  const { invoices, dispatch } = useInvoices();
  const { clients } = useClients();
  const [activePaymentTab, setActivePaymentTab] = useState('bank');
  const [savePaymentSuccess, setSavePaymentSuccess] = useState(false);

  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    companyName: '',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    status: 'Draft',
    lineItems: [{ ...emptyLineItem }],
    notes: '',
    bankDetails: { ...defaultBankDetails },
    stripeDetails: { ...defaultStripeDetails },
    paypalDetails: { ...defaultPaypalDetails },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editInvoice) {
      setForm({
        clientId: editInvoice.clientId,
        clientName: editInvoice.clientName,
        companyName: editInvoice.companyName,
        invoiceNumber: editInvoice.invoiceNumber,
        issueDate: editInvoice.issueDate,
        dueDate: editInvoice.dueDate,
        status: editInvoice.status,
        lineItems: editInvoice.lineItems.length > 0 ? editInvoice.lineItems : [{ ...emptyLineItem }],
        notes: editInvoice.notes || '',
        bankDetails: editInvoice.bankDetails
          ? { ...defaultBankDetails, ...editInvoice.bankDetails, enabled: true }
          : { ...defaultBankDetails },
        stripeDetails: editInvoice.stripeDetails
          ? { ...defaultStripeDetails, ...editInvoice.stripeDetails, enabled: true }
          : { ...defaultStripeDetails },
        paypalDetails: editInvoice.paypalDetails
          ? { ...defaultPaypalDetails, ...editInvoice.paypalDetails, enabled: true }
          : { ...defaultPaypalDetails },
      });
    } else {
      let initialBank = { ...defaultBankDetails };
      let initialStripe = { ...defaultStripeDetails };
      let initialPaypal = { ...defaultPaypalDetails };

      try {
        const rawMethods = localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY);
        if (rawMethods) {
          const parsed = JSON.parse(rawMethods);
          if (parsed?.bank) initialBank = { ...defaultBankDetails, ...parsed.bank };
          if (parsed?.stripe) initialStripe = { ...defaultStripeDetails, ...parsed.stripe };
          if (parsed?.paypal) initialPaypal = { ...defaultPaypalDetails, ...parsed.paypal };
        } else {
          const rawBank = localStorage.getItem(BANK_DETAILS_STORAGE_KEY);
          if (rawBank) {
            const parsedBank = JSON.parse(rawBank);
            if (parsedBank?.bankName || parsedBank?.accountNumber) {
              initialBank = { ...defaultBankDetails, ...parsedBank, enabled: true };
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved payment methods:', err);
      }

      const today = new Date().toISOString().split('T')[0];
      const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setForm({
        clientId: '',
        clientName: '',
        companyName: '',
        invoiceNumber: generateInvoiceNumber(invoices),
        issueDate: today,
        dueDate: due,
        status: 'Draft',
        lineItems: [{ ...emptyLineItem }],
        notes: '',
        bankDetails: initialBank,
        stripeDetails: initialStripe,
        paypalDetails: initialPaypal,
      });
    }
    setErrors({});
  }, [editInvoice, isOpen, invoices]);

  if (!isOpen) return null;

  function handleClientSelect(clientId) {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setForm((prev) => ({
        ...prev,
        clientId: client.id,
        clientName: client.clientName,
        companyName: client.companyName,
      }));
    }
  }

  function handleLineItemChange(index, field, value) {
    setForm((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, lineItems: items };
    });
  }

  function addLineItem() {
    setForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...emptyLineItem }],
    }));
  }

  function removeLineItem(index) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }

  function calcLineTotal(item) {
    return (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
  }

  function calcTotal() {
    return form.lineItems.reduce((sum, item) => sum + calcLineTotal(item), 0);
  }

  function validate() {
    const errs = {};
    if (!form.clientId) errs.clientId = 'Select a client';
    if (!form.invoiceNumber.trim()) errs.invoiceNumber = 'Required';
    if (!form.issueDate) errs.issueDate = 'Required';
    if (!form.dueDate) errs.dueDate = 'Required';
    const validItems = form.lineItems.filter((item) => item.description.trim() && parseFloat(item.unitPrice) > 0);
    if (validItems.length === 0) errs.lineItems = 'Add at least one line item';
    return errs;
  }

    function handleBankChange(field, value) {
    setForm((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  }

  function handleStripeChange(field, value) {
    setForm((prev) => ({
      ...prev,
      stripeDetails: {
        ...prev.stripeDetails,
        [field]: value,
      },
    }));
  }

  function handlePaypalChange(field, value) {
    setForm((prev) => ({
      ...prev,
      paypalDetails: {
        ...prev.paypalDetails,
        [field]: value,
      },
    }));
  }

  function handleSaveDefaultPaymentMethods() {
    try {
      const payload = {
        bank: form.bankDetails,
        stripe: form.stripeDetails,
        paypal: form.paypalDetails,
      };
      localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(BANK_DETAILS_STORAGE_KEY, JSON.stringify(form.bankDetails));
      setSavePaymentSuccess(true);
      setTimeout(() => setSavePaymentSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save payment methods:', err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date().toISOString();
    const lineItems = form.lineItems
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description.trim(),
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total: calcLineTotal(item),
      }));

    const invoiceData = {
      clientId: form.clientId,
      clientName: form.clientName,
      companyName: form.companyName,
      invoiceNumber: form.invoiceNumber.trim(),
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: form.status,
      lineItems,
      subtotal: calcTotal(),
      total: calcTotal(),
      notes: form.notes.trim(),
      bankDetails: form.bankDetails?.enabled ? { ...form.bankDetails } : null,
      stripeDetails: form.stripeDetails?.enabled ? { ...form.stripeDetails } : null,
      paypalDetails: form.paypalDetails?.enabled ? { ...form.paypalDetails } : null,
    };

    if (editInvoice) {
      dispatch({
        type: 'UPDATE_INVOICE',
        payload: { id: editInvoice.id, ...invoiceData, updatedAt: now },
      });
    } else {
      dispatch({
        type: 'ADD_INVOICE',
        payload: {
          id: crypto.randomUUID(),
          ...invoiceData,
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text">
            {editInvoice ? 'Edit Invoice' : 'Create Invoice'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client & Invoice number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Client</label>
              <select
                value={form.clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className={`w-full px-3 py-2.5 bg-bg border rounded-lg text-text text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors ${errors.clientId ? 'border-danger' : 'border-border'}`}
              >
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.clientName} — {c.companyName}</option>
                ))}
              </select>
              {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Invoice #</label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                className={`w-full px-3 py-2.5 bg-bg border rounded-lg text-text text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors ${errors.invoiceNumber ? 'border-danger' : 'border-border'}`}
              />
              {errors.invoiceNumber && <p className="text-xs text-danger mt-1">{errors.invoiceNumber}</p>}
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Issue Date</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              >
                {INVOICE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-muted">Line Items</label>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
              >
                <Plus size={13} /> Add item
              </button>
            </div>
            {errors.lineItems && <p className="text-xs text-danger mb-2">{errors.lineItems}</p>}

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-text-muted px-1">
                <span className="col-span-5">Description</span>
                <span className="col-span-2">Qty</span>
                <span className="col-span-2">Price</span>
                <span className="col-span-2 text-right">Total</span>
                <span className="col-span-1" />
              </div>
              {form.lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(i, 'description', e.target.value)}
                    className="col-span-5 px-2.5 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(i, 'quantity', e.target.value)}
                    className="col-span-2 px-2.5 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(i, 'unitPrice', e.target.value)}
                    className="col-span-2 px-2.5 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                  />
                  <span className="col-span-2 text-sm text-text text-right font-medium">
                    ${calcLineTotal(item).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLineItem(i)}
                    disabled={form.lineItems.length === 1}
                    className="col-span-1 p-1.5 text-text-muted hover:text-danger rounded transition-colors disabled:opacity-20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <div className="text-right">
                <span className="text-sm text-text-muted">Total: </span>
                <span className="text-lg font-semibold text-text">${calcTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods (Bank, Stripe, PayPal) */}
          <div className="border border-border rounded-xl p-4 bg-bg/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">Payment Methods & Settlement</span>
              <span className="text-[11px] text-text-muted">Configure payment options for this invoice</span>
            </div>

            {/* Method Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-bg rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActivePaymentTab('bank')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  activePaymentTab === 'bank'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                }`}
              >
                <Building2 size={14} />
                <span>Bank Transfer</span>
                {form.bankDetails?.enabled && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activePaymentTab === 'bank' ? 'bg-white' : 'bg-success'}`} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('stripe')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  activePaymentTab === 'stripe'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                }`}
              >
                <CreditCard size={14} />
                <span>Stripe</span>
                {form.stripeDetails?.enabled && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activePaymentTab === 'stripe' ? 'bg-white' : 'bg-success'}`} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('paypal')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  activePaymentTab === 'paypal'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                }`}
              >
                <Wallet size={14} />
                <span>PayPal</span>
                {form.paypalDetails?.enabled && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activePaymentTab === 'paypal' ? 'bg-white' : 'bg-success'}`} />
                )}
              </button>
            </div>

            {/* Tab 1: Bank Transfer */}
            {activePaymentTab === 'bank' && (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="text-xs font-medium text-text-secondary">Direct Bank Wire / ACH</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted select-none">
                    <input
                      type="checkbox"
                      checked={form.bankDetails?.enabled || false}
                      onChange={(e) => handleBankChange('enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                    />
                    <span>Include Bank on invoice</span>
                  </label>
                </div>

                {form.bankDetails?.enabled && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Bank Name</label>
                        <input
                          type="text"
                          placeholder="e.g. JPMorgan Chase / City Bank"
                          value={form.bankDetails.bankName || ''}
                          onChange={(e) => handleBankChange('bankName', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Account Name / Beneficiary</label>
                        <input
                          type="text"
                          placeholder="e.g. Aeitron AI LLC"
                          value={form.bankDetails.accountName || ''}
                          onChange={(e) => handleBankChange('accountName', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Account Number / IBAN</label>
                        <input
                          type="text"
                          placeholder="e.g. 123456789012"
                          value={form.bankDetails.accountNumber || ''}
                          onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text font-mono outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Routing / SWIFT / Branch</label>
                        <input
                          type="text"
                          placeholder="e.g. 021000021 / CHASUS33"
                          value={form.bankDetails.routingNumber || ''}
                          onChange={(e) => handleBankChange('routingNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text font-mono outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Stripe */}
            {activePaymentTab === 'stripe' && (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="text-xs font-medium text-text-secondary">Stripe Credit/Debit Card Checkout</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted select-none">
                    <input
                      type="checkbox"
                      checked={form.stripeDetails?.enabled || false}
                      onChange={(e) => handleStripeChange('enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                    />
                    <span>Include Stripe on invoice</span>
                  </label>
                </div>

                {form.stripeDetails?.enabled && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Stripe Payment Link / Checkout URL</label>
                      <input
                        type="url"
                        placeholder="https://buy.stripe.com/..."
                        value={form.stripeDetails.paymentLink || ''}
                        onChange={(e) => handleStripeChange('paymentLink', e.target.value)}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text font-mono outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Payment Instructions / Notes</label>
                      <input
                        type="text"
                        placeholder="Accepts Visa, Mastercard, Amex, Apple Pay, Google Pay"
                        value={form.stripeDetails.note || ''}
                        onChange={(e) => handleStripeChange('note', e.target.value)}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: PayPal */}
            {activePaymentTab === 'paypal' && (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="text-xs font-medium text-text-secondary">PayPal Transfer / Checkout</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted select-none">
                    <input
                      type="checkbox"
                      checked={form.paypalDetails?.enabled || false}
                      onChange={(e) => handlePaypalChange('enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30 cursor-pointer"
                    />
                    <span>Include PayPal on invoice</span>
                  </label>
                </div>

                {form.paypalDetails?.enabled && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">PayPal Email Address</label>
                        <input
                          type="email"
                          placeholder="billing@aeitron.com"
                          value={form.paypalDetails.email || ''}
                          onChange={(e) => handlePaypalChange('email', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">PayPal.me Handle / Link</label>
                        <input
                          type="text"
                          placeholder="paypal.me/aeitron"
                          value={form.paypalDetails.paypalMe || ''}
                          onChange={(e) => handlePaypalChange('paypalMe', e.target.value)}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Save as Default Action */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <button
                type="button"
                onClick={handleSaveDefaultPaymentMethods}
                className="text-accent hover:text-accent-hover font-medium underline underline-offset-2 transition-colors"
              >
                {savePaymentSuccess ? '✓ Saved as default payment methods!' : 'Save current payment settings as default'}
              </button>
              <span className="text-[11px] text-text-muted">Enabled methods appear on preview & print</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="Payment terms, special instructions..."
              className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-muted/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text border border-border rounded-lg hover:bg-bg-hover transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {editInvoice ? 'Save Changes' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
