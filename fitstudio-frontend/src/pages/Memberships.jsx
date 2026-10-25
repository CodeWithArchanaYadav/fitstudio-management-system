import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Memberships Page
 * Shows membership plans and subscription tier layouts.
 * Uses Indian Rupees (₹) formatting and clean error handling.
 */
function Memberships() {
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [notice, setNotice] = useState('');

  const handleCreatePlan = (e) => {
    e.preventDefault();
    setNotice('Unable to save membership plan at this time. Please try again later.');
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Membership Plans & Subscriptions
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Gym membership tiers, durations, and pricing structures
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
                setShowPlanForm(!showPlanForm);
                setNotice('');
              }}
            >
              {showPlanForm ? 'Close Plan Form' : '+ Add Plan Template'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="notice-box notice-warning">
            {notice}
          </div>
        )}

        {/* Create Plan Form */}
        {showPlanForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">New Membership Plan Form</h2>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="plan-name" className="form-label">Plan Name</label>
                  <input id="plan-name" type="text" className="form-input" placeholder="e.g. Monthly Standard" required />
                </div>
                <div className="form-group">
                  <label htmlFor="plan-duration" className="form-label">Duration (Days / Months)</label>
                  <input id="plan-duration" type="text" className="form-input" placeholder="e.g. 30 Days" required />
                </div>
                <div className="form-group">
                  <label htmlFor="plan-fee" className="form-label">Fee Amount (₹)</label>
                  <input id="plan-fee" type="number" className="form-input" placeholder="e.g. 1500" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="plan-desc" className="form-label">Plan Features & Privileges</label>
                <textarea id="plan-desc" className="form-textarea" rows="2" placeholder="Describe facilities included in this plan..."></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  Save Plan
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPlanForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Plan Cards Structure */}
        <div className="grid-3 mb-3">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Basic Gym Plan</h3>
              <span className="badge badge-gray">Starter</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
              ₹1,500 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              <li>✓ Gym Floor Access</li>
              <li>✓ Locker Room Access</li>
              <li>✗ Personal Trainer</li>
              <li>✗ Weekend Guest Passes</li>
            </ul>
            <button
              type="button"
              className="btn btn-secondary btn-full btn-sm"
              onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
            >
              Enroll Member
            </button>
          </div>

          <div className="card" style={{ borderColor: 'var(--color-primary)' }}>
            <div className="card-header">
              <h3 className="card-title">Standard Pro Plan</h3>
              <span className="badge badge-green">Popular</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
              ₹3,000 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              <li>✓ Full Facility 24/7 Access</li>
              <li>✓ Group Fitness Classes</li>
              <li>✓ Locker & Sauna Access</li>
              <li>✗ Personal Trainer</li>
            </ul>
            <button
              type="button"
              className="btn btn-primary btn-full btn-sm"
              onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
            >
              Enroll Member
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Premium Elite Plan</h3>
              <span className="badge badge-blue">VIP</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
              ₹5,000 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              <li>✓ All Standard Features</li>
              <li>✓ Assigned Personal Trainer</li>
              <li>✓ Custom Nutrition Plan</li>
              <li>✓ Unlimited Guest Passes</li>
            </ul>
            <button
              type="button"
              className="btn btn-secondary btn-full btn-sm"
              onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
            >
              Enroll Member
            </button>
          </div>
        </div>

        {/* Member Subscriptions Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Member Subscriptions</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>Member Name</th>
                  <th>Plan Tier</th>
                  <th>Start Date</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No active member subscriptions found.
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

export default Memberships;
