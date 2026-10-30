import React, { useState } from 'react';
import { useGymData } from '../services/gymData';

/**
 * AdminTrainers Page
 * Staff Management for Gym Administrators.
 * Handles Certified Personal Trainers, Receptionist staff, and Trainer Assignments.
 * Accessible at /admin/trainers under DashboardLayout.
 */
function AdminTrainers() {
  const { trainers, members, addTrainer, assignTrainerToMember } = useGymData();

  const [activeForm, setActiveForm] = useState(null); // 'trainer' | 'receptionist' | 'assignment' | null
  const [notice, setNotice] = useState({ type: '', text: '' });

  // Form states
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '', phone: '', specialization: 'Strength & Conditioning' });
  const [receptionistForm, setReceptionistForm] = useState({ name: '', email: '', phone: '', shift: 'Morning' });
  const [assignmentForm, setAssignmentForm] = useState({ memberId: '', trainerId: '', notes: '' });

  // Receptionist staff list
  const [receptionistStaff, setReceptionistStaff] = useState([
    { id: 'STF-R01', name: 'Sunil Rao', role: 'Receptionist', contact: '+91 98765 43222', specialization: 'Front Desk / Operations', status: 'Active' },
  ]);

  const handleAddTrainer = (e) => {
    e.preventDefault();
    if (!trainerForm.name.trim() || !trainerForm.email.trim()) {
      setNotice({ type: 'error', text: 'Please provide trainer name and email.' });
      return;
    }
    const newTrainer = addTrainer({
      name: trainerForm.name.trim(),
      email: trainerForm.email.trim(),
      phone: trainerForm.phone.trim() || '+91 98765 00000',
      specialization: trainerForm.specialization,
      shift: 'General',
    });
    setTrainerForm({ name: '', email: '', phone: '', specialization: 'Strength & Conditioning' });
    setActiveForm(null);
    setNotice({
      type: 'info',
      text: `Trainer record created for ${newTrainer.name} (${newTrainer.id}). Credentials will be dispatched to ${newTrainer.email}.`,
    });
  };

  const handleAddReceptionist = (e) => {
    e.preventDefault();
    if (!receptionistForm.name.trim() || !receptionistForm.email.trim()) {
      setNotice({ type: 'error', text: 'Please provide receptionist name and email.' });
      return;
    }
    const newStaff = {
      id: `STF-R0${receptionistStaff.length + 1}`,
      name: receptionistForm.name.trim(),
      role: 'Receptionist',
      contact: receptionistForm.phone.trim() || receptionistForm.email.trim(),
      specialization: `${receptionistForm.shift} Shift`,
      status: 'Active',
    };
    setReceptionistStaff([...receptionistStaff, newStaff]);
    setReceptionistForm({ name: '', email: '', phone: '', shift: 'Morning' });
    setActiveForm(null);
    setNotice({
      type: 'info',
      text: `Receptionist staff record created for ${newStaff.name} (${newStaff.id}).`,
    });
  };

  const handleAssignment = (e) => {
    e.preventDefault();
    if (!assignmentForm.memberId || !assignmentForm.trainerId) {
      setNotice({ type: 'error', text: 'Please select both a member and a certified trainer.' });
      return;
    }
    const chosenMember = members.find((m) => m.id === assignmentForm.memberId);
    const chosenTrainer = trainers.find((t) => t.id === assignmentForm.trainerId);

    const savedAssignment = assignTrainerToMember({
      memberId: assignmentForm.memberId,
      trainerId: assignmentForm.trainerId,
      coachingGoal: assignmentForm.notes.trim() || 'General Strength & Conditioning',
      sessionsPerWeek: '3',
    });

    setNotice({
      type: 'info',
      text: `Trainer assignment recorded for ${chosenMember?.fullName || assignmentForm.memberId} with Coach ${chosenTrainer?.name || assignmentForm.trainerId} (Ref: ${savedAssignment.assignmentId}). Visible immediately on Trainer's client roster.`,
    });
    setAssignmentForm({ memberId: '', trainerId: '', notes: '' });
  };

  const combinedStaff = [
    ...trainers.map((t) => ({
      id: t.id,
      name: t.name,
      role: 'Personal Trainer',
      contact: t.phone || t.email,
      specialization: t.specialization,
      status: t.status || 'Active',
    })),
    ...receptionistStaff,
  ];

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
              <label className="form-label">Primary Coaching Specialization</label>
              <select
                className="form-select"
                value={trainerForm.specialization}
                onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
              >
                <option value="Strength & Conditioning">Strength & Conditioning / Powerlifting</option>
                <option value="Bodybuilding & Hypertrophy">Bodybuilding & Hypertrophy</option>
                <option value="Cardio & Weight Management">Cardio & Weight Management</option>
                <option value="Functional & Mobility">Functional & Mobility Training</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Save Trainer Record</button>
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
                <label className="form-label">Assigned Shift</label>
                <select
                  className="form-select"
                  value={receptionistForm.shift}
                  onChange={(e) => setReceptionistForm({ ...receptionistForm, shift: e.target.value })}
                >
                  <option value="Morning">Morning (5:30 AM – 2:00 PM)</option>
                  <option value="Evening">Evening (2:00 PM – 10:30 PM)</option>
                  <option value="General">General Operating Hours</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Save Staff Record</button>
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
                    {m.id}: {m.fullName || m.name} ({m.plan})
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
                    {t.id}: {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assign-notes" className="form-label">Coaching Goals / Notes</label>
            <input
              id="assign-notes"
              type="text"
              className="form-input"
              placeholder="e.g. Focus on compound lifts, strength building, 4 sessions/week"
              value={assignmentForm.notes}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Save Trainer Assignment
          </button>
        </form>
      </div>

      {/* Staff Directory Table */}
      <div className="card">
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
                <th>Specialization / Shift</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {combinedStaff.map((staff) => (
                <tr key={staff.id}>
                  <td style={{ fontWeight: 600 }}>{staff.id}</td>
                  <td style={{ fontWeight: 500 }}>{staff.name}</td>
                  <td>
                    <span className={`badge ${staff.role === 'Personal Trainer' ? 'badge-blue' : 'badge-green'}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td>{staff.specialization}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{staff.contact}</td>
                  <td><span className="badge badge-green">{staff.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTrainers;
