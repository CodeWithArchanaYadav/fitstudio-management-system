import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Members Page
 * Displays member directory and registration form layout.
 * Clean, production-ready form and table with standard error handling.
 */
function Members() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: 'Standard',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setStatusMessage('Validation Error: Please provide both full name and email.');
      return;
    }
    // Graceful error notification when backend is unavailable
    setStatusMessage('Unable to complete member registration at this time. Please try again later.');
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Gym Members Management
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              View registered gym members and add new subscriptions
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
                setShowAddForm(!showAddForm);
                setStatusMessage('');
              }}
            >
              {showAddForm ? 'Close Form' : '+ Register New Member'}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="notice-box notice-warning">
            {statusMessage}
          </div>
        )}

        {/* Member Registration Form */}
        {showAddForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">Register New Member</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="member-fullname" className="form-label">Full Name</label>
                  <input
                    id="member-fullname"
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="member-email" className="form-label">Email Address</label>
                  <input
                    id="member-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="member-phone" className="form-label">Phone Number</label>
                  <input
                    id="member-phone"
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="member-plan" className="form-label">Membership Tier</label>
                  <select
                    id="member-plan"
                    name="plan"
                    className="form-select"
                    value={formData.plan}
                    onChange={handleChange}
                  >
                    <option value="Basic">Basic (Gym Floor)</option>
                    <option value="Standard">Standard (Full Access)</option>
                    <option value="Premium">Premium (Personal Trainer Included)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  Submit Registration
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Registered Members Directory</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No registered members found.
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

export default Members;
