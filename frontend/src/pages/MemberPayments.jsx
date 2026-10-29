import React, { useState } from 'react';

/**
 * MemberPayments Page
 * Dedicated view of the member's payment transactions, receipts, and invoices.
 * Shows prices in Indian Rupees (₹) and outstanding dues.
 * Accessible at /member/payments under DashboardLayout.
 */
function MemberPayments() {
  const [downloadNotice, setDownloadNotice] = useState('');

  const payments = [
    {
      invoiceId: 'INV-2026-1042',
      date: '01 Oct 2026',
      description: 'Standard Pro Plan (30 Days Renewal)',
      amount: 3000,
      method: 'UPI',
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-0914',
      date: '01 Sep 2026',
      description: 'Standard Pro Plan (30 Days Renewal)',
      amount: 3000,
      method: 'UPI',
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-0815',
      date: '15 Aug 2026',
      description: 'FitStudio Registration Fee + Standard Pro Plan (30 Days)',
      amount: 3500,
      method: 'Debit Card (POS)',
      status: 'Paid',
    },
  ];

  const handleDownload = (invoiceId) => {
    setDownloadNotice(
      `Receipt ${invoiceId} preview generated. PDF export will be enabled when connected to receipt services.`
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

      {downloadNotice && (
        <div className="notice-box notice-warning mb-3">
          {downloadNotice}
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-label">Outstanding Balance</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>₹0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{payments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lifetime Payments</div>
          <div className="stat-value">₹9,500</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Billing Invoices & Receipts</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Payment Date</th>
                <th>Plan Description</th>
                <th>Amount (₹)</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((item) => (
                  <tr key={item.invoiceId}>
                    <td style={{ fontWeight: 600 }}>{item.invoiceId}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{item.date}</td>
                    <td>{item.description}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td>{item.method}</td>
                    <td>
                      <span className="badge badge-green">{item.status}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDownload(item.invoiceId)}
                      >
                        📄 Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No payment history found.
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
