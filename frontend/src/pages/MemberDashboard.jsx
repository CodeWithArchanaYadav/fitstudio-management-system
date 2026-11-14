import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/** Format a date string (YYYY-MM-DD) into standard readable date */
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
 * MemberDashboard Page
 * Personalized overview for authenticated gym members.
 * Reads live data directly from the backend Member Portal endpoints:
 * - /api/me/membership
 * - /api/me/trainer
 * - /api/me/workouts
 * Renders within the shared DashboardLayout.
 */
function MemberDashboard() {
  const [membership, setMembership] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadMemberData = async () => {
      const [memRes, trnRes, wrkRes] = await Promise.all([
        api.getMyMembership(),
        api.getMyTrainer(),
        api.getMyWorkouts(),
      ]);

      if (cancelled) return;

      if (memRes.success) {
        setMembership(memRes.data);
      } else if (memRes.status === 404) {
        // Member profile not yet linked to this user account
        setMembership(null);
      } else if (memRes.status === 0) {
        setErrorNotice('Cannot reach backend service. Please ensure the server is active.');
      }

      if (trnRes.success) {
        setTrainer(trnRes.data);
      } else {
        setTrainer(null);
      }

      if (wrkRes.success && Array.isArray(wrkRes.data)) {
        setWorkouts(wrkRes.data);
      } else {
        setWorkouts([]);
      }

      setLoading(false);
    };

    loadMemberData();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeWorkout = workouts.length > 0 ? workouts[0] : null;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Member Dashboard</h1>
        <p>Membership status, assigned coach, and prescribed training regimen</p>
      </header>

      {errorNotice && (
        <div className="notice-box notice-warning mb-3">
          {errorNotice}
        </div>
      )}

      {/* Member Stat Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Membership Status</div>
          <div
            className="stat-value"
            style={{
              fontSize: '1.4rem',
              paddingTop: '0.2rem',
              color: membership?.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {loading ? '—' : membership?.status || 'No Active Plan'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Assigned Plan</div>
          <div className="stat-value" style={{ fontSize: '1.35rem', paddingTop: '0.2rem' }}>
            {loading ? '—' : membership?.plan || 'None'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Personal Trainer</div>
          <div className="stat-value" style={{ fontSize: '1.25rem', paddingTop: '0.2rem', color: trainer ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
            {loading ? '—' : trainer ? trainer.name : 'Unassigned'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Days Remaining</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {loading ? '—' : membership?.daysRemaining !== undefined ? `${membership.daysRemaining} Days` : '—'}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Member Navigation</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Direct access to personal fitness records, membership details, and payment history:
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/member/profile" className="btn btn-secondary">
            My Complete Profile
          </Link>
          <Link to="/member/workouts" className="btn btn-primary">
            My Assigned Workouts {activeWorkout && '✓'}
          </Link>
          <Link to="/member/membership" className="btn btn-secondary">
            My Membership Plan
          </Link>
          <Link to="/member/payments" className="btn btn-secondary">
            Payment History
          </Link>
        </div>
      </div>

      <div className="grid-2">
        {/* Assigned Workout Routine Preview */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Assigned Workout Routine Preview</h3>
            {activeWorkout ? (
              <span className="badge badge-green">Prescribed</span>
            ) : (
              <span className="badge badge-gray">Not Assigned</span>
            )}
          </div>

          {activeWorkout ? (
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem', color: 'var(--color-text)' }}>
                {activeWorkout.title || activeWorkout.planName}
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
                {activeWorkout.targetMuscle && `Target: ${activeWorkout.targetMuscle} • `}
                {activeWorkout.difficulty && `Difficulty: ${activeWorkout.difficulty} • `}
                {activeWorkout.exercises?.length || 0} Exercises
              </p>

              {activeWorkout.exercises && activeWorkout.exercises.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.88rem', lineHeight: 1.8 }}>
                  {activeWorkout.exercises.slice(0, 4).map((ex, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--color-border)',
                        padding: '0.3rem 0',
                      }}
                    >
                      <span>• {ex.name}</span>
                      <strong style={{ color: 'var(--color-primary)' }}>
                        {ex.sets} sets × {ex.reps}
                      </strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                  No specific exercise sets configured for this routine.
                </p>
              )}

              {activeWorkout.exercises && activeWorkout.exercises.length > 4 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  + {activeWorkout.exercises.length - 4} more exercises in full regimen
                </p>
              )}

              <div style={{ marginTop: '1.25rem' }}>
                <Link to="/member/workouts" className="btn btn-primary btn-sm">
                  View Full Workout Details →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {trainer
                  ? `Coach ${trainer.name} has not yet assigned a workout routine to your profile.`
                  : 'You do not have a personal trainer assigned yet. Speak with the front desk to arrange coaching.'}
              </p>
              <Link to="/member/workouts" className="btn btn-secondary btn-sm">
                Check Workouts Page
              </Link>
            </div>
          )}
        </div>

        {/* Membership Validity Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Active Membership Overview</h3>
            <span className={`badge ${membership?.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
              {membership?.status || 'Inactive'}
            </span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Plan Tier:</span>
              <strong style={{ fontSize: '0.9rem' }}>{membership?.plan || 'None Assigned'}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Start Date:</span>
              <strong style={{ fontSize: '0.9rem' }}>{formatDate(membership?.startDate || membership?.joinDate)}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Valid Until:</span>
              <strong style={{ fontSize: '0.9rem' }}>{formatDate(membership?.endDate)}</strong>
            </div>
            <div className="flex-between" style={{ padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Personal Coach:</span>
              <strong style={{ fontSize: '0.9rem', color: trainer ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {trainer ? trainer.name : 'None Assigned'}
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
