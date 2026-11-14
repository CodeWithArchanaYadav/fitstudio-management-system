import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/**
 * MemberWorkouts Page
 * Dedicated view of the member's assigned workout plans and exercise routines.
 * Reads live data directly from the backend Member Portal endpoint (/api/me/workouts).
 * Accessible at /member/workouts under DashboardLayout.
 */
function MemberWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadWorkouts = async () => {
      const [wrkRes, trnRes] = await Promise.all([
        api.getMyWorkouts(),
        api.getMyTrainer(),
      ]);

      if (cancelled) return;

      if (wrkRes.success && Array.isArray(wrkRes.data)) {
        setWorkouts(wrkRes.data);
      } else if (wrkRes.status === 0) {
        setErrorNotice('Cannot connect to backend service. Please ensure the server is running.');
      }

      if (trnRes.success) {
        setTrainer(trnRes.data);
      }

      setLoading(false);
    };

    loadWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            My Assigned Workout Regimen
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Structured exercise splits, sets, repetitions, and form notes prescribed by your certified trainer
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
          <Link to="/member/workouts" className="btn btn-primary btn-sm">
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

      {workouts.length > 0 ? (
        workouts.map((workout) => (
          <div key={workout.id} className="card mb-3">
            <div className="card-header">
              <div>
                <h2 className="card-title">{workout.title}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
                  Prescribed by Coach:{' '}
                  <strong style={{ color: 'var(--color-primary)' }}>
                    {trainer ? trainer.name : 'Personal Trainer'}
                  </strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-green">Active Regimen</span>
                {workout.difficulty && <span className="badge badge-blue">{workout.difficulty}</span>}
              </div>
            </div>

            <div className="grid-3 mb-2">
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Target Goal</span>
                <strong style={{ fontSize: '0.95rem' }}>{workout.goal || 'General Fitness'}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Weekly Frequency</span>
                <strong style={{ fontSize: '0.95rem' }}>{workout.schedule || 'Scheduled Sessions'}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Focus Zone</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                  {workout.targetMuscle || 'Full Body'}
                </strong>
              </div>
            </div>

            {/* Exercises Table */}
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '1.25rem 0 0.5rem 0' }}>
              Prescribed Exercise Split
            </h3>
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
                  {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((ex, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{ex.name}</td>
                        <td><span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.sets} sets</span></td>
                        <td><span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.reps}</span></td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{ex.weightOrDifficulty || 'Standard'}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{ex.notes || 'Strict form'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No individual exercises configured for this routine.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            {loading ? 'Loading workout routines…' : 'No workout routines currently assigned.'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            {trainer
              ? `Your coach (${trainer.name}) has not prescribed a workout split yet. Check back following your consultation.`
              : 'You do not have a personal coach assigned yet. Speak with the front desk to arrange coaching.'}
          </p>
          <Link to="/member/dashboard" className="btn btn-secondary btn-sm">
            ← Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default MemberWorkouts;
