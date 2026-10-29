import React, { useState } from 'react';
import { getStoredPlans } from '../services/plansData';

/**
 * ReceptionistMemberships Page
 * Front desk membership subscriptions and renewals.
 * Receptionists can VIEW admin-configured plans and ENROLL/RENEW members.
 * Strictly prevents Receptionists from creating, editing, or deleting plan templates.
 * Accessible at /receptionist/memberships under DashboardLayout.
 */
function ReceptionistMemberships() {
  const [plans] = useState(() => getStoredPlans().filter((p) => p.status === 'Active'));
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enrollment / Renewal form state
  const [enrollForm, setEnrollForm] = useState(() => ({
    memberId: '',
    memberName: '',
    memberPhone: '',
    planId: '',
    startDate: '',
    paymentMethod: 'Cash',
  }));
  const [enrollErrors, setEnrollErrors] = useState({});

  // Subscriptions directory (development preview data)
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'SUB-2026-081',
      memberId: 'MEM-1001',
      memberName: 'Rahul Sharma',
      planName: 'Standard Pro Plan',
      fee: 3000,
      startDate: '2026-10-01',
      expiryDate: '2026-10-31',
      status: 'Active',
    },
    {
      id: 'SUB-2026-082',
      memberId: 'MEM-1002',
      memberName: 'Priya Patel',
      planName: 'Premium Elite Plan',
      fee: 5000,
      startDate: '2026-09-15',
      expiryDate: '2026-10-15',
      status: 'Expired',
    },
    {
      id: 'SUB-2026-083',
      memberId: 'MEM-1003',
      memberName: 'Amit Verma',
      planName: 'Basic Gym Plan',
      fee: 1500,
      startDate: '2026-10-10',
      expiryDate: '2026-11-09',
      status: 'Active',
    },
  ]);

  const currentPlan = plans.find((p) => p.id === enrollForm.planId) || plans[0];

  const handleOpenEnroll = (planId = '', prefillSub = null) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (prefillSub) {
      const matchingPlan = plans.find((p) => p.name === prefillSub.planName) || plans[0];
      setEnrollForm({
        memberId: prefillSub.memberId || '',
        memberName: prefillSub.memberName,
        memberPhone: '+91 98765 43210',
        planId: matchingPlan?.id || plans[0]?.id || '',
        startDate: todayStr,
        paymentMethod: 'Cash',
      });
    } else {
      setEnrollForm({
        memberId: '',
        memberName: '',
        memberPhone: '',
        planId: planId || plans[0]?.id || '',
        startDate: todayStr,
        paymentMethod: 'Cash',
      });
    }
    setEnrollErrors({});
    setShowEnrollModal(true);
    setNotice({ type: '', text: '' });
  };

  const validateEnrollment = () => {
    const errs = {};
    if (!enrollForm.memberName.trim()) {
      errs.memberName = 'Member name is required.';
    }
    const phoneDigits = enrollForm.memberPhone.replace(/\D/g, '');
    if (!enrollForm.memberPhone.trim()) {
      errs.memberPhone = 'Phone number is required.';
    } else if (phoneDigits.length < 10) {
      errs.memberPhone = 'Valid 10-digit phone number is required.';
    }
    if (!enrollForm.startDate) {
      errs.startDate = 'Start date is required.';
    }
    setEnrollErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!validateEnrollment()) return;

    const chosenPlan = plans.find((p) => p.id === enrollForm.planId) || currentPlan;

    // Calculate expiry date (30 days from start)
    const startDateObj = new Date(enrollForm.startDate);
    const expiryDateObj = new Date(startDateObj);
    expiryDateObj.setDate(expiryDateObj.getDate() + 30);
    const expiryStr = expiryDateObj.toISOString().split('T')[0];

    // Check if this was a renewal of an existing member
    const existingIdx = subscriptions.findIndex(
      (s) => s.memberName.toLowerCase() === enrollForm.memberName.trim().toLowerCase()
    );

    const newSub = {
      id: existingIdx >= 0 ? subscriptions[existingIdx].id : `SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
      memberId: enrollForm.memberId || (existingIdx >= 0 ? subscriptions[existingIdx].memberId : `MEM-${Math.floor(1004 + Math.random() * 800)}`),
      memberName: enrollForm.memberName.trim(),
      planName: chosenPlan?.name || 'Standard Pro Plan',
      fee: chosenPlan?.fee || 3000,
      startDate: enrollForm.startDate,
      expiryDate: expiryStr,
      status: 'Active',
    };

    if (existingIdx >= 0) {
      const updated = [...subscriptions];
      updated[existingIdx] = newSub;
      setSubscriptions(updated);
    } else {
      setSubscriptions([newSub, ...subscriptions]);
    }

    setShowEnrollModal(false);
    setNotice({
      type: 'info',
      text: `Subscription renewed for ${newSub.memberName} with plan "${newSub.planName}" through ${newSub.expiryDate}. (Frontend preview mode).`,
    });
  };

  const filteredSubscriptions = subscriptions.filter(
    (s) =>
      s.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Membership Subscriptions & Renewals
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Assist members with purchasing or extending gym passes using Admin-approved plans
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => handleOpenEnroll()}
        >
          + Enroll / Renew Member Pass
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

      {/* Available Plans Selection (Read-Only Admin Templates) */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Available Membership Plans (Admin-Approved)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Plan pricing, durations, and facility benefits are configured exclusively by Gym Administration.
            </p>
          </div>
          <span className="badge badge-green">Read-Only for Receptionist</span>
        </div>

        {plans.length > 0 ? (
          <div className="grid-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="card"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: plan.id === 'plan-standard' ? 'var(--color-primary)' : 'var(--color-border)',
                  marginBottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div className="flex-between">
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{plan.name}</h3>
                    <span className="badge badge-green">Active</span>
                  </div>

                  <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                    ₹{plan.fee.toLocaleString('en-IN')}{' '}
                    <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                      / {plan.duration}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    {plan.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    <strong>Facilities:</strong> {plan.facilities}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-full btn-sm"
                    onClick={() => handleOpenEnroll(plan.id)}
                  >
                    Select Plan & Enroll Member
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No active membership plans configured by Admin.
          </div>
        )}
      </div>

      {/* Member Subscriptions Directory Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">Member Subscriptions & Expiry Directory</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Look up active or expiring member passes and process renewals
            </p>
          </div>
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search member, subscription ID, or plan..."
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
                <th>Subscription ID</th>
                <th>Member Name</th>
                <th>Plan Tier</th>
                <th>Fee (₹)</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Renewal Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.id}</td>
                    <td style={{ fontWeight: 500 }}>{sub.memberName}</td>
                    <td>{sub.planName}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      ₹{sub.fee.toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{sub.startDate}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{sub.expiryDate}</td>
                    <td>
                      <span className={`badge ${sub.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEnroll('', sub)}
                      >
                        Renew Pass
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No member subscriptions match "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Enrollment / Renewal Modal */}
      {showEnrollModal && (
        <div className="modal-backdrop" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Enroll / Renew Member Subscription</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowEnrollModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Member Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={enrollForm.memberName}
                  onChange={(e) => {
                    setEnrollForm({ ...enrollForm, memberName: e.target.value });
                    if (enrollErrors.memberName) setEnrollErrors({ ...enrollErrors, memberName: '' });
                  }}
                />
                {enrollErrors.memberName && <div className="form-error">{enrollErrors.memberName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Member Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={enrollForm.memberPhone}
                  onChange={(e) => {
                    setEnrollForm({ ...enrollForm, memberPhone: e.target.value });
                    if (enrollErrors.memberPhone) setEnrollErrors({ ...enrollErrors, memberPhone: '' });
                  }}
                />
                {enrollErrors.memberPhone && <div className="form-error">{enrollErrors.memberPhone}</div>}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Select Admin Plan Tier *</label>
                  <select
                    className="form-select"
                    value={enrollForm.planId}
                    onChange={(e) => setEnrollForm({ ...enrollForm, planId: e.target.value })}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.fee} ({p.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={enrollForm.startDate}
                    onChange={(e) => {
                      setEnrollForm({ ...enrollForm, startDate: e.target.value });
                      if (enrollErrors.startDate) setEnrollErrors({ ...enrollErrors, startDate: '' });
                    }}
                  />
                  {enrollErrors.startDate && <div className="form-error">{enrollErrors.startDate}</div>}
                </div>
              </div>

              {/* Read-Only Plan Summary */}
              {currentPlan && (
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Duration:</span>
                    <strong style={{ fontSize: '0.85rem' }}>{currentPlan.duration} (Non-modifiable)</strong>
                  </div>
                  <div className="flex-between mt-1">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Fixed Plan Fee:</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                      ₹{currentPlan.fee.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={enrollForm.paymentMethod}
                  onChange={(e) => setEnrollForm({ ...enrollForm, paymentMethod: e.target.value })}
                >
                  <option value="Cash">Cash (Front Desk)</option>
                  <option value="Card">Debit / Credit Card (POS)</option>
                  <option value="UPI">UPI / QR Code</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary">
                  Confirm Subscription Renewal
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEnrollModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionistMemberships;
