import { X, Printer, Download, Building2, CreditCard, Wallet, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { INVOICE_STATUS_COLORS } from '../../utils/constants';

export default function InvoiceDetail({ invoice, onClose }) {
  if (!invoice) return null;

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1d26; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
          .brand { font-size: 24px; font-weight: 700; color: #6c5ce7; }
          .invoice-label { font-size: 28px; font-weight: 300; color: #8c90a0; text-transform: uppercase; letter-spacing: 2px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
          .meta-group h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8c90a0; margin-bottom: 8px; }
          .meta-group p { font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f4f5f7; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8c90a0; font-weight: 600; }
          td { padding: 12px 16px; border-bottom: 1px solid #e2e4ea; font-size: 14px; }
          .text-right { text-align: right; }
          .total-row { border-top: 2px solid #1a1d26; }
          .total-row td { font-weight: 700; font-size: 16px; padding-top: 16px; }
          .notes { background: #f4f5f7; padding: 16px; border-radius: 8px; font-size: 13px; color: #4a4f5e; margin-top: 20px; }
          .bank-box { background: #f8f9fa; border: 1px solid #e2e4ea; border-radius: 8px; padding: 16px; margin-top: 24px; }
          .bank-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6c5ce7; margin-bottom: 12px; font-weight: 700; }
          .bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
          .bank-grid div { line-height: 1.4; }
          .bank-grid span { color: #8c90a0; font-weight: 500; }
          .bank-grid code { font-family: monospace; font-weight: 600; color: #1a1d26; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Aeitron AI</div>
            <p style="font-size:13px;color:#8c90a0;margin-top:4px">Finance Dashboard</p>
          </div>
          <div style="text-align:right">
            <div class="invoice-label">Invoice</div>
            <p style="font-size:16px;font-weight:600;margin-top:4px">${invoice.invoiceNumber}</p>
          </div>
        </div>
        <div class="meta">
          <div class="meta-group">
            <h3>Bill To</h3>
            <p><strong>${invoice.clientName}</strong><br>${invoice.companyName}</p>
          </div>
          <div class="meta-group" style="text-align:right">
            <h3>Invoice Details</h3>
            <p>
              Status: <strong>${invoice.status}</strong><br>
              Issued: ${formatDate(invoice.issueDate)}<br>
              Due: ${formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.lineItems.map((item) => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" class="text-right">Total</td>
              <td class="text-right">${formatCurrency(invoice.total)}</td>
            </tr>
          </tbody>
        </table>

        ${(invoice.bankDetails && (invoice.bankDetails.bankName || invoice.bankDetails.accountNumber)) ||
          (invoice.stripeDetails && invoice.stripeDetails.paymentLink) ||
          (invoice.paypalDetails && (invoice.paypalDetails.email || invoice.paypalDetails.paypalMe)) ? `
          <div class="bank-box">
            <h4>Accepted Payment Methods</h4>
            
            ${invoice.bankDetails && (invoice.bankDetails.bankName || invoice.bankDetails.accountNumber) ? `
              <div style="margin-bottom:12px;">
                <p style="font-size:11px;font-weight:700;color:#1a1d26;margin-bottom:6px;">Bank Transfer / Wire</p>
                <div class="bank-grid">
                  ${invoice.bankDetails.bankName ? `<div><span>Bank Name:</span> <strong>${invoice.bankDetails.bankName}</strong></div>` : ''}
                  ${invoice.bankDetails.accountName ? `<div><span>Beneficiary:</span> <strong>${invoice.bankDetails.accountName}</strong></div>` : ''}
                  ${invoice.bankDetails.accountNumber ? `<div><span>Account / IBAN:</span> <code>${invoice.bankDetails.accountNumber}</code></div>` : ''}
                  ${invoice.bankDetails.routingNumber ? `<div><span>Routing / SWIFT:</span> <code>${invoice.bankDetails.routingNumber}</code></div>` : ''}
                </div>
              </div>
            ` : ''}

            ${invoice.stripeDetails && invoice.stripeDetails.paymentLink ? `
              <div style="margin-bottom:12px;padding-top:10px;border-top:1px dashed #e2e4ea;">
                <p style="font-size:11px;font-weight:700;color:#6366f1;margin-bottom:4px;">Pay Online via Stripe (Cards, Apple/Google Pay)</p>
                <div style="font-size:13px;">
                  <span>Payment Link:</span> <a href="${invoice.stripeDetails.paymentLink}" target="_blank" style="color:#6c5ce7;word-break:break-all;">${invoice.stripeDetails.paymentLink}</a>
                  ${invoice.stripeDetails.note ? `<p style="color:#8c90a0;font-size:11px;margin-top:2px;">${invoice.stripeDetails.note}</p>` : ''}
                </div>
              </div>
            ` : ''}

            ${invoice.paypalDetails && (invoice.paypalDetails.email || invoice.paypalDetails.paypalMe) ? `
              <div style="padding-top:10px;border-top:1px dashed #e2e4ea;">
                <p style="font-size:11px;font-weight:700;color:#0070ba;margin-bottom:4px;">Pay via PayPal</p>
                <div class="bank-grid">
                  ${invoice.paypalDetails.email ? `<div><span>PayPal Email:</span> <strong>${invoice.paypalDetails.email}</strong></div>` : ''}
                  ${invoice.paypalDetails.paypalMe ? `<div><span>PayPal.me:</span> <strong>${invoice.paypalDetails.paypalMe}</strong></div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function handleExportCSV() {
    const rows = [
      ['Invoice', invoice.invoiceNumber],
      ['Client', invoice.clientName],
      ['Company', invoice.companyName],
      ['Status', invoice.status],
      ['Issue Date', invoice.issueDate],
      ['Due Date', invoice.dueDate],
      [''],
      ['Description', 'Quantity', 'Unit Price', 'Total'],
      ...invoice.lineItems.map((item) => [
        item.description,
        item.quantity,
        item.unitPrice,
        item.total,
      ]),
      [''],
      ['Total', '', '', invoice.total],
    ];

    if (invoice.bankDetails && (invoice.bankDetails.bankName || invoice.bankDetails.accountNumber)) {
      rows.push(
        [''],
        ['--- Bank Transfer Details ---'],
        ['Bank Name', invoice.bankDetails.bankName || ''],
        ['Account Holder', invoice.bankDetails.accountName || ''],
        ['Account / IBAN', invoice.bankDetails.accountNumber || ''],
        ['Routing / SWIFT', invoice.bankDetails.routingNumber || ''],
      );
    }

    if (invoice.stripeDetails && invoice.stripeDetails.paymentLink) {
      rows.push(
        [''],
        ['--- Stripe Payment ---'],
        ['Payment Link', invoice.stripeDetails.paymentLink],
        ['Notes', invoice.stripeDetails.note || ''],
      );
    }

    if (invoice.paypalDetails && (invoice.paypalDetails.email || invoice.paypalDetails.paypalMe)) {
      rows.push(
        [''],
        ['--- PayPal Payment ---'],
        ['PayPal Email', invoice.paypalDetails.email || ''],
        ['PayPal.me', invoice.paypalDetails.paypalMe || ''],
      );
    }

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Invoice {invoice.invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-text-muted hover:text-accent rounded-lg hover:bg-bg-hover transition-colors"
              title="Print"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={handleExportCSV}
              className="p-2 text-text-muted hover:text-accent rounded-lg hover:bg-bg-hover transition-colors"
              title="Export CSV"
            >
              <Download size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text rounded-lg hover:bg-bg-hover transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice preview */}
        <div className="p-6 space-y-6">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-accent">Aeitron AI</h3>
              <p className="text-xs text-text-muted">Finance Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-light text-text-muted uppercase tracking-widest">Invoice</p>
              <p className="text-base font-semibold text-text mt-1">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Client & details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Bill To</p>
              <p className="text-sm font-medium text-text">{invoice.clientName}</p>
              <p className="text-sm text-text-muted">{invoice.companyName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Details</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-text-muted">Status: </span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${INVOICE_STATUS_COLORS[invoice.status]}`}>
                    {invoice.status}
                  </span>
                </p>
                <p><span className="text-text-muted">Issued: </span><span className="text-text">{formatDate(invoice.issueDate)}</span></p>
                <p><span className="text-text-muted">Due: </span><span className="text-text">{formatDate(invoice.dueDate)}</span></p>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-bg">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, i) => (
                  <tr key={i} className="border-t border-border-light">
                    <td className="px-4 py-3 text-sm text-text">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-text-muted text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-text-muted text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-text text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-text">
                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-text text-right">Total</td>
                  <td className="px-4 py-3 text-base font-bold text-text text-right">{formatCurrency(invoice.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Methods (Bank, Stripe, PayPal) */}
          {((invoice.bankDetails && (invoice.bankDetails.bankName || invoice.bankDetails.accountNumber)) ||
            (invoice.stripeDetails && invoice.stripeDetails.paymentLink) ||
            (invoice.paypalDetails && (invoice.paypalDetails.email || invoice.paypalDetails.paypalMe))) && (
            <div className="bg-bg border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text uppercase tracking-wider">Payment & Settlement Options</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Verified Payment Options</span>
              </div>

              <div className="space-y-3 pt-1">
                {/* 1. Bank Transfer */}
                {invoice.bankDetails && (invoice.bankDetails.bankName || invoice.bankDetails.accountNumber) && (
                  <div className="p-3 bg-bg-card border border-border/80 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-text font-medium text-xs">
                      <Building2 size={15} className="text-accent" />
                      <span>Bank Wire / ACH Transfer</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {invoice.bankDetails.bankName && (
                        <div>
                          <span className="text-text-muted">Bank: </span>
                          <span className="font-semibold text-text">{invoice.bankDetails.bankName}</span>
                        </div>
                      )}
                      {invoice.bankDetails.accountName && (
                        <div>
                          <span className="text-text-muted">Beneficiary: </span>
                          <span className="font-semibold text-text">{invoice.bankDetails.accountName}</span>
                        </div>
                      )}
                      {invoice.bankDetails.accountNumber && (
                        <div>
                          <span className="text-text-muted">Account / IBAN: </span>
                          <span className="font-mono font-semibold text-text">{invoice.bankDetails.accountNumber}</span>
                        </div>
                      )}
                      {invoice.bankDetails.routingNumber && (
                        <div>
                          <span className="text-text-muted">Routing / SWIFT: </span>
                          <span className="font-mono font-semibold text-text">{invoice.bankDetails.routingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Stripe Checkout */}
                {invoice.stripeDetails && invoice.stripeDetails.paymentLink && (
                  <div className="p-3 bg-bg-card border border-border/80 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-text font-medium text-xs">
                        <CreditCard size={15} className="text-indigo-500" />
                        <span>Credit / Debit Card via Stripe</span>
                      </div>
                      <a
                        href={invoice.stripeDetails.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
                      >
                        <span>Pay via Stripe</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    {invoice.stripeDetails.note && (
                      <p className="text-[11px] text-text-muted">{invoice.stripeDetails.note}</p>
                    )}
                  </div>
                )}

                {/* 3. PayPal */}
                {invoice.paypalDetails && (invoice.paypalDetails.email || invoice.paypalDetails.paypalMe) && (
                  <div className="p-3 bg-bg-card border border-border/80 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-text font-medium text-xs">
                        <Wallet size={15} className="text-blue-500" />
                        <span>PayPal Transfer</span>
                      </div>
                      {invoice.paypalDetails.paypalMe && (
                        <a
                          href={`https://${invoice.paypalDetails.paypalMe.replace(/^https?:\/\//, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
                        >
                          <span>PayPal.Me</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    {invoice.paypalDetails.email && (
                      <div className="text-xs">
                        <span className="text-text-muted">PayPal Email: </span>
                        <span className="font-semibold text-text">{invoice.paypalDetails.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-bg rounded-lg p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-text-secondary">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
