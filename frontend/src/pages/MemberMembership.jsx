import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MemberMembership Page
 * Detailed view of the member's current subscription, plan privileges, validity dates, and renewal instructions.
 * Accessible at /member/membership under DashboardLayout.
 */
function MemberMembership() {
  const membership = {
    planName: 'Standard Pro Plan',
    tierBadge: 'Popular',
    fee: 3000,
    duration: '30 Days',
    startDate: '01 Oct 2026',
    expiryDate: '31 Oct 2026',
    daysRemaining: 24,
    status: 'Active',
    facilities: [
      'Full Gym Floor 24/7 Access (Cardio & Free Weights)',
      'Unlimited Group Fitness Classes & Aerobics',
      'Locker Rooms, Digital Lockers & Steam Suite',
      'Indoor Functional Turf Agility Track',
    ],
    terms: [
      'Passes are strictly non-transferable to other individuals.',
      'Renewals may be processed online or at the front desk before the expiration date.',
      'Facility operating hours must be respected as posted at the entrance.',
    ],
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            My Membership Plan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Inspect your active gym pass details, validity period, and included facility benefits
          </p>
        </div>
      </div>

      {/* Main Membership Plan Card */}
      <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 className="card-title" style={{ fontSize: '1.35rem' }}>{membership.planName}</h2>
              <span className="badge badge-green">{membership.status}</span>
              <span className="badge badge-blue">{membership.tierBadge}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Subscription ID: <strong>SUB-2026-081</strong>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹{membership.fee.toLocaleString('en-IN')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                / {membership.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="grid-3 mb-2">
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Start Date</span>
            <strong style={{ fontSize: '1rem' }}>{membership.startDate}</strong>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Expiry Date</span>
            <strong style={{ fontSize: '1rem' }}>{membership.expiryDate}</strong>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Remaining Validity</span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{membership.daysRemaining} Days Left</strong>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Included Access & Privileges
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
            {membership.facilities.map((fac, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span>
                <span>{fac}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-2">
        {/* Renewal & Upgrade Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Membership Renewal Information</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Your pass renews on <strong>{membership.expiryDate}</strong>. You can renew your pass or upgrade to the <strong>Premium Elite Plan</strong> (with assigned personal coaching) by visiting the front reception desk.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/member/payments" className="btn btn-secondary btn-sm">
              View Payment Receipts
            </Link>
          </div>
        </div>

        {/* Facility Guidelines */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Membership Terms & Facility Guidelines</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            {membership.terms.map((term, i) => (
              <li key={i}>• {term}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MemberMembership;
