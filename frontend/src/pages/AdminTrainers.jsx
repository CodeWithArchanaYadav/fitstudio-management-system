import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/**
 * AdminTrainers Page
 * Staff Management for Gym Administrators (connected to the Spring Boot backend).
 * Add Trainers / Receptionists (saved as login accounts in the DB) and assign a trainer to a member.
 * Accessible at /admin/trainers under DashboardLayout.
 */
const ROLE_LABEL = { TRAINER: 'Personal Trainer', RECEPTIONIST: 'Receptionist' };
const OFFLINE = 'Cannot reach the backend. Make sure the Spring Boot server is running on port 6967.';

function AdminTrainers() {
  const [staff, setStaff] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // 'trainer' | 'receptionist' | null
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const emptyStaff = { name: '', email: '', phone: '', password: '' };
  const [trainerForm, setTrainerForm] = useState(emptyStaff);
  const [receptionistForm, setReceptionistForm] = useState(emptyStaff);
  const [assignmentForm, setAssignmentForm] = useState({ memberId: '', trainerId: '' });

  const trainers = staff.filter((u) => u.role === 'TRAINER');

  const loadAll = useCallback(async () => {
    const [staffRes, memberRes] = await Promise.all([api.getStaff(), api.getMembers()]);
    if (staffRes.success) setStaff(staffRes.data);
    if (memberRes.success) setMembers(memberRes.data);
    const failed = !staffRes.success ? staffRes : !memberRes.success ? memberRes : null;
    if (failed) {
      setNotice({ type: 'error', text: failed.status === 0 ? OFFLINE : failed.error || 'Could not load data.' });
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const createStaff = async (form, role, resetForm) => {
    if (!form.name.trim() || !form.email.trim()) {
      setNotice({ type: 'error', text: `Please provide ${ROLE_LABEL[role].toLowerCase()} name and email.` });
      return;
    }
    if (form.password.length < 6) {
      setNotice({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setIsSaving(true);
    const res = await api.createStaff({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, ''),
      password: form.password,
      role,
      status: 'Active',
    });
    setIsSaving(false);
    if (res.success) {
      resetForm(emptyStaff);
      setActiveForm(null);
      await loadAll();
      setNotice({
        type: 'info',
        text: `${ROLE_LABEL[role]} "${res.data.name}" added. They can log in with ${res.data.email} and the password you set.`,
      });
    } else {
      setNotice({ type: 'error', text: res.status === 0 ? OFFLINE : res.error || 'Could not add staff member.' });
    }
  };

  const handleAddTrainer = (e) => {
    e.preventDefault();
    createStaff(trainerForm, 'TRAINER', setTrainerForm);
  };

  const handleAddReceptionist = (e) => {
    e.preventDefault();
    createStaff(receptionistForm, 'RECEPTIONIST', setReceptionistForm);
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.memberId || !assignmentForm.trainerId) {
      setNotice({ type: 'error', text: 'Please select both a member and a trainer.' });
      return;
    }
    setIsSaving(true);
    const res = await api.assignTrainer(assignmentForm.memberId, assignmentForm.trainerId);
    setIsSaving(false);
    if (res.success) {
      const m = members.find((x) => String(x.id) === String(assignmentForm.memberId));
      const t = trainers.find((x) => String(x.id) === String(assignmentForm.trainerId));
      setAssignmentForm({ memberId: '', trainerId: '' });
      await loadAll();
      setNotice({ type: 'info', text: `${t?.name || 'Trainer'} is now assigned to ${m?.name || 'the member'}.` });
    } else {
      setNotice({ type: 'error', text: res.status === 0 ? OFFLINE : res.error || 'Could not assign trainer.' });
    }
  };

  const trainerName = (id) => trainers.find((t) => t.id === id)?.name || '—';

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Staff & Trainer Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Administer personal trainers, receptionist staff, and member coaching assignments
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setActiveForm(activeForm === 'trainer' ? null : 'trainer');
              setNotice({ type: '', text: '' });
            }}
          >
            {activeForm === 'trainer' ? 'Close Trainer Form' : '+ Add Personal Trainer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveForm(activeForm === 'receptionist' ? null : 'receptionist');
              setNotice({ type: '', text: '' });
            }}
          >
            {activeForm === 'receptionist' ? 'Close Receptionist Form' : '+ Add Receptionist'}
          </button>
        </div>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : ''}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Add Trainer Form */}
      {activeForm === 'trainer' && (
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
              <button type="submit" className="btn btn-primary">{isSaving ? 'Saving...' : 'Save Trainer'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Receptionist Form */}
      {activeForm === 'receptionist' && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">Add Front Desk Receptionist</h2>
          </div>
          <form onSubmit={handleAddReceptionist}>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Staff Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sunil Rao"
                  value={receptionistForm.name}
                  onChange={(e) => setReceptionistForm({ ...receptionistForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="reception@fitstudio.com"
                  value={receptionistForm.email}
                  onChange={(e) => setReceptionistForm({ ...receptionistForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={receptionistForm.phone}
                  onChange={(e) => setReceptionistForm({ ...receptionistForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Login Password * (min 6 characters)</label>
              <input
                type="password"
                className="form-input"
                placeholder="Set a password for this account"
                value={receptionistForm.password}
                onChange={(e) => setReceptionistForm({ ...receptionistForm, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">{isSaving ? 'Saving...' : 'Save Receptionist'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Trainer-to-Member Assignment Section */}
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
                    {m.name} {m.plan ? `(${m.plan})` : ''}
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

          <button type="submit" className="btn btn-primary btn-sm">
            {isSaving ? 'Saving...' : 'Save Trainer Assignment'}
          </button>
        </form>
      </div>

      {/* Staff Directory Table */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Active Gym Staff & Trainers Directory</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Full Name</th>
                <th>Assigned Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.id}</td>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td>
                      <span className={`badge ${u.role === 'TRAINER' ? 'badge-blue' : 'badge-green'}`}>
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{u.phone || '—'}</td>
                    <td><span className="badge badge-green">{u.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No staff added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member -> Trainer overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Members & Assigned Trainers</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Assigned Trainer</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td>{m.plan || '—'}</td>
                    <td>{trainerName(m.trainerId)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No members registered yet.
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

export default AdminTrainers;