import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * MemberProfile Page
 * Primary profile route (/member/profile) consolidating personal, membership, workout, and payment information.
 * Supports updating permitted personal contact fields while strictly preserving privileged role permissions.
 * Connected to the shared FitStudio data layer.
 * Accessible under DashboardLayout.
 */
function MemberProfile() {
  const {
    activeMember,
    memberTrainer,
    memberWorkout,
    updateMember,
  } = useGymData();

  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  // Edit form state
  const [editForm, setEditForm] = useState({
    phone: activeMember?.phone || '',
    emergencyContact: activeMember?.emergencyContact || '',
    address: activeMember?.address || '',
  });
  const [editErrors, setEditErrors] = useState({});

  const validateEditForm = () => {
    const errs = {};
    const phoneDigits = editForm.phone.replace(/\D/g, '');
    if (!editForm.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    updateMember(activeMember.id, {
      phone: editForm.phone.trim(),
      emergencyContact: editForm.emergencyContact.trim(),
      address: editForm.address.trim(),
    });

    setIsEditing(false);
    setNotice({
      type: 'info',
      text: 'Profile contact details updated. (Frontend preview mode).',
    });
  };

  // Membership details
  const membershipInfo = {
    planName: activeMember?.plan || 'Standard Pro Plan',
    duration: '30 Days',
    fee: activeMember?.planFee || 3000,
    startDate: activeMember?.joinedDate || '01 Oct 2026',
    expiryDate: activeMember?.expiryDate || '31 Oct 2026',
    status: activeMember?.status || 'Active',
    benefits: [
      'Full Facility 24/7 Access',
      'Group Fitness Classes',
      'Locker & Sauna Access',
      'Cardio & Functional Turf Studio Access',
    ],
  };

  // Payment records (development preview data)
  const paymentRecords = [
    {
      invoiceId: 'INV-2026-1042',
      date: '01 Oct 2026',
      description: `${membershipInfo.planName} (30 Days Renewal)`,
      amount: membershipInfo.fee,
      method: 'UPI',
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-0914',
      date: '01 Sep 2026',
      description: `${membershipInfo.planName} (30 Days Renewal)`,
      amount: membershipInfo.fee,
      method: 'UPI',
      status: 'Paid',
    },
  ];

  const initials = activeMember?.fullName
    ? activeMember.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'MB';

  return (
    <div>
      {/* Prototype Member Selector Banner */}
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Member Profile:
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {activeMember ? `${activeMember.fullName} (${activeMember.id})` : 'Member'}
            </strong>
            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
              {activeMember?.plan}
            </span>
          </div>


        </div>
      </div>

      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            My Member Profile & Fitness Overview
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Consolidated record of your personal details, active membership, workout regimen, and invoices
          </p>
        </div>
      </div>

      {notice.text && (
        <div className="notice-box mb-3">
          {notice.text}
        </div>
      )}

      {/* Member Navigation Tabs / Links */}
      <div className="card mb-3" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.5rem' }}>
            Member Pages:
          </span>
          <Link to="/member/dashboard" className="btn btn-secondary btn-sm">
            Dashboard
          </Link>
          <Link to="/member/profile" className="btn btn-primary btn-sm">
            My Profile
          </Link>
          <Link to="/member/workouts" className="btn btn-secondary btn-sm">
            My Workouts
          </Link>
          <Link to="/member/membership" className="btn btn-secondary btn-sm">
            My Membership
          </Link>
          <Link to="/member/payments" className="btn btn-secondary btn-sm">
            My Payments
          </Link>
        </div>
      </div>

      {/* A. Personal Information Section */}
      <div className="card mb-3">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2 className="card-title" style={{ marginBottom: '0.2rem' }}>
                {activeMember?.fullName}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`badge ${activeMember?.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                  {activeMember?.status || 'Active'}
                </span>
                <span className="badge badge-blue">Member ID: {activeMember?.id}</span>
              </div>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditForm({
                    phone: activeMember?.phone || '',
                    emergencyContact: activeMember?.emergencyContact || '',
                    address: activeMember?.address || '',
                  });
                  setIsEditing(true);
                  setNotice({ type: '', text: '' });
                }}
              >
                ✏️ Edit Contact Info
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="grid-2">
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 600 }}>{activeMember?.email}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginLeft: '0.5rem' }}>(Verified Login)</span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Phone Number</span>
                <span style={{ fontWeight: 600 }}>{activeMember?.phone}</span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Emergency Contact</span>
                <span style={{ fontWeight: 500 }}>{activeMember?.emergencyContact || 'None provided'}</span>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Personal Coach</span>
                <span style={{ fontWeight: 600, color: memberTrainer ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {memberTrainer ? `${memberTrainer.name} (${memberTrainer.specialization})` : 'Unassigned (No coach assigned)'}
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Current Membership Tier</span>
                <span style={{ fontWeight: 600 }}>{membershipInfo.planName}</span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Residential Address</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{activeMember?.address || 'None provided'}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} noValidate>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Members may update their contact phone number, emergency contact, and residential address. Account roles and membership tiers are managed by gym staff.
            </p>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editForm.phone}
                  onChange={(e) => {
                    setEditForm({ ...editForm, phone: e.target.value });
                    if (editErrors.phone) setEditErrors({ ...editErrors, phone: '' });
                  }}
                />
                {editErrors.phone && <div className="form-error">{editErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Name & Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-input"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Contact Updates
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* B. Membership Information Section */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Current Membership Plan Details</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Active pass validity, privileges, and renewal terms
            </p>
          </div>
          <Link to="/member/membership" className="btn btn-secondary btn-sm">
            View Full Membership Info →
          </Link>
        </div>

        <div className="grid-4 mb-2">
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Plan Tier</div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{membershipInfo.planName}</div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Validity Dates</div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
              {membershipInfo.startDate} to {membershipInfo.expiryDate}
            </div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Plan Fee (INR)</div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
              ₹{membershipInfo.fee.toLocaleString('en-IN')}{' '}
              <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ mo</span>
            </div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Current Status</div>
            <div style={{ paddingTop: '0.2rem' }}>
              <span className={`badge ${membershipInfo.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                {membershipInfo.status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.5rem' }}>Included Privileges:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.4rem', fontSize: '0.88rem' }}>
            {membershipInfo.benefits.map((b, i) => (
              <li key={i} style={{ color: 'var(--color-text)' }}>✓ {b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* C. Workout & Fitness Information Section (Connected to shared store) */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Assigned Workout Plan & Exercises</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Customized training regimen prescribed by your assigned coach
            </p>
          </div>
          <Link to="/member/workouts" className="btn btn-secondary btn-sm">
            View All Workouts →
          </Link>
        </div>

        {memberWorkout ? (
          <div>
            <div className="grid-3 mb-2" style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Routine Title</span>
                <strong style={{ fontSize: '0.95rem' }}>{memberWorkout.planName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Coach</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {memberTrainer ? memberTrainer.name : 'Assigned Trainer'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Schedule</span>
                <span>{memberWorkout.schedule}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '1rem 0 0.5rem 0' }}>
              Prescribed Exercise Split
            </h4>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Exercise Name</th>
                    <th>Target Sets</th>
                    <th>Target Reps</th>
                    <th>Weight / Resistance</th>
                    <th>Form Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {memberWorkout.exercises?.map((ex, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{ex.name}</td>
                      <td><span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.sets} sets</span></td>
                      <td><span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.reps}</span></td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{ex.weightOrDifficulty || 'Standard'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{ex.notes || 'Strict technique'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              No workout plan currently assigned.
            </p>
            <p style={{ fontSize: '0.88rem', margin: 0 }}>
              {memberTrainer
                ? `Your coach (${memberTrainer.name}) will design your customized split during your training consultation.`
                : 'Visit the front desk to be assigned a certified personal coach.'}
            </p>
          </div>
        )}
      </div>

      {/* D. Payment Information Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Payment History & Membership Invoices</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Your personal billing transactions in Indian Rupees (₹). Outstanding Dues: <strong>₹0</strong>
            </p>
          </div>
          <Link to="/member/payments" className="btn btn-secondary btn-sm">
            View All Receipts →
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Payment Date</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecords.map((pay) => (
                <tr key={pay.invoiceId}>
                  <td style={{ fontWeight: 600 }}>{pay.invoiceId}</td>
                  <td>{pay.date}</td>
                  <td>{pay.description}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </td>
                  <td>{pay.method}</td>
                  <td><span className="badge badge-green">{pay.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberProfile;
