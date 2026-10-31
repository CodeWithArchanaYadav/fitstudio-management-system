import React from 'react';
import { Link } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * MemberWorkouts Page
 * Dedicated view of the member's assigned workout plans and exercise routines.
 * Reads directly from the shared FitStudio data layer.
 * Displays only the workouts assigned by the personal trainer to this specific member.
 * Accessible at /member/workouts under DashboardLayout.
 */
function MemberWorkouts() {
  const {
    activeMember,
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
              Active Member View:
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
            My Assigned Workout Regimen
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Structured exercise splits, sets, repetitions, and form notes prescribed by your certified trainer
          </p>
        </div>
      </div>

      {memberWorkout ? (
        <div>
          {/* Workout Overview Header Card */}
          <div className="card mb-3">
            <div className="card-header">
              <div>
                <h2 className="card-title">{memberWorkout.planName}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
                  Prescribed by Coach:{' '}
                  <strong style={{ color: 'var(--color-primary)' }}>
                    {memberTrainer ? memberTrainer.name : 'Assigned Trainer'}
                  </strong>
                  {memberTrainer?.specialization && ` (${memberTrainer.specialization})`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-green">Active Prescribed Regimen</span>
                <span className="badge badge-blue">{memberWorkout.difficulty}</span>
              </div>
            </div>

            <div className="grid-3 mb-2">
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Target Goal</span>
                <strong style={{ fontSize: '0.95rem' }}>{memberWorkout.goal}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Weekly Frequency</span>
                <strong style={{ fontSize: '0.95rem' }}>{memberWorkout.schedule}</strong>
              </div>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Focus Zone</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                  {memberWorkout.targetMuscle}
                </strong>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Last updated by Coach: <strong>{memberWorkout.updatedDate || memberWorkout.assignedDate}</strong>
            </div>
          </div>

          {/* Prescribed Exercises Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Prescribed Exercises & Movement Instructions</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Follow the prescribed volume and form cues during your training sessions
                </p>
              </div>
              <span className="badge badge-green">
                {memberWorkout.exercises ? memberWorkout.exercises.length : 0} Exercises
              </span>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Exercise Name</th>
                    <th>Prescribed Sets</th>
                    <th>Prescribed Reps</th>
                    <th>Weight / Target</th>
                    <th>Coach Form Notes & Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberWorkout.exercises && memberWorkout.exercises.length > 0 ? (
                    memberWorkout.exercises.map((ex, idx) => (
                      <tr key={idx}>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{ex.name}</td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.sets} sets</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{ex.reps}</span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)' }}>
                          {ex.weightOrDifficulty || 'Standard / Bodyweight'}
                        </td>
                        <td style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: '350px' }}>
                          {ex.notes || 'Perform with controlled form and full range of motion.'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No individual exercises listed for this plan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State when Member has no workout assigned */
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏋️</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              No Workout Regimen Currently Assigned
            </h2>
            {memberTrainer ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                You are assigned to Coach <strong>{memberTrainer.name}</strong> ({memberTrainer.specialization}). Your coach has not yet published an active workout routine for your account. Please consult with your coach during your next training session.
              </p>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                You do not currently have a certified personal coach assigned to your membership pass. Please visit the gym reception desk to speak with front desk staff about trainer assignments.
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/member/dashboard" className="btn btn-secondary btn-sm">
                Return to Dashboard
              </Link>
              <Link to="/member/profile" className="btn btn-outline btn-sm">
                View My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberWorkouts;
