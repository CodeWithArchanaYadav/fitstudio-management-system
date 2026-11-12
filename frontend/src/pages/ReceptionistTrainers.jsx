import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useGymData, gymStore } from '../services/gymData';

/**
 * ReceptionistTrainers Page
 * Front desk trainer management, coach directory, and member-to-trainer assignments.
 * Accessible at /receptionist/trainers under DashboardLayout.
 */
function ReceptionistTrainers() {
  const {
    assignments,
    addTrainer,
    assignTrainerToMember,
    removeAssignment,
  } = useGymData();

  const [staff, setStaff] = useState([]);
  const [members, setMembers] = useState([]);
  const [showAddTrainerForm, setShowAddTrainerForm] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // New trainer form (identical to Admin)
  const emptyStaff = { name: '', email: '', phone: '', password: '' };
  const [trainerForm, setTrainerForm] = useState(emptyStaff);

  // Trainer-to-member assignment form (identical to Admin)
  const [assignmentForm, setAssignmentForm] = useState({ memberId: '', trainerId: '' });

  const trainers = staff.filter((u) => u.role === 'TRAINER');

  const loadAll = useCallback(async () => {
    const [staffRes, memberRes] = await Promise.all([api.getStaff(), api.getMembers()]);
    if (staffRes.success && Array.isArray(staffRes.data) && staffRes.data.length > 0) {
      setStaff(staffRes.data);
    } else {
      const localTrainers = gymStore.getTrainers();
      setStaff(localTrainers.map((t) => ({ ...t, role: 'TRAINER' })));
    }
    if (memberRes.success && Array.isArray(memberRes.data) && memberRes.data.length > 0) {
      setMembers(memberRes.data);
    } else {
      const localMembers = gymStore.getMembers();
      setMembers(localMembers.map((m) => ({ ...m, name: m.fullName })));
    }
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
    let createdTrainer = null;
    try {
      const res = await api.createStaff({
        name: trainerForm.name.trim(),
        email: trainerForm.email.trim(),
        phone: trainerForm.phone.replace(/\D/g, ''),
        password: trainerForm.password,
        role: 'TRAINER',
        status: 'Active',
      });
      if (res.success) {
        createdTrainer = res.data;
      }
    } catch {
      // offline fallback
    }

    // Keep shared gymStore in sync without storing plaintext passwords in localStorage
    const newLocalTrainer = addTrainer({
      name: trainerForm.name.trim(),
      email: trainerForm.email.trim(),
      phone: trainerForm.phone.trim() || '+91 98765 00000',
    });

    setIsSaving(false);
    setTrainerForm(emptyStaff);
    setShowAddTrainerForm(false);
    await loadAll();

    const displayName = createdTrainer?.name || newLocalTrainer?.name || trainerForm.name.trim();
    setNotice({
      type: 'info',
      text: `Personal Trainer "${displayName}" added. They can log in with ${trainerForm.email.trim()} and the password you set.`,
    });
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.memberId || !assignmentForm.trainerId) {
      setNotice({ type: 'error', text: 'Please select both a member and a trainer.' });
      return;
    }

    setIsSaving(true);
    try {
      await api.assignTrainer(assignmentForm.memberId, assignmentForm.trainerId);
    } catch {
      // offline fallback
    }

    // Keep shared gymStore in sync
    assignTrainerToMember({
      memberId: assignmentForm.memberId,
      trainerId: assignmentForm.trainerId,
    });

    setIsSaving(false);
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
  };

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

      {/* Add Trainer Form (Identical to Admin) */}
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
                  placeholder="e.g. Vikram Singh"
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
                  placeholder="trainer@example.com"
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
                  placeholder="+91 98765 43220"
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

      {/* Trainer-to-Member Assignment Section (Identical to Admin) */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Trainer-to-Member Assignment</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Assign certified personal trainers to registered Premium & Standard members.
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
                    {m.name || m.fullName} {m.plan ? `(${m.plan})` : ''}
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
              {trainers.map((t) => {
                const clientCount = assignments.filter((a) => a.trainerId === t.id && a.status === 'Active').length;
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.id}</td>
                    <td style={{ fontWeight: 500 }}>{t.name}</td>
                    <td><span className="badge badge-blue">{t.specialization || 'Strength & Conditioning'}</span></td>
                    <td>
                      <div>{t.phone}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.email}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{t.shift || 'General'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{clientCount}</td>
                    <td><span className="badge badge-green">{t.status || 'Active'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing Member-to-Trainer Assignments Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Member-to-Trainer Coaching Assignments</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Active 1-on-1 coaching arrangements for Standard and Premium members
            </p>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Assignment #</th>
                <th>Member Name (ID)</th>
                <th>Assigned Coach (ID)</th>
                <th>Coaching Focus / Goals</th>
                <th>Frequency</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((asn) => {
                  const member = members.find((m) => String(m.id) === String(asn.memberId));
                  const trainer = trainers.find((t) => String(t.id) === String(asn.trainerId));
                  const memberDisplayName = member?.fullName || member?.name || asn.memberId;
                  const trainerDisplayName = trainer?.name || asn.trainerId;

                  return (
                    <tr key={asn.assignmentId}>
                      <td style={{ fontWeight: 600 }}>{asn.assignmentId}</td>
                      <td style={{ fontWeight: 500 }}>{memberDisplayName} ({asn.memberId})</td>
                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>{trainerDisplayName}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>{asn.trainerId}</span>
                      </td>
                      <td style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{asn.coachingGoal}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{asn.sessionsPerWeek} sessions/wk</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{asn.assignedDate}</td>
                      <td><span className="badge badge-green">{asn.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                          onClick={() => {
                            removeAssignment(asn.assignmentId);
                            setNotice({
                              type: 'info',
                              text: `Removed coaching assignment for ${memberDisplayName}. Member is now unassigned.`,
                            });
                          }}
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No member-trainer assignments recorded yet.
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
