import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/** Helper to format date strings */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * MemberMembership Page
 * Detailed view of the member's current subscription, plan privileges, and validity dates.
 * Connected to live backend Member Portal endpoint (/api/me/membership).
 * Accessible at /member/membership under DashboardLayout.
 */
function MemberMembership() {
  const [membership, setMembership] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadMembership = async () => {
      const [memRes, trnRes] = await Promise.all([
        api.getMyMembership(),
        api.getMyTrainer(),
      ]);

      if (cancelled) return;

      if (memRes.success) {
        setMembership(memRes.data);
      } else if (memRes.status === 0) {
        setErrorNotice('Cannot connect to backend server. Make sure Spring Boot is running on port 6967.');
      }

      if (trnRes.success) {
        setTrainer(trnRes.data);
      }

      setLoading(false);
    };

    loadMembership();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            My Membership Plan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Inspect your active gym pass details, validity period, and assigned coach
          </p>
        </div>
      </div>

      {errorNotice && (
        <div className="notice-box notice-warning mb-3">
          {errorNotice}
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
          <Link to="/member/membership" className="btn btn-primary btn-sm">
            My Membership
          </Link>
          <Link to="/member/payments" className="btn btn-secondary btn-sm">
            My Payments
          </Link>
        </div>
      </div>

      {membership ? (
        <div>
          {/* Main Membership Plan Card */}
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
                    {membership.plan || 'Standard Membership'}
                  </h2>
                  <span className={`badge ${membership.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                    {membership.status || 'Active'}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  Account Name: <strong>{membership.name}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {membership.daysRemaining !== undefined ? `${membership.daysRemaining} Days` : '—'}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Remaining Validity
                </span>
              </div>
            </div>

            {/* Validity Metrics Grid */}
            <div className="grid-3 mb-2">
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Start Date</span>
                <strong style={{ fontSize: '0.95rem' }}>
                  {formatDate(membership.startDate || membership.joinDate)}
                </strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Expiry Date</span>
                <strong style={{ fontSize: '0.95rem' }}>
                  {formatDate(membership.endDate)}
                </strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Coach</span>
                <strong style={{ fontSize: '0.95rem', color: trainer ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {trainer ? trainer.name : 'Unassigned'}
                </strong>
              </div>
            </div>
          </div>

          {/* Membership Guidelines */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Membership Guidelines & Access Rules</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              <li>• Gym passes are strictly non-transferable and tied to your verified account.</li>
              <li>• Subscription renewals may be processed at the front desk before the expiration date.</li>
              <li>• Check-in timestamps are verified at reception upon facility entry.</li>
              <li>• Facility operating hours and etiquette must be observed across all workout zones.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            {loading ? 'Loading membership details…' : 'No active membership subscription linked to your account.'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            To activate or renew your membership pass, speak with the front desk staff at FitStudio.
          </p>
          <Link to="/member/dashboard" className="btn btn-secondary btn-sm">
            ← Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default MemberMembership;
