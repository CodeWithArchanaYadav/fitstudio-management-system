import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Payments Page
 * Displays payment processing layout and transaction records.
 * Uses Indian Rupees (₹) and clean user-facing error handling.
 */
function Payments() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
  });
  const [notice, setNotice] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setNotice('Validation Error: Please provide a valid payment amount.');
      return;
    }
    // Graceful error notification when payment service is unavailable
    setNotice('Unable to process payment transaction at this time. Please try again later.');
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Billing & Payment Records
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Gym membership transactions, fee collections, and invoices
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              ← Back to Dashboard
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setShowPaymentForm(!showPaymentForm);
                setNotice('');
              }}
            >
              {showPaymentForm ? 'Close Payment Form' : '+ Record Payment'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="notice-box notice-warning">
            {notice}
          </div>
        )}

        {/* Record Payment Form */}
        {showPaymentForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">Record Member Payment</h2>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="payment-member" className="form-label">Member Name or ID</label>
                  <input
                    id="payment-member"
                    type="text"
                    name="memberId"
                    className="form-input"
                    placeholder="e.g. MEM-1001"
                    value={formData.memberId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="payment-amount" className="form-label">Amount (₹)</label>
                  <input
                    id="payment-amount"
                    type="number"
                    step="1"
                    name="amount"
                    className="form-input"
                    placeholder="e.g. 1500"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="payment-method" className="form-label">Payment Method</label>
                  <select
                    id="payment-method"
                    name="paymentMethod"
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="Cash">Cash (Front Desk)</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="UPI">UPI / Net Banking</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="payment-notes" className="form-label">Invoice Notes / Reference</label>
                <input
                  id="payment-notes"
                  type="text"
                  name="notes"
                  className="form-input"
                  placeholder="e.g. Monthly Standard Membership renewal"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  Submit Payment Record
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transaction History Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Transaction History</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Member ID / Name</th>
                  <th>Amount (₹)</th>
                  <th>Payment Method</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No payment records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payments;
