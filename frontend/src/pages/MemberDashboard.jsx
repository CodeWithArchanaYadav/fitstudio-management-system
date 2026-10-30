import React from 'react';
import { Link } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * MemberDashboard Page
 * Overview dashboard for gym members.
 * Connected to the shared FitStudio data layer.
 * Displays member's real assigned trainer and prescribed workout plan.
 * Renders within the shared DashboardLayout.
 */
function MemberDashboard() {
  const {
    members,
    activeMember,
    activeMemberId,
    setActiveMemberId,
    memberTrainer,
    memberWorkout,
  } = useGymData();

  return (
    <div>
      {/* Prototype Member Selector Banner */}
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Member Overview:
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {activeMember ? `${activeMember.fullName} (${activeMember.id})` : 'Member'}
            </strong>
            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
              {activeMember?.plan}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="switch-member-dash" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Switch Member Preview:
            </label>
            <select
              id="switch-member-dash"
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              value={activeMemberId}
              onChange={(e) => setActiveMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <header className="dashboard-header">
        <h1>Member Dashboard</h1>
        <p>Welcome back, {activeMember?.fullName}! Here is your FitStudio membership overview.</p>
      </header>

      {/* Member Stat Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Membership Status</div>
          <div
            className="stat-value"
            style={{ color: activeMember?.status === 'Active' ? 'var(--color-primary)' : 'var(--color-danger)' }}
          >
            {activeMember?.status || 'Active'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Assigned Plan</div>
          <div className="stat-value" style={{ fontSize: '1.25rem', paddingTop: '0.35rem' }}>
            {activeMember?.plan ? activeMember.plan.split(' ')[0] + ' Tier' : 'Standard'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Assigned Personal Trainer</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', paddingTop: '0.35rem', color: memberTrainer ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
            {memberTrainer ? memberTrainer.name : 'Unassigned'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Prescribed Routine</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', paddingTop: '0.35rem', color: memberWorkout ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
            {memberWorkout ? 'Active Plan' : 'None'}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Member Quick Navigation</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Access your personal fitness records, membership details, and payment invoices:
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/member/profile" className="btn btn-secondary">
            👤 My Complete Profile
          </Link>
          <Link to="/member/workouts" className="btn btn-primary">
            🏋️ My Assigned Workouts {memberWorkout && '✓'}
          </Link>
          <Link to="/member/membership" className="btn btn-secondary">
            📋 My Membership Plan
          </Link>
          <Link to="/member/payments" className="btn btn-secondary">
            💳 My Invoices & Receipts
          </Link>
        </div>
      </div>

      <div className="grid-2">
        {/* Today's Workout Routine Preview from Shared Store */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Assigned Workout Routine Preview</h3>
            {memberWorkout ? (
              <span className="badge badge-green">Prescribed</span>
            ) : (
              <span className="badge badge-gray">Not Assigned</span>
            )}
          </div>

          {memberWorkout ? (
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.35rem', color: 'var(--color-text)' }}>
                {memberWorkout.planName}
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                Prescribed by Coach {memberTrainer?.name || 'Personal Coach'} • {memberWorkout.exercises?.length || 0} Exercises
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.88rem', lineHeight: 1.8 }}>
                {memberWorkout.exercises?.slice(0, 4).map((ex, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', padding: '0.25rem 0' }}>
                    <span>• {ex.name}</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{ex.sets} sets × {ex.reps}</strong>
                  </li>
                ))}
              </ul>
              {memberWorkout.exercises?.length > 4 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  + {memberWorkout.exercises.length - 4} more exercises in full regimen
                </p>
              )}
              <div style={{ marginTop: '1.25rem' }}>
                <Link to="/member/workouts" className="btn btn-primary btn-sm">
                  View Full Workout Details →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.75rem 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                {memberTrainer
                  ? `Coach ${memberTrainer.name} has not yet assigned an active workout plan to your profile.`
                  : 'You do not have a personal trainer assigned yet. Speak with the front desk to arrange coaching.'}
              </p>
              <Link to="/member/workouts" className="btn btn-secondary btn-sm">
                Check My Workouts Page
              </Link>
            </div>
          )}
        </div>

        {/* Membership Validity Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Membership Overview</h3>
            <span className={`badge ${activeMember?.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
              {activeMember?.plan || 'Membership'}
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Plan Tier:</span>
              <strong style={{ fontSize: '0.9rem' }}>{activeMember?.plan}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Joined Date:</span>
              <strong style={{ fontSize: '0.9rem' }}>{activeMember?.joinedDate || '15 Aug 2026'}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Valid Until:</span>
              <strong style={{ fontSize: '0.9rem' }}>{activeMember?.expiryDate || '31 Oct 2026'}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.4rem 0' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Personal Coach:</span>
              <strong style={{ fontSize: '0.9rem', color: memberTrainer ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {memberTrainer ? memberTrainer.name : 'None Assigned'}
              </strong>
            </div>
          </div>
          <Link to="/member/membership" className="btn btn-secondary btn-sm">
            View Membership Benefits →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
