import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * TrainerMembers Page
 * Displays gym members assigned to this personal trainer.
 * Reads from the shared FitStudio data layer.
 * Accessible at /trainer/members under DashboardLayout.
 */
function TrainerMembers() {
  const {
    trainers,
    activeTrainer,
    activeTrainerId,
    setActiveTrainerId,
    assignedMembers,
  } = useGymData();

  const [selectedClient, setSelectedClient] = useState(null);
  const [sessionNote, setSessionNote] = useState('');
  const [notice, setNotice] = useState('');

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!sessionNote.trim()) return;
    setNotice(`Coaching notes recorded for ${selectedClient.fullName}. (Frontend preview mode).`);
    setSessionNote('');
    setSelectedClient(null);
  };

  return (
    <div>
      {/* Prototype Coach Selector Banner */}
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Coach Roster:
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {activeTrainer ? `${activeTrainer.name} (${activeTrainer.id})` : 'Coach'}
            </strong>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              {activeTrainer?.specialization}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="switch-coach" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Switch Coach Preview:
            </label>
            <select
              id="switch-coach"
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              value={activeTrainerId}
              onChange={(e) => {
                setActiveTrainerId(e.target.value);
                setNotice('');
                setSelectedClient(null);
              }}
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

      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Assigned Coaching Clients
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Gym members assigned to you for 1-on-1 coaching, routine design, and goal progression
          </p>
        </div>
        <Link to="/trainer/workouts" className="btn btn-primary btn-sm">
          + Create & Assign Workout
        </Link>
      </div>

      {notice && (
        <div className="notice-box notice-warning mb-3">
          {notice}
        </div>
      )}

      {/* Clients Directory Card */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Assigned Clients for Coach {activeTrainer?.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Showing members assigned to this coach via the shared FitStudio assignment store
            </p>
          </div>
          <span className="badge badge-blue">
            {assignedMembers.length} {assignedMembers.length === 1 ? 'Client' : 'Clients'} Assigned
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Client Name</th>
                <th>Contact</th>
                <th>Plan Tier</th>
                <th>Coaching Goal</th>
                <th>Assigned Workout Plan</th>
                <th>Frequency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedMembers.length > 0 ? (
                assignedMembers.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 600 }}>{client.id}</td>
                    <td style={{ fontWeight: 500 }}>{client.fullName}</td>
                    <td>
                      <div>{client.phone}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{client.email}</div>
                    </td>
                    <td>{client.plan}</td>
                    <td style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{client.coachingGoal}</td>
                    <td>
                      <span className={`badge ${client.hasWorkout ? 'badge-green' : 'badge-warning'}`}>
                        {client.assignedRoutine}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{client.sessionsPerWeek} sessions/wk</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/trainer/workouts?memberId=${client.id}`}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                        >
                          {client.hasWorkout ? 'Edit Workout' : 'Assign Workout'}
                        </Link>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                          onClick={() => {
                            setSelectedClient(client);
                            setNotice('');
                          }}
                        >
                          Log Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                      <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                        No members are currently assigned to Coach {activeTrainer?.name}.
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        When the Admin or Receptionist assigns a member to your coaching roster via the Receptionist/Admin portals, they will immediately appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Coaching Note Modal / Box */}
      {selectedClient && (
        <div className="card" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">
              Log Session Notes for {selectedClient.fullName} ({selectedClient.id})
            </h2>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedClient(null)}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSaveNote}>
            <div className="form-group">
              <label className="form-label">Coaching Progress, Weights & Reps Completed</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="e.g. Member demonstrated excellent barbell bench press form (4x10 @ 75kg). Progressing to 80kg next week."
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Coaching Log
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedClient(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TrainerMembers;
