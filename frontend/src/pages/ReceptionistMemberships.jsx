import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

/**
 * ReceptionistMemberships Page
 * Front desk membership subscriptions and renewals.
 * Receptionists can VIEW admin-configured plans and ENROLL/RENEW members using backend APIs.
 * Strictly prevents Receptionists from creating, editing, or deleting plan templates.
 * Accessible at /receptionist/memberships under DashboardLayout.
 */
function ReceptionistMemberships() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enrollment / Renewal form state
  const [enrollForm, setEnrollForm] = useState(() => ({
    memberId: '',
    planId: '',
    paymentMethod: 'Cash',
  }));
  const [enrollErrors, setEnrollErrors] = useState({});

  const loadData = useCallback(async () => {
    const [plansRes, membersRes] = await Promise.all([
      api.getPlans(),
      api.getMembers(),
    ]);

    if (plansRes.success) {
      setPlans(plansRes.data.filter((p) => p.status === 'Active'));
    }
    if (membersRes.success && Array.isArray(membersRes.data)) {
      setMembers(membersRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentPlan = plans.find((p) => String(p.id) === String(enrollForm.planId)) || plans[0];

  const handleOpenEnroll = (planId = '', member = null) => {
    setEnrollForm({
      memberId: member ? String(member.id) : (members[0] ? String(members[0].id) : ''),
      planId: planId || (plans[0] ? String(plans[0].id) : ''),
      paymentMethod: 'Cash',
    });
    setEnrollErrors({});
    setShowEnrollModal(true);
    setNotice({ type: '', text: '' });
  };

  const validateEnrollment = () => {
    const errs = {};
    if (!enrollForm.memberId) {
      errs.memberId = 'Please select a member.';
    }
    if (!enrollForm.planId) {
      errs.planId = 'Please select a membership plan.';
    }
    setEnrollErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!validateEnrollment()) return;

    setIsSubmitting(true);
    setNotice({ type: '', text: '' });

    const chosenPlan = plans.find((p) => String(p.id) === String(enrollForm.planId)) || currentPlan;
    const chosenMember = members.find((m) => String(m.id) === String(enrollForm.memberId));

    const res = await api.assignPlan(enrollForm.memberId, enrollForm.planId);
    setIsSubmitting(false);

    if (res.success) {
      setShowEnrollModal(false);
      setNotice({
        type: 'info',
        text: `Plan "${chosenPlan?.name}" assigned successfully to ${chosenMember?.name || chosenMember?.fullName || 'member'}.`,
      });
      loadData();
    } else {
      setNotice({
        type: 'error',
        text: res.error || 'Failed to update membership plan.',
      });
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredMembers = members.filter((m) => {
    const name = (m.name || m.fullName || '').toLowerCase();
    const id = String(m.id);
    const plan = (m.plan || '').toLowerCase();
    return !q || name.includes(q) || id.includes(q) || plan.includes(q);
  });

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
          disabled={members.length === 0 || plans.length === 0}
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
                  borderColor: 'var(--color-border)',
                  marginBottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div className="flex-between">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{plan.name}</h3>
                    <span className="badge badge-green">Active</span>
                  </div>

                  <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                    ₹{Number(plan.fee).toLocaleString('en-IN')}{' '}
                    <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                      / {plan.duration || `${plan.durationDays} Days`}
                    </span>
                  </div>

                  {plan.description && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      {plan.description}
                    </p>
                  )}

                  {plan.facilities && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      <strong>Facilities:</strong> {plan.facilities}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-full btn-sm"
                    onClick={() => handleOpenEnroll(String(plan.id))}
                  >
                    Select Plan & Enroll Member
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            {loading ? 'Loading membership plans…' : 'No active membership plans configured by Admin.'}
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
              placeholder="Search member, ID, or plan..."
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
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Plan Tier</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Renewal Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>MEM-{m.id}</td>
                    <td style={{ fontWeight: 500 }}>{m.name || m.fullName}</td>
                    <td>{m.plan || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{m.startDate || m.joinDate || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{m.endDate || '—'}</td>
                    <td>
                      <span className={`badge ${m.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                        {m.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEnroll('', m)}
                      >
                        Renew / Change Plan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    {loading ? 'Loading member records…' : searchQuery ? `No members match "${searchQuery}".` : 'No registered members found. Register members in the Member Directory first.'}
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
                <label className="form-label">Select Member *</label>
                <select
                  className="form-select"
                  value={enrollForm.memberId}
                  onChange={(e) => {
                    setEnrollForm({ ...enrollForm, memberId: e.target.value });
                    if (enrollErrors.memberId) setEnrollErrors({ ...enrollErrors, memberId: '' });
                  }}
                >
                  <option value="">Select a registered member…</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.fullName} (MEM-{m.id}) {m.plan ? `— Current: ${m.plan}` : ''}
                    </option>
                  ))}
                </select>
                {enrollErrors.memberId && <div className="form-error">{enrollErrors.memberId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Select Admin Plan Tier *</label>
                <select
                  className="form-select"
                  value={enrollForm.planId}
                  onChange={(e) => {
                    setEnrollForm({ ...enrollForm, planId: e.target.value });
                    if (enrollErrors.planId) setEnrollErrors({ ...enrollErrors, planId: '' });
                  }}
                >
                  <option value="">Select a plan tier…</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.fee} ({p.duration || `${p.durationDays} Days`})
                    </option>
                  ))}
                </select>
                {enrollErrors.planId && <div className="form-error">{enrollErrors.planId}</div>}
              </div>

              {/* Read-Only Plan Summary */}
              {currentPlan && (
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Duration:</span>
                    <strong style={{ fontSize: '0.85rem' }}>{currentPlan.duration || `${currentPlan.durationDays} Days`}</strong>
                  </div>
                  <div className="flex-between mt-1">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Fixed Plan Fee:</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                      ₹{Number(currentPlan.fee).toLocaleString('en-IN')}
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
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Confirm Subscription Plan'}
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
