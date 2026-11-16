import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/** Format ISO timestamp to date & time string */
function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return iso;
  }
}

/**
 * ReceptionistPayments Page
 * Front Desk Billing, Fee Collections & Invoicing.
 * Connected to backend /api/payments and /api/members.
 * Accessible at /receptionist/payments under DashboardLayout.
 */
function ReceptionistPayments() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadAll = useCallback(async () => {
    const [paymentsRes, membersRes] = await Promise.all([
      api.getPayments(),
      api.getMembers(),
    ]);

    if (paymentsRes.success && Array.isArray(paymentsRes.data)) {
      setPayments(paymentsRes.data);
    } else if (paymentsRes.status === 0) {
      setNotice({ type: 'error', text: 'Payment service is currently unavailable. Ensure the backend is running.' });
    }

    if (membersRes.success && Array.isArray(membersRes.data)) {
      setMembers(membersRes.data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const getMemberDisplayName = (memberId) => {
    const m = members.find((x) => x.id === memberId || String(x.id) === String(memberId));
    if (m) {
      return `${m.name || m.fullName} (MEM-${m.id})`;
    }
    return `Member #${memberId}`;
  };

  const validate = () => {
    const errs = {};
    if (!formData.memberId) {
      errs.memberId = 'Please select a member.';
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

    const payload = {
      memberId: Number(formData.memberId),
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim() || undefined,
    };

    const res = await api.recordPayment(payload);
    setIsSubmitting(false);

    if (res.success) {
      setNotice({
        type: 'info',
        text: `Payment of ₹${Number(formData.amount).toLocaleString('en-IN')} recorded successfully (Invoice: ${res.data.invoiceNumber}).`,
      });
      setFormData({ memberId: '', amount: '', paymentMethod: 'Cash', notes: '' });
      setShowPaymentForm(false);
      loadAll();
    } else {
      setNotice({
        type: 'error',
        text: res.error || 'Failed to record payment.',
      });
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredPayments = payments.filter((p) => {
    const memberName = getMemberDisplayName(p.memberId).toLowerCase();
    const inv = (p.invoiceNumber || '').toLowerCase();
    const method = (p.paymentMethod || '').toLowerCase();
    const notes = (p.notes || '').toLowerCase();
    return !q || memberName.includes(q) || inv.includes(q) || method.includes(q) || notes.includes(q);
  });

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
          disabled={members.length === 0}
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
                Front desk fee intake in Indian Rupees (₹) saved to backend database records.
              </p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} noValidate>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Select Member *</label>
                <select
                  className="form-select"
                  value={formData.memberId}
                  onChange={(e) => {
                    setFormData({ ...formData, memberId: e.target.value });
                    if (formErrors.memberId) setFormErrors({ ...formErrors, memberId: '' });
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">Select registered member…</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.fullName} (MEM-{m.id}) {m.plan ? `— ${m.plan}` : ''}
                    </option>
                  ))}
                </select>
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
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id || p.invoiceNumber}>
                    <td style={{ fontWeight: 600 }}>{p.invoiceNumber}</td>
                    <td style={{ fontWeight: 500 }}>{getMemberDisplayName(p.memberId)}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{p.notes || 'Membership Fee'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td>{p.paymentMethod}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{formatDateTime(p.paymentDate)}</td>
                    <td>
                      <span className="badge badge-green">{p.status || 'Paid'}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    {loading
                      ? 'Loading payment records…'
                      : searchQuery
                      ? `No payment records match "${searchQuery}".`
                      : 'No payments recorded yet. Use the Record Walk-In Payment form to log receipts.'}
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
