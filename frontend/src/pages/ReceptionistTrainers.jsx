import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/**
 * ReceptionistTrainers Page
 * Front desk trainer directory, coach roster, and member-to-trainer assignments.
 * Connected to backend /api/staff and /api/members.
 * Accessible at /receptionist/trainers under DashboardLayout.
 */
function ReceptionistTrainers() {
  const [staff, setStaff] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrainerForm, setShowAddTrainerForm] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // New trainer form
  const emptyStaff = { name: '', email: '', phone: '', password: '' };
  const [trainerForm, setTrainerForm] = useState(emptyStaff);

  // Trainer-to-member assignment form
  const [assignmentForm, setAssignmentForm] = useState({ memberId: '', trainerId: '' });

  const trainers = staff.filter((u) => u.role === 'TRAINER');

  const loadAll = useCallback(async () => {
    const [staffRes, memberRes] = await Promise.all([
      api.getStaff('TRAINER'),
      api.getMembers(),
    ]);

    if (staffRes.success && Array.isArray(staffRes.data)) {
      setStaff(staffRes.data);
    } else if (staffRes.status === 0) {
      setNotice({ type: 'error', text: 'Cannot reach backend server. Make sure Spring Boot is running on port 6967.' });
    }

    if (memberRes.success && Array.isArray(memberRes.data)) {
      setMembers(memberRes.data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    if (!trainerForm.name.trim() || !trainerForm.email.trim()) {
      setNotice({ type: 'error', text: 'Please provide personal trainer name and email.' });
      return;
    }
    if (trainerForm.password.length < 6) {
      setNotice({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsSaving(true);
    setNotice({ type: '', text: '' });

    const res = await api.createStaff({
      name: trainerForm.name.trim(),
      email: trainerForm.email.trim(),
      phone: trainerForm.phone.replace(/\D/g, ''),
      password: trainerForm.password,
      role: 'TRAINER',
      status: 'Active',
    });

    setIsSaving(false);

    if (res.success) {
      setTrainerForm(emptyStaff);
      setShowAddTrainerForm(false);
      await loadAll();
      setNotice({
        type: 'info',
        text: `Personal Trainer "${res.data.name}" added successfully.`,
      });
    } else {
      setNotice({
        type: 'error',
        text: res.error || 'Failed to create trainer account.',
      });
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.memberId || !assignmentForm.trainerId) {
      setNotice({ type: 'error', text: 'Please select both a member and a trainer.' });
      return;
    }

    setIsSaving(true);
    setNotice({ type: '', text: '' });

    const res = await api.assignTrainer(assignmentForm.memberId, assignmentForm.trainerId);
    setIsSaving(false);

    if (res.success) {
      const m = members.find((x) => String(x.id) === String(assignmentForm.memberId));
      const t = trainers.find((x) => String(x.id) === String(assignmentForm.trainerId));
      const memberName = m?.name || m?.fullName || 'the member';
      const trainerName = t?.name || 'Trainer';

      setAssignmentForm({ memberId: '', trainerId: '' });
      await loadAll();
      setNotice({
        type: 'info',
        text: `${trainerName} is now assigned to ${memberName}.`,
      });
    } else {
      setNotice({
        type: 'error',
        text: res.error || 'Failed to assign trainer to member.',
      });
    }
  };

  // Assigned members derived directly from member records
  const assignedMembers = members.filter((m) => m.trainerId != null);

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Trainer Management & Coaching Assignments
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Maintain gym personal trainers, review coaching loads, and assign members to certified coaches
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowAddTrainerForm(!showAddTrainerForm);
            setNotice({ type: '', text: '' });
          }}
        >
          {showAddTrainerForm ? 'Close Trainer Form' : '+ Add Personal Trainer'}
        </button>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Add Trainer Form */}
      {showAddTrainerForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">Add Certified Personal Trainer</h2>
          </div>
          <form onSubmit={handleAddTrainer}>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Trainer Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full name"
                  value={trainerForm.name}
                  onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="trainer@fitstudio.com"
                  value={trainerForm.email}
                  onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit phone number"
                  value={trainerForm.phone}
                  onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Login Password * (min 6 characters)</label>
              <input
                type="password"
                className="form-input"
                placeholder="Set a password for this account"
                value={trainerForm.password}
                onChange={(e) => setTrainerForm({ ...trainerForm, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Trainer'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddTrainerForm(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trainer-to-Member Assignment Section */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Trainer-to-Member Assignment</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Assign certified personal trainers to registered members.
        </p>
        <form onSubmit={handleAssignment} style={{ maxWidth: '650px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="assign-member" className="form-label">Select Registered Member *</label>
              <select
                id="assign-member"
                className="form-select"
                value={assignmentForm.memberId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, memberId: e.target.value })}
                required
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.fullName} (MEM-{m.id}) {m.plan ? `— ${m.plan}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assign-trainer" className="form-label">Select Personal Trainer *</label>
              <select
                id="assign-trainer"
                className="form-select"
                value={assignmentForm.trainerId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, trainerId: e.target.value })}
                required
              >
                <option value="">-- Choose Trainer --</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Trainer Assignment'}
          </button>
        </form>
      </div>

      {/* Trainers Directory Table */}
      <div className="card mb-3">
        <div className="card-header">
          <div>
            <h2 className="card-title">Certified Personal Trainers Directory</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Review instructor credentials, shift schedules, and active client loads
            </p>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Trainer ID</th>
                <th>Full Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Shift Schedule</th>
                <th>Active Clients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trainers.length > 0 ? (
                trainers.map((t) => {
                  const clientCount = members.filter((m) => m.trainerId === t.id).length;
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>STF-{t.id}</td>
                      <td style={{ fontWeight: 500 }}>{t.name}</td>
                      <td><span className="badge badge-blue">{t.specialization || 'Strength & Conditioning'}</span></td>
                      <td>
                        <div>{t.phone || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.email}</div>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{t.shift || 'General'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{clientCount}</td>
                      <td><span className="badge badge-green">{t.status || 'Active'}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    {loading ? 'Loading trainers…' : 'No personal trainers found in the system.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing Member-to-Trainer Assignments Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Member Coaching Assignments</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Active coaching arrangements linked to registered gym members
            </p>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Assigned Coach</th>
                <th>Plan Tier</th>
                <th>Coaching Focus</th>
                <th>Sessions/Wk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedMembers.length > 0 ? (
                assignedMembers.map((m) => {
                  const trainer = trainers.find((t) => t.id === m.trainerId);
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>MEM-{m.id}</td>
                      <td style={{ fontWeight: 500 }}>{m.name || m.fullName}</td>
                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>{trainer?.name || `Trainer #${m.trainerId}`}</strong>
                      </td>
                      <td>{m.plan || '—'}</td>
                      <td style={{ fontSize: '0.88rem' }}>{m.coachingGoal || 'General Fitness'}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>
                        {m.sessionsPerWeek ? `${m.sessionsPerWeek} sessions/wk` : '—'}
                      </td>
                      <td><span className="badge badge-green">{m.status || 'Active'}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    {loading ? 'Loading assignments…' : 'No members currently assigned to personal trainers.'}
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

export default ReceptionistTrainers;
