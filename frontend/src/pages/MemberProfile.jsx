import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, session } from '../services/api';

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

/** Helper to extract 1-2 capital initials */
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'MB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * MemberProfile Page
 * Primary profile route (/member/profile) consolidating personal, membership, and coach information.
 * Connected to live backend APIs.
 * Accessible under DashboardLayout.
 */
function MemberProfile() {
  const [membership, setMembership] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const user = session.getUser();

  useEffect(() => {
    let cancelled = false;

    const loadProfileData = async () => {
      const [memRes, trnRes, wrkRes] = await Promise.all([
        api.getMyMembership(),
        api.getMyTrainer(),
        api.getMyWorkouts(),
      ]);

      if (cancelled) return;

      if (memRes.success) {
        setMembership(memRes.data);
      } else if (memRes.status === 0) {
        setNotice({ type: 'error', text: 'Cannot connect to backend service. Please ensure the server is active.' });
      }
      if (trnRes.success) {
        setTrainer(trnRes.data);
      }
      if (wrkRes.success && Array.isArray(wrkRes.data)) {
        setWorkouts(wrkRes.data);
      }

      setLoading(false);
    };

    loadProfileData();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = membership?.name || user?.name || 'Gym Member';
  const displayEmail = user?.email || '—';
  const initials = getInitials(displayName);
  const activeWorkout = workouts.length > 0 ? workouts[0] : null;

  if (loading) {
    return (
      <div>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              My Member Profile
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Consolidated record of your authenticated account, active membership, and coach assignment
            </p>
          </div>
        </div>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading member profile…
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            My Member Profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Consolidated record of your authenticated account, active membership, and coach assignment
          </p>
        </div>
      </div>

      {notice.text && (
        <div className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'} mb-3`}>
          {notice.text}
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

      {/* Personal Account Information Section */}
      <div className="card mb-3">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2 className="card-title" style={{ marginBottom: '0.2rem' }}>
                {displayName}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`badge ${membership?.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                  {membership?.status || 'Active Account'}
                </span>
                <span className="badge badge-blue">Role: {user?.role || 'MEMBER'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
              <span style={{ fontWeight: 600 }}>{displayEmail}</span>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Membership Tier</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{membership?.plan || 'None Assigned'}</span>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Personal Coach</span>
              <span style={{ fontWeight: 600, color: trainer ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {trainer ? `${trainer.name} (${trainer.email || 'Coach'})` : 'Unassigned (No coach assigned)'}
              </span>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Days Remaining</span>
              <span style={{ fontWeight: 600 }}>{membership?.daysRemaining !== undefined ? `${membership.daysRemaining} Days` : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Information Section */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Membership Plan Details</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Active pass validity dates and tier privileges
            </p>
          </div>
          <Link to="/member/membership" className="btn btn-secondary btn-sm">
            View Full Membership Info →
          </Link>
        </div>

        <div className="grid-4 mb-2">
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Plan Tier</div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{membership?.plan || 'None'}</div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Start Date</div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
              {formatDate(membership?.startDate || membership?.joinDate)}
            </div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Valid Until</div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
              {formatDate(membership?.endDate)}
            </div>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <div className="stat-label">Current Status</div>
            <div style={{ paddingTop: '0.2rem' }}>
              <span className={`badge ${membership?.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                {membership?.status || 'No Plan'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workout & Fitness Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Prescribed Workout Regimen</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Customized training regimen prescribed by your assigned coach
            </p>
          </div>
          <Link to="/member/workouts" className="btn btn-secondary btn-sm">
            View All Workouts →
          </Link>
        </div>

        {activeWorkout ? (
          <div>
            <div className="grid-3 mb-2" style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Routine Title</span>
                <strong style={{ fontSize: '0.95rem' }}>{activeWorkout.title}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Coach</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {trainer ? trainer.name : 'Personal Trainer'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Target Muscle</span>
                <span>{activeWorkout.targetMuscle || 'Full Body'}</span>
              </div>
            </div>

            {activeWorkout.exercises && activeWorkout.exercises.length > 0 && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exercise Name</th>
                      <th>Target Sets</th>
                      <th>Target Reps</th>
                      <th>Resistance / Difficulty</th>
                      <th>Form Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeWorkout.exercises.map((ex, idx) => (
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
            )}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
              No workout plan currently assigned.
            </p>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              {trainer
                ? `Your coach (${trainer.name}) will prescribe your customized split during your training consultation.`
                : 'Visit the front desk to be assigned a certified personal coach.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberProfile;
