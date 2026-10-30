import React, { useState } from 'react';
import { api } from '../services/api';

/**
 * ReceptionistPayments Page
 * Front Desk Billing, Fee Collections & Invoicing.
 * Accessible at /receptionist/payments under DashboardLayout.
 */
function ReceptionistPayments() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Baseline transactions (development preview data)
  const [transactions, setTransactions] = useState([
    {
      invoiceId: 'INV-2026-1042',
      member: 'Rahul Sharma (MEM-1001)',
      amount: 3000,
      method: 'UPI',
      date: '01 Oct 2026, 10:30 AM',
      description: 'Standard Pro Plan 30-Day renewal fee',
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-1043',
      member: 'Priya Patel (MEM-1002)',
      amount: 5000,
      method: 'Card',
      date: '15 Sep 2026, 04:15 PM',
      description: 'Premium Elite Plan 30-Day pass',
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-1044',
      member: 'Amit Verma (MEM-1003)',
      amount: 1500,
      method: 'Cash',
      date: '10 Jul 2026, 11:00 AM',
      description: 'Basic Gym Plan 30-Day pass',
      status: 'Paid',
    },
  ]);

  const validate = () => {
    const errs = {};
    if (!formData.memberId.trim()) {
      errs.memberId = 'Member name or ID is required.';
    }
    const amt = Number(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Please provide a valid payment amount in ₹.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setNotice({ type: '', text: '' });

    const newTx = {
      invoiceId: `INV-2026-${Math.floor(1050 + Math.random() * 500)}`,
      member: formData.memberId.trim(),
      amount: Number(formData.amount),
      method: formData.paymentMethod,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: formData.notes.trim() || 'Front desk walk-in collection',
      status: 'Recorded',
    };

    try {
      const res = await api.recordPayment({
        memberId: formData.memberId.trim(),
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
      });

      if (res.success) {
        setTransactions([newTx, ...transactions]);
        setNotice({
          type: 'info',
          text: `Payment entry recorded for ${formData.memberId} (₹${formData.amount}).`,
        });
      } else {
        // Frontend development preview
        setTransactions([newTx, ...transactions]);
        setNotice({
          type: 'info',
          text: `Payment entry recorded locally for ${formData.memberId} (₹${Number(formData.amount).toLocaleString('en-IN')} via ${formData.paymentMethod}). Frontend prototype mode — live payment gateway integration will be handled by Spring Boot.`,
        });
      }
      setFormData({ memberId: '', amount: '', paymentMethod: 'Cash', notes: '' });
      setShowPaymentForm(false);
    } catch {
      setTransactions([newTx, ...transactions]);
      setNotice({
        type: 'info',
        text: `Payment entry recorded locally for ${formData.memberId} (₹${Number(formData.amount).toLocaleString('en-IN')}).`,
      });
      setFormData({ memberId: '', amount: '', paymentMethod: 'Cash', notes: '' });
      setShowPaymentForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Front Desk Payments & Billing
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Collect gym membership fees, record cash/card/UPI transactions, and issue receipts
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowPaymentForm(!showPaymentForm);
            setNotice({ type: '', text: '' });
          }}
        >
          {showPaymentForm ? 'Close Payment Form' : '+ Record Walk-In Payment'}
        </button>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Record Payment Form */}
      {showPaymentForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Record Member Payment & Generate Receipt</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Front desk fee intake in Indian Rupees (₹). Records are held in frontend preview state.
              </p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} noValidate>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Member Name or ID *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma or MEM-1001"
                  value={formData.memberId}
                  onChange={(e) => {
                    setFormData({ ...formData, memberId: e.target.value });
                    if (formErrors.memberId) setFormErrors({ ...formErrors, memberId: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.memberId && <div className="form-error">{formErrors.memberId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Amount in INR (₹) *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-input"
                  placeholder="e.g. 3000"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (formErrors.amount) setFormErrors({ ...formErrors, amount: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.amount && <div className="form-error">{formErrors.amount}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="Cash">Cash (Front Desk)</option>
                  <option value="Card">Debit / Credit Card (POS Terminal)</option>
                  <option value="UPI">UPI / QR Code</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Description / Plan Details</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Standard Pro Plan 30-Day renewal fee"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowPaymentForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">Front Desk Transactions & Receipts</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Audit log of fees received at the front desk. Amounts shown in Indian Rupees (₹).
            </p>
          </div>
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search member, invoice #, or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Member Information</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Payment Mode</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.invoiceId}>
                    <td style={{ fontWeight: 600 }}>{t.invoiceId}</td>
                    <td style={{ fontWeight: 500 }}>{t.member}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{t.description}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td>{t.method}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{t.date}</td>
                    <td>
                      <span className="badge badge-green">{t.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No payment records match "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistPayments;
