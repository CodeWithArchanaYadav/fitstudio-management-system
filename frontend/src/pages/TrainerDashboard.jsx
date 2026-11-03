import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/**
 * TrainerDashboard Page
 * Loads everything from GET /api/trainer/me/dashboard (profile, counts, client roster).
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
    // update the row locally so the table shows the new values immediately
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
      if (res.success) setData(res.data);
      else setError(res.error || 'Could not load the dashboard.');
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading dashboard…</p>;
  if (error) return <div className="card" style={{ padding: '1.5rem', color: 'var(--color-danger, #b91c1c)' }}>{error}</div>;

  const trainer = data.trainer;
  const clients = data.clients || [];

  return (
    <div>
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Coach Overview:
          </span>
          <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
            {trainer.name} (STF-T{String(trainer.id).padStart(2, '0')})
          </strong>
          {trainer.specialization && (
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{trainer.specialization}</span>
          )}
        </div>
      </div>

      <header className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <p>Welcome back, Coach {trainer.name}! Manage your client routines and training sessions.</p>
      </header>

      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-label">Assigned Clients</div>
          <div className="stat-value">{data.assignedClients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workout Routines</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>{data.activeRoutines}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today&apos;s Sessions</div>
          <div className="stat-value">{data.todaySessions}</div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Training Management Actions</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Facility shift: <strong>{trainer.shift || 'General'}</strong>
          {data.clientsWithoutWorkout > 0 && ` · ${data.clientsWithoutWorkout} client(s) still need a workout plan`}
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/trainer/members" className="btn btn-secondary">
            👥 View Assigned Clients ({data.assignedClients})
          </Link>
          <Link to="/trainer/workouts" className="btn btn-primary">
            🏋️ Manage Workout Plans ({data.activeRoutines})
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Client Coaching Roster for {trainer.name}</h2>
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
                          placeholder="e.g. Fat loss, Muscle gain"
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
                          <button type="button" className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveCoaching(c)}>
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button type="button" className="btn btn-secondary btn-sm" disabled={saving} onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                          {formError && (
                            <span style={{ color: 'var(--color-danger, #b91c1c)', fontSize: '0.78rem', width: '100%' }}>{formError}</span>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => startEdit(c)}>
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
                    No members are currently assigned to Coach {trainer.name}. When the admin assigns members, they will appear here.
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