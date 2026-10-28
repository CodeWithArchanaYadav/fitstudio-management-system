import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { apiRequest } from '../api';

function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

  const [assignedMembers, setAssignedMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'assigned-members') {
      setMembersLoading(true);
      apiRequest('/trainer/me/members').then(setAssignedMembers).catch(() => {}).finally(() => setMembersLoading(false));
    }
    if (activeTab === 'overview' || activeTab === 'workouts') {
      setWorkoutsLoading(true);
      apiRequest('/workouts').then(setWorkouts).catch(() => {}).finally(() => setWorkoutsLoading(false));
    }
    if (activeTab === 'schedule') {
      setSessionsLoading(true);
      apiRequest('/sessions').then(setSessions).catch(() => setNotice('Failed to load sessions.')).finally(() => setSessionsLoading(false));
    }
  }, [activeTab]);

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar
          role="trainer"
          activeItem={activeTab}
          onSelect={(tabId) => {
            setActiveTab(tabId);
            setNotice('');
          }}
        />

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Trainer Dashboard</h1>
            <p>Client Workouts, Progress &amp; Training Sessions</p>
          </header>

          {notice && (
            <div className="notice-box notice-warning">
              {notice}
            </div>
          )}

          {activeTab === 'overview' && (
            <div>
              <div className="grid-3 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Assigned Clients</div>
                  <div className="stat-value">{membersLoading ? '…' : assignedMembers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Today's Sessions</div>
                  <div className="stat-value">{sessionsLoading ? '…' : sessions.filter(s => s.today || s.isToday).length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Workout Plans</div>
                  <div className="stat-value">{workoutsLoading ? '…' : workouts.length}</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Training Overview</h2>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  Manage your client routines, track workout completions, and manage one-on-one coaching schedules.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('assigned-members')}>
                    View Assigned Clients
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('workouts')}>
                    Create Workout Routine
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('schedule')}>
                    Weekly Training Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assigned-members' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Assigned Clients</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Members currently assigned to you for customized coaching and tracking.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Goal</th>
                      <th>Plan Status</th>
                      <th>Last Session</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersLoading ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : assignedMembers.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No assigned clients found.
                        </td>
                      </tr>
                    ) : assignedMembers.map((m) => (
                      <tr key={m.id}>
                        <td>{m.fullName || m.name}</td>
                        <td>{m.goal || '—'}</td>
                        <td>
                          <span className={`badge ${m.status === 'ACTIVE' || m.active ? 'badge-green' : 'badge-gray'}`}>
                            {m.status || (m.active ? 'Active' : 'Inactive')}
                          </span>
                        </td>
                        <td>{m.lastSession || '—'}</td>
                        <td>
                          <button type="button" className="btn btn-secondary btn-sm"
                            onClick={() => setActiveTab('workouts')}>
                            View Workouts
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Workout Plans &amp; Routines</h2>
                <button type="button" className="btn btn-primary btn-sm"
                  onClick={() => setNotice('Use the Workouts page to create routines.')}>
                  + Add Workout Routine
                </button>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Build exercise sets, reps, and routines for your assigned members.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Routine Title</th>
                      <th>Target Muscle / Goal</th>
                      <th>Difficulty</th>
                      <th>Exercises</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutsLoading ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : workouts.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No workout routines found.
                        </td>
                      </tr>
                    ) : workouts.map((w) => (
                      <tr key={w.id}>
                        <td>{w.title || w.name}</td>
                        <td>{w.targetMuscle || w.goal || '—'}</td>
                        <td>{w.difficulty || '—'}</td>
                        <td>{w.exerciseCount || (w.exercises ? w.exercises.split(',').length : '—')}</td>
                        <td>
                          <button type="button" className="btn btn-secondary btn-sm"
                            onClick={() => setNotice('Workout editing available on the Workouts page.')}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Training Schedule &amp; Sessions</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Your weekly calendar of personal training sessions.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      <th>Client</th>
                      <th>Session Focus</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionsLoading ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : sessions.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No sessions scheduled for this week.
                        </td>
                      </tr>
                    ) : sessions.map((s) => (
                      <tr key={s.id}>
                        <td>{s.timeSlot || s.scheduledAt || '—'}</td>
                        <td>{s.clientName || s.memberName || '—'}</td>
                        <td>{s.focus || s.sessionFocus || '—'}</td>
                        <td>
                          <span className={`badge ${s.status === 'COMPLETED' ? 'badge-green' : s.status === 'CANCELLED' ? 'badge-gray' : 'badge-blue'}`}>
                            {s.status || 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TrainerDashboard;
