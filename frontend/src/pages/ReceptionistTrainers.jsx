import React, { useState } from 'react';
import { useGymData, gymStore } from '../services/gymData';

/**
 * ReceptionistTrainers Page
 * Front desk trainer management, coach directory, and member-to-trainer assignments.
 * Accessible at /receptionist/trainers under DashboardLayout.
 */
function ReceptionistTrainers() {
  const {
    trainers,
    members,
    assignments,
    addTrainer,
    assignTrainerToMember,
    removeAssignment,
  } = useGymData();

  const [showAddTrainerForm, setShowAddTrainerForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  // New trainer form
  const [trainerForm, setTrainerForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Strength & Conditioning',
  });
  const [trainerErrors, setTrainerErrors] = useState({});

  // Trainer-to-member assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    memberId: '',
    trainerId: '',
    coachingGoal: '',
    sessionsPerWeek: '3',
  });
  const [assignErrors, setAssignErrors] = useState({});

  const validateTrainer = () => {
    const errs = {};
    if (!trainerForm.name.trim()) errs.name = 'Trainer name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trainerForm.email.trim()) {
      errs.email = 'Trainer email is required.';
    } else if (!emailRegex.test(trainerForm.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    setTrainerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddTrainerSubmit = (e) => {
    e.preventDefault();
    if (!validateTrainer()) return;

    const newTrainer = addTrainer({
      name: trainerForm.name.trim(),
      email: trainerForm.email.trim(),
      phone: trainerForm.phone.trim() || '+91 98765 00000',
      specialization: trainerForm.specialization,
      shift: 'General',
    });

    setShowAddTrainerForm(false);
    setTrainerForm({ name: '', email: '', phone: '', specialization: 'Strength & Conditioning' });

    setNotice({
      type: 'info',
      text: `Trainer record created for ${newTrainer.name} (${newTrainer.id}). Staff profile registered in gym directory.`,
    });
  };

  const validateAssignment = () => {
    const errs = {};
    if (!assignmentForm.memberId) errs.memberId = 'Please select a member.';
    if (!assignmentForm.trainerId) errs.trainerId = 'Please select a trainer.';
    setAssignErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!validateAssignment()) return;

    const chosenMember = members.find((m) => m.id === assignmentForm.memberId);
    const chosenTrainer = trainers.find((t) => t.id === assignmentForm.trainerId);

    const savedAssignment = assignTrainerToMember({
      memberId: assignmentForm.memberId,
      trainerId: assignmentForm.trainerId,
      coachingGoal: assignmentForm.coachingGoal.trim() || 'General Strength & Conditioning',
      sessionsPerWeek: assignmentForm.sessionsPerWeek,
    });

    setShowAssignModal(false);
    setNotice({
      type: 'info',
      text: `Member ${chosenMember?.fullName || chosenMember?.name || assignmentForm.memberId} assigned to Coach ${chosenTrainer?.name || assignmentForm.trainerId} (Ref: ${savedAssignment.assignmentId}). Appears immediately in Trainer's roster.`,
    });
    setAssignmentForm({ memberId: '', trainerId: '', coachingGoal: '', sessionsPerWeek: '3' });
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setShowAssignModal(true);
              setNotice({ type: '', text: '' });
            }}
          >
            + Assign Member to Trainer
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setShowAddTrainerForm(!showAddTrainerForm);
              setNotice({ type: '', text: '' });
            }}
          >
            {showAddTrainerForm ? 'Close Trainer Form' : '+ Add Trainer Record'}
          </button>
        </div>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Add Trainer Record Form */}
      {showAddTrainerForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Add Certified Personal Trainer Record</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Creates a staff profile and initiates account setup for the trainer portal
              </p>
            </div>
            <span className="badge badge-green">Front Desk Staff Admin</span>
          </div>

          <form onSubmit={handleAddTrainerSubmit} noValidate>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Trainer Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Arjun Nair"
                  value={trainerForm.name}
                  onChange={(e) => {
                    setTrainerForm({ ...trainerForm, name: e.target.value });
                    if (trainerErrors.name) setTrainerErrors({ ...trainerErrors, name: '' });
                  }}
                />
                {trainerErrors.name && <div className="form-error">{trainerErrors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for portal login) *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="arjun.nair@fitstudio.com"
                  value={trainerForm.email}
                  onChange={(e) => {
                    setTrainerForm({ ...trainerForm, email: e.target.value });
                    if (trainerErrors.email) setTrainerErrors({ ...trainerErrors, email: '' });
                  }}
                />
                {trainerErrors.email && <div className="form-error">{trainerErrors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43225"
                  value={trainerForm.phone}
                  onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Coaching Specialization</label>
              <select
                className="form-select"
                value={trainerForm.specialization}
                onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
              >
                <option value="Strength & Conditioning">Strength & Conditioning / Powerlifting</option>
                <option value="Functional HIIT & Agility">Functional HIIT & Agility</option>
                <option value="Hypertrophy & Bodybuilding">Hypertrophy & Bodybuilding</option>
                <option value="Mobility & Posture Rehab">Mobility & Posture Rehab</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Trainer Record
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddTrainerForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                    <td><span className="badge badge-blue">{t.specialization}</span></td>
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
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowAssignModal(true)}
          >
            + New Assignment
          </button>
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
                  const member = members.find((m) => m.id === asn.memberId);
                  const trainer = trainers.find((t) => t.id === asn.trainerId);
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

      {/* Member Assignment Modal */}
      {showAssignModal && (
        <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Assign Registered Member to Personal Trainer</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAssignModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Pair a registered gym member with a certified instructor based on their fitness objectives and schedule.
            </p>

            <form onSubmit={handleAssignmentSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Select Registered Member *</label>
                <select
                  className="form-select"
                  value={assignmentForm.memberId}
                  onChange={(e) => {
                    setAssignmentForm({ ...assignmentForm, memberId: e.target.value });
                    if (assignErrors.memberId) setAssignErrors({ ...assignErrors, memberId: '' });
                  }}
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => {
                    const currentCoach = gymStore.getTrainerForMember(m.id);
                    return (
                      <option key={m.id} value={m.id}>
                        {m.id}: {m.fullName || m.name} ({m.plan}) {currentCoach ? `— Assigned: Coach ${currentCoach.name}` : '— Unassigned'}
                      </option>
                    );
                  })}
                </select>
                {assignErrors.memberId && <div className="form-error">{assignErrors.memberId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Select Certified Personal Trainer *</label>
                <select
                  className="form-select"
                  value={assignmentForm.trainerId}
                  onChange={(e) => {
                    setAssignmentForm({ ...assignmentForm, trainerId: e.target.value });
                    if (assignErrors.trainerId) setAssignErrors({ ...assignErrors, trainerId: '' });
                  }}
                >
                  <option value="">-- Choose Trainer --</option>
                  {trainers.map((t) => {
                    const count = assignments.filter((a) => a.trainerId === t.id && a.status === 'Active').length;
                    return (
                      <option key={t.id} value={t.id}>
                        {t.id}: {t.name} ({t.specialization}) — {count} active clients
                      </option>
                    );
                  })}
                </select>
                {assignErrors.trainerId && <div className="form-error">{assignErrors.trainerId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Coaching Focus / Primary Goals</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Strength building, compound barbell mechanics, fat loss"
                  value={assignmentForm.coachingGoal}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, coachingGoal: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Weekly Sessions</label>
                <select
                  className="form-select"
                  value={assignmentForm.sessionsPerWeek}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, sessionsPerWeek: e.target.value })}
                >
                  <option value="2">2 Sessions / Week</option>
                  <option value="3">3 Sessions / Week</option>
                  <option value="4">4 Sessions / Week</option>
                  <option value="5">5 Sessions / Week</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm Assignment
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionistTrainers;

