import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/**
 * TrainerMembers Page
 * Shows the members assigned to the logged-in trainer (from the database) and lets the
 * trainer schedule, complete, cancel and delete training sessions (saved in training_sessions).
 * Accessible at /trainer/members under DashboardLayout.
 */
const OFFLINE = 'Cannot reach the backend. Make sure the Spring Boot server is running on port 6967.';
const formatTime = (t) => (t ? String(t).replace('T', ' ').slice(0, 16) : '');

function TrainerMembers() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [selectedClient, setSelectedClient] = useState(null);
  const [form, setForm] = useState({ sessionTime: '', focus: '' });
  const [isSaving, setIsSaving] = useState(false);

  const loadAll = useCallback(async () => {
    const [clientRes, sessionRes] = await Promise.all([api.getMyClients(), api.getSessions()]);
    if (clientRes.success) setClients(clientRes.data);
    if (sessionRes.success) setSessions(sessionRes.data);
    const failed = !clientRes.success ? clientRes : !sessionRes.success ? sessionRes : null;
    if (failed) {
      setNotice({
        type: 'error',
        text: failed.status === 0 ? OFFLINE : failed.error || 'Could not load data. Log in as a trainer.',
      });
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const memberName = (id) => clients.find((c) => c.id === id)?.name || `Member #${id}`;

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!form.sessionTime) {
      setNotice({ type: 'error', text: 'Please choose the session date and time.' });
      return;
    }
    setIsSaving(true);
    const res = await api.createSession({
      memberId: selectedClient.id,
      sessionTime: `${form.sessionTime}:00`,
      focus: form.focus.trim(),
      status: 'Scheduled',
    });
    setIsSaving(false);
    if (res.success) {
      setNotice({ type: 'success', text: `Session scheduled for ${selectedClient.name} on ${formatTime(res.data.sessionTime)}.` });
      setForm({ sessionTime: '', focus: '' });
      setSelectedClient(null);
      await loadAll();
    } else {
      setNotice({ type: 'error', text: res.status === 0 ? OFFLINE : res.error || 'Could not schedule the session.' });
    }
  };

  const setStatus = async (s, status) => {
    const res = await api.updateSession(s.id, {
      memberId: s.memberId,
      sessionTime: s.sessionTime,
      focus: s.focus,
      status,
    });
    if (res.success) {
      await loadAll();
    } else {
      setNotice({ type: 'error', text: res.error || 'Could not update the session.' });
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm('Delete this session?')) return;
    const res = await api.deleteSession(s.id);
    if (res.success) {
      await loadAll();
    } else {
      setNotice({ type: 'error', text: res.error || 'Could not delete the session.' });
    }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Assigned Coaching Clients
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Members assigned to you by the Admin, and your training sessions
          </p>
        </div>
        <Link to="/trainer/workouts" className="btn btn-primary btn-sm">
          + Create & Assign Workout
        </Link>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : ''} mb-3`}
        >
          {notice.text}
        </div>
      )}

      {/* Clients */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">My Clients</h2>
          <span className="badge badge-blue">
            {clients.length} {clients.length === 1 ? 'Client' : 'Clients'} Assigned
          </span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Client Name</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Plan Ends</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 600 }}>{client.id}</td>
                    <td style={{ fontWeight: 500 }}>{client.name}</td>
                    <td>
                      <div>{client.phone}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{client.email}</div>
                    </td>
                    <td>{client.plan || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{client.endDate || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                          onClick={() => {
                            setSelectedClient(client);
                            setNotice({ type: '', text: '' });
                          }}
                        >
                          Schedule Session
                        </button>
                        <Link
                          to={`/trainer/workouts?memberId=${client.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                        >
                          Assign Workout
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No members are assigned to you yet. The Admin can assign members from Trainers & Staff.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule session form */}
      {selectedClient && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">Schedule Session for {selectedClient.name}</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedClient(null)}>
              Cancel
            </button>
          </div>
          <form onSubmit={handleSchedule}>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="session-time" className="form-label">Date & Time *</label>
                <input
                  id="session-time"
                  type="datetime-local"
                  className="form-input"
                  value={form.sessionTime}
                  onChange={(e) => setForm({ ...form, sessionTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="session-focus" className="form-label">Focus / Notes</label>
                <input
                  id="session-focus"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chest and triceps, 4 sets"
                  value={form.focus}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Session'}
            </button>
          </form>
        </div>
      )}

      {/* Sessions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">My Training Sessions</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Member</th>
                <th>Focus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{formatTime(s.sessionTime)}</td>
                    <td>{memberName(s.memberId)}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{s.focus || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          s.status === 'Completed' ? 'badge-green' : s.status === 'Cancelled' ? 'badge-gray' : 'badge-blue'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {s.status === 'Scheduled' && (
                          <>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(s, 'Completed')}>
                              Complete
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatus(s, 'Cancelled')}>
                              Cancel
                            </button>
                          </>
                        )}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDelete(s)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    No sessions scheduled yet.
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

export default TrainerMembers;