import React from 'react';
import { Link } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * TrainerDashboard Page
 * Overview dashboard for certified fitness trainers.
 * Connected directly to the shared FitStudio data layer.
 * Renders within the shared DashboardLayout.
 */
function TrainerDashboard() {
  const {
    trainers,
    activeTrainer,
    activeTrainerId,
    setActiveTrainerId,
    assignedMembers,
    trainerWorkouts,
  } = useGymData();

  return (
    <div>
      {/* Prototype Coach Selector Banner */}
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Coach Overview:
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {activeTrainer ? `${activeTrainer.name} (${activeTrainer.id})` : 'Coach'}
            </strong>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              {activeTrainer?.specialization}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="switch-coach-dash" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Switch Coach Preview:
            </label>
            <select
              id="switch-coach-dash"
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              value={activeTrainerId}
              onChange={(e) => setActiveTrainerId(e.target.value)}
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <header className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <p>Welcome back, Coach {activeTrainer?.name}! Manage your client routines and training sessions.</p>
      </header>

      {/* Trainer Metrics from Shared Store */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-label">Assigned Clients</div>
          <div className="stat-value">{assignedMembers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workout Routines</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {trainerWorkouts.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Facility Shift</div>
          <div className="stat-value" style={{ fontSize: '1.25rem', paddingTop: '0.35rem' }}>
            {activeTrainer?.shift || 'General'}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Training Management Actions</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Select an operational module to review assigned athletes or design workout splits:
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/trainer/members" className="btn btn-secondary">
            👥 View Assigned Clients ({assignedMembers.length})
          </Link>
          <Link to="/trainer/workouts" className="btn btn-primary">
            🏋️ Manage Workout Plans ({trainerWorkouts.length})
          </Link>
        </div>
      </div>

      {/* Assigned Clients Summary */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Client Coaching Roster for {activeTrainer?.name}</h2>
          <span className="badge badge-blue">
            {assignedMembers.length} Assigned {assignedMembers.length === 1 ? 'Member' : 'Members'}
          </span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Client Name</th>
                <th>Membership Plan</th>
                <th>Coaching Focus</th>
                <th>Prescribed Regimen</th>
                <th>Target Sessions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedMembers.length > 0 ? (
                assignedMembers.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 600 }}>{client.id}</td>
                    <td style={{ fontWeight: 500 }}>{client.fullName}</td>
                    <td>{client.plan}</td>
                    <td style={{ fontSize: '0.88rem' }}>{client.coachingGoal}</td>
                    <td>
                      <span className={`badge ${client.hasWorkout ? 'badge-green' : 'badge-warning'}`}>
                        {client.assignedRoutine}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{client.sessionsPerWeek} sessions/wk</td>
                    <td>
                      <Link
                        to={`/trainer/workouts?memberId=${client.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        {client.hasWorkout ? 'View Plan' : 'Prescribe'}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No members are currently assigned to Coach {activeTrainer?.name}. When members are assigned at the reception desk, they will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TrainerDashboard;
