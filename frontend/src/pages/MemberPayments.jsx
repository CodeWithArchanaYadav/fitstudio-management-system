import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/** Helper to format ISO date string */
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
 * MemberPayments Page
 * Dedicated view of the member's payment transactions, receipts, and invoices.
 * Shows prices in Indian Rupees (₹).
 * Connected to live backend /api/payments.
 * Accessible at /member/payments under DashboardLayout.
 */
function MemberPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadNotice, setDownloadNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPayments = async () => {
      const res = await api.getPayments();
      if (cancelled) return;

      if (res.success && Array.isArray(res.data)) {
        setPayments(res.data);
      } else if (res.status === 0) {
        setErrorNotice('Cannot connect to payment service. Please ensure the backend server is active.');
      }
      setLoading(false);
    };

    loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = (invoiceNumber) => {
    setDownloadNotice(
      `Receipt ${invoiceNumber} preview generated. PDF export will be enabled when connected to receipt services.`
    );
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Payment History & Invoices
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Review past membership fees, invoices, and payment receipts in Indian Rupees (₹)
          </p>
        </div>
      </div>

      {errorNotice && (
        <div className="notice-box notice-error mb-3">
          {errorNotice}
        </div>
      )}

      {downloadNotice && (
        <div className="notice-box notice-warning mb-3">
          {downloadNotice}
        </div>
      )}

      {/* Member Navigation Tabs */}
      <div className="card mb-3" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.5rem' }}>
            Member Pages:
          </span>
          <Link to="/member/dashboard" className="btn btn-secondary btn-sm">
            Dashboard
          </Link>
          <Link to="/member/profile" className="btn btn-secondary btn-sm">
            My Profile
          </Link>
          <Link to="/member/workouts" className="btn btn-secondary btn-sm">
            My Workouts
          </Link>
          <Link to="/member/membership" className="btn btn-secondary btn-sm">
            My Membership
          </Link>
          <Link to="/member/payments" className="btn btn-primary btn-sm">
            My Payments
          </Link>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Billing Transactions</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Official record of payments processed in Indian Rupees (₹)
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date & Time</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr key={pay.id || pay.invoiceNumber}>
                    <td style={{ fontWeight: 600 }}>{pay.invoiceNumber}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{formatDateTime(pay.paymentDate)}</td>
                    <td>{pay.notes || 'Membership Fee'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{Number(pay.amount).toLocaleString('en-IN')}
                    </td>
                    <td>{pay.paymentMethod}</td>
                    <td>
                      <span className="badge badge-green">{pay.status || 'Paid'}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDownload(pay.invoiceNumber)}
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    {loading ? 'Loading payment transactions…' : 'No payment records found for your account.'}
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

export default MemberPayments;
