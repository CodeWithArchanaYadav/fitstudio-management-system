import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/**
 * TrainerDashboard Page
 * Central overview for certified gym trainers.
 * Loads live data from GET /api/trainer/me/dashboard (profile, counts, client roster).
 * Renders within the shared DashboardLayout.
 */
function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inline editing of Coaching Focus / Target Sessions
  const [editingId, setEditingId] = useState(null);
  const [goalInput, setGoalInput] = useState('');
  const [sessionsInput, setSessionsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const startEdit = (c) => {
    setEditingId(c.id);
    setGoalInput(c.coachingGoal || '');
    setSessionsInput(c.sessionsPerWeek ? String(c.sessionsPerWeek) : '');
    setFormError('');
  };

  const saveCoaching = async (c) => {
    const n = sessionsInput === '' ? null : Number(sessionsInput);
    if (n !== null && (!Number.isInteger(n) || n < 1 || n > 7)) {
      setFormError('Sessions per week must be between 1 and 7.');
      return;
    }
    setSaving(true);
    setFormError('');
    const res = await api.updateCoaching(c.id, { coachingGoal: goalInput.trim(), sessionsPerWeek: n });
    setSaving(false);
    if (!res.success) {
      setFormError(res.error || 'Could not save coaching details.');
      return;
    }
    // Update the row locally so the table shows the new values immediately
    setData((d) => ({
      ...d,
      clients: d.clients.map((x) =>
        x.id === c.id ? { ...x, coachingGoal: goalInput.trim() || null, sessionsPerWeek: n } : x
      ),
    }));
    setEditingId(null);
  };

  useEffect(() => {
    let alive = true;
    api.getTrainerDashboard().then((res) => {
      if (!alive) return;
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || 'Unable to load trainer dashboard. Please verify backend service.');
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <header className="dashboard-header">
          <h1>Trainer Dashboard</h1>
          <p>Manage assigned client regimens, workout routines, and training sessions</p>
        </header>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading trainer dashboard data…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <header className="dashboard-header">
          <h1>Trainer Dashboard</h1>
          <p>Manage assigned client regimens, workout routines, and training sessions</p>
        </header>
        <div className="notice-box notice-error mb-3">
          {error || 'Trainer dashboard information is currently unavailable.'}
        </div>
      </div>
    );
  }

  const trainer = data.trainer || {};
  const clients = data.clients || [];

  return (
    <div>
      <header className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <p>Manage assigned client regimens, workout routines, and training sessions</p>
      </header>

      {/* Trainer Profile Overview Card */}
      <div className="card mb-3" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Coach Profile:
            </span>
            <strong style={{ fontSize: '0.98rem', color: 'var(--color-primary)' }}>
              {trainer.name}
            </strong>
            {trainer.specialization && (
              <span className="badge badge-blue">
                {trainer.specialization}
              </span>
            )}
            <span className="badge badge-green">
              {trainer.status || 'Active'}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Facility Shift: <strong>{trainer.shift || 'General'}</strong>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-label">Assigned Clients</div>
          <div className="stat-value">{data.assignedClients ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workout Routines</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {data.activeRoutines ?? 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today's Sessions</div>
          <div className="stat-value">{data.todaySessions ?? 0}</div>
        </div>
      </div>

      {/* Training Management Quick Actions */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Training Management Actions</h2>
          {data.clientsWithoutWorkout > 0 && (
            <span className="badge badge-warning">
              {data.clientsWithoutWorkout} {data.clientsWithoutWorkout === 1 ? 'Client needs a plan' : 'Clients need plans'}
            </span>
          )}
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Quick shortcuts to client session schedules and prescribed exercise regimens:
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/trainer/members" className="btn btn-secondary">
            View Assigned Clients ({data.assignedClients ?? 0})
          </Link>
          <Link to="/trainer/workouts" className="btn btn-primary">
            Manage Workout Plans ({data.activeRoutines ?? 0})
          </Link>
        </div>
      </div>

      {/* Client Coaching Roster */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Client Coaching Roster</h2>
          <span className="badge badge-blue">
            {clients.length} Assigned {clients.length === 1 ? 'Member' : 'Members'}
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
              {clients.length > 0 ? (
                clients.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>MEM-{c.id}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td>{c.plan || '—'}</td>
                    <td style={{ fontSize: '0.88rem' }}>
                      {editingId === c.id ? (
                        <input
                          type="text"
                          className="form-input"
                          maxLength={255}
                          placeholder="e.g. Strength, Hypertrophy"
                          value={goalInput}
                          onChange={(e) => setGoalInput(e.target.value)}
                        />
                      ) : (
                        c.coachingGoal || 'Not set'
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.hasWorkout ? 'badge-green' : 'badge-warning'}`}>
                        {c.assignedRoutine}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {editingId === c.id ? (
                        <input
                          type="number"
                          className="form-input"
                          min={1}
                          max={7}
                          style={{ width: '80px' }}
                          placeholder="1-7"
                          value={sessionsInput}
                          onChange={(e) => setSessionsInput(e.target.value)}
                        />
                      ) : c.sessionsPerWeek ? (
                        `${c.sessionsPerWeek} sessions/wk`
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {editingId === c.id ? (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={saving}
                            onClick={() => saveCoaching(c)}
                          >
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={saving}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                          {formError && (
                            <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem', width: '100%' }}>
                              {formError}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(c)}
                          >
                            Set Goal
                          </button>
                          <Link to={`/trainer/workouts?memberId=${c.id}`} className="btn btn-secondary btn-sm">
                            {c.hasWorkout ? 'View Plan' : 'Prescribe'}
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No members are currently assigned to your coaching roster. When gym administration assigns members, they will appear here.
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
