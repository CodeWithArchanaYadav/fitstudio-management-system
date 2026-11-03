import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

/**
 * TrainerWorkouts Page (connected to the Spring Boot backend)
 * Create / edit / delete workout routines and assign them to the trainer's own clients.
 *
 * The backend stores the plan in workout_routines (title, goal, schedule, targetMuscle, difficulty)
 * and every exercise as its own row in workout_exercises (returned as the "exercises" array).
 */
const OFFLINE = 'Cannot reach the backend. Make sure the Spring Boot server is running on port 6967.';
const blankExercise = () => ({ name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' });
const blankForm = (memberId = '') => ({
  memberId,
  planName: '',
  goal: '',
  schedule: '4 Days / Week (Monday, Tuesday, Thursday, Friday)',
  targetMuscle: 'Upper Body Push & Core',
  difficulty: 'Intermediate',
  exercises: [blankExercise()],
});

function TrainerWorkouts() {
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get('memberId') || '';

  const [clients, setClients] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(blankForm());
  const [formErrors, setFormErrors] = useState({});
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openedPreselect, setOpenedPreselect] = useState(false);

  const loadAll = useCallback(async () => {
    const [cRes, wRes] = await Promise.all([api.getMyClients(), api.getWorkouts()]);
    if (cRes.success) setClients(cRes.data);
    if (wRes.success) setRoutines(wRes.data);
    const failed = !cRes.success ? cRes : !wRes.success ? wRes : null;
    if (failed) setNotice({ type: 'error', text: failed.status === 0 ? OFFLINE : failed.error || 'Could not load data.' });
    setLoading(false);
    return { clients: cRes.success ? cRes.data : [], routines: wRes.success ? wRes.data : [] };
  }, []);

  useEffect(() => {
    loadAll().then(({ routines: list }) => {
      // Coming from "Prescribe" / "View Plan" on the dashboard
      if (preselectedMemberId && !openedPreselect) {
        setOpenedPreselect(true);
        const existing = list.find((r) => (r.memberIds || []).map(String).includes(preselectedMemberId));
        if (existing) openEdit(existing);
        else {
          setFormData(blankForm(preselectedMemberId));
          setShowForm(true);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAll]);

  const clientName = (id) => clients.find((c) => String(c.id) === String(id))?.name || `Member #${id}`;
  const memberOf = (r) => (r.memberIds && r.memberIds.length > 0 ? r.memberIds[0] : null);

  const resetForm = () => {
    setFormData(blankForm(clients[0] ? String(clients[0].id) : ''));
    setFormErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    setFormData(blankForm(clients[0] ? String(clients[0].id) : ''));
    setFormErrors({});
    setEditingId(null);
    setShowForm(true);
    setNotice({ type: '', text: '' });
  };

  function openEdit(r) {
    const exList = Array.isArray(r.exercises) ? r.exercises : [];
    setEditingId(r.id);
    setFormData({
      memberId: memberOf(r) ? String(memberOf(r)) : '',
      planName: r.title || '',
      goal: r.goal || '',
      schedule: r.schedule || '4 Days / Week',
      targetMuscle: r.targetMuscle || 'Upper Body Push & Core',
      difficulty: r.difficulty || 'Intermediate',
      exercises: exList.length > 0 ? exList.map((ex) => ({ ...blankExercise(), ...ex, weightOrDifficulty: ex.weightOrDifficulty || '', notes: ex.notes || '' })) : [blankExercise()],
    });
    setFormErrors({});
    setShowForm(true);
    setNotice({ type: '', text: '' });
  }

  const handleExerciseChange = (index, field, value) => {
    const updated = formData.exercises.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    setFormData({ ...formData, exercises: updated });
  };
  const addRow = () => setFormData({ ...formData, exercises: [...formData.exercises, blankExercise()] });
  const removeRow = (index) => {
    if (formData.exercises.length <= 1) return;
    setFormData({ ...formData, exercises: formData.exercises.filter((_, i) => i !== index) });
  };

  const validate = () => {
    const errors = {};
    if (!formData.memberId) errors.memberId = 'Please select an assigned member.';
    if (!formData.planName.trim()) errors.planName = 'Workout plan name is required.';
    if (!formData.goal.trim()) errors.goal = 'Workout focus / goal is required.';
    formData.exercises.forEach((ex, idx) => {
      if (!ex.name.trim()) errors[`exercise_${idx}_name`] = 'Exercise name is required.';
      if (!ex.sets || Number(ex.sets) <= 0) errors[`exercise_${idx}_sets`] = 'Enter valid sets (>0).';
      if (!String(ex.reps).trim()) errors[`exercise_${idx}_reps`] = 'Enter reps (e.g. 10 or 10-12).';
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setNotice({ type: '', text: '' });

    const body = {
      title: formData.planName.trim(),
      targetMuscle: formData.targetMuscle,
      difficulty: formData.difficulty,
      goal: formData.goal.trim(),
      schedule: formData.schedule.trim(),
      exercises: formData.exercises.map((x) => ({
        name: x.name.trim(),
        sets: Number(x.sets),
        reps: String(x.reps).trim(),
        weightOrDifficulty: (x.weightOrDifficulty || '').trim() || null,
        notes: (x.notes || '').trim() || null,
      })),
    };

    const res = editingId
      ? await api.updateWorkout(editingId, body)
      : await api.createWorkout(body, formData.memberId);
    setIsSubmitting(false);

    if (res.success) {
      setNotice({
        type: 'info',
        text: `Workout plan "${res.data.title}" ${editingId ? 'updated' : `assigned to ${clientName(formData.memberId)}`} successfully.`,
      });
      setShowForm(false);
      resetForm();
      await loadAll();
    } else {
      setNotice({ type: 'error', text: res.status === 0 ? OFFLINE : res.error || 'Unable to save workout.' });
    }
  };

  const handleRemove = async (r) => {
    const who = memberOf(r) ? clientName(memberOf(r)) : 'the member';
    if (!window.confirm(`Remove the workout routine "${r.title}" assigned to ${who}?`)) return;
    const res = await api.deleteWorkout(r.id);
    if (res.success) {
      setNotice({ type: 'info', text: `Workout routine "${r.title}" removed.` });
      if (editingId === r.id) {
        setShowForm(false);
        resetForm();
      }
      await loadAll();
    } else {
      setNotice({ type: 'error', text: res.error || 'Could not remove the routine.' });
    }
  };

  const selectedClient = clients.find((c) => String(c.id) === String(formData.memberId));

  if (loading) return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading workout plans…</p>;

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>Workout Plans & Assignments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Design customized exercise regimens, sets, reps, and assign them directly to your coaching clients
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else openCreate();
          }}
          disabled={clients.length === 0}
        >
          {showForm ? 'Close Routine Form' : '+ Create & Assign Workout'}
        </button>
      </div>

      {notice.text && (
        <div className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'}`} style={{ marginBottom: '1.25rem' }}>
          {notice.text}
        </div>
      )}

      {clients.length === 0 && (
        <div className="notice-box notice-warning mb-3">
          <strong>No Assigned Members:</strong> You do not have any members assigned yet. The Admin must assign members to you
          (Trainers & Staff → Trainer-to-Member Assignment) before you can create a workout plan.
        </div>
      )}

      {showForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">{editingId ? 'Edit Prescribed Workout Plan' : 'Create & Assign New Workout Plan'}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Prescribe exercises, volume, and instructions for your assigned client
              </p>
            </div>
            {selectedClient && <span className="badge badge-blue">Assigning to: {selectedClient.name} (MEM-{selectedClient.id})</span>}
          </div>

          <form onSubmit={handleSave} noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Assigned Member *</label>
                <select
                  className="form-select"
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  disabled={editingId !== null}
                >
                  <option value="">-- Choose Assigned Member --</option>
                  {clients.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (MEM-{m.id}){m.plan ? ` — ${m.plan}` : ''}
                    </option>
                  ))}
                </select>
                {formErrors.memberId && <div className="form-error">{formErrors.memberId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Workout Plan Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Upper Body Hypertrophy & Core Conditioning"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  disabled={isSubmitting}
                />
                {formErrors.planName && <div className="form-error">{formErrors.planName}</div>}
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Workout Goal / Objective *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lean Muscle Hypertrophy & Core Stability"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  disabled={isSubmitting}
                />
                {formErrors.goal && <div className="form-error">{formErrors.goal}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Weekly Training Schedule</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4 Days / Week (Mon, Tue, Thu, Fri)"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Focus Area</label>
                <select
                  className="form-select"
                  value={formData.targetMuscle}
                  onChange={(e) => setFormData({ ...formData, targetMuscle: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="Upper Body Push & Core">Upper Body Push & Core</option>
                  <option value="Upper Body Pull & Arms">Upper Body Pull & Arms</option>
                  <option value="Lower Body / Legs">Lower Body / Legs</option>
                  <option value="Full Body Athletic Strength">Full Body Athletic Strength</option>
                  <option value="Cardio & Functional Agility">Cardio & Functional Agility</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: '260px' }}>
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="flex-between mb-1">
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Prescribed Exercises List *</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Specify exercise name, target sets, repetitions, optional weight, and form cues
                  </p>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addRow}>
                  + Add Exercise Row
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '0.65rem', alignItems: 'flex-start' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Exercise #{idx + 1} *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Barbell Flat Bench Press"
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_name`] && <div className="form-error">{formErrors[`exercise_${idx}_name`]}</div>}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Sets *</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="form-input"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_sets`] && <div className="form-error">{formErrors[`exercise_${idx}_sets`]}</div>}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Reps *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="10 or 10-12"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_reps`] && <div className="form-error">{formErrors[`exercise_${idx}_reps`]}</div>}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Weight / Intensity</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 75 kg or Moderate"
                          value={ex.weightOrDifficulty}
                          onChange={(e) => handleExerciseChange(idx, 'weightOrDifficulty', e.target.value)}
                        />
                      </div>
                      <div style={{ paddingTop: '1.45rem' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.45rem 0.65rem' }}
                          title="Remove Exercise Row"
                          onClick={() => removeRow(idx)}
                          disabled={formData.exercises.length <= 1}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Form notes & instructions (e.g. 2-sec eccentric pause, keep core braced)"
                        value={ex.notes}
                        onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Workout Assignment' : 'Assign Workout to Member'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">My Workout Routines</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Workouts you prescribed to your clients (saved in the database).
            </p>
          </div>
          <span className="badge badge-green">
            {routines.length} {routines.length === 1 ? 'Plan' : 'Plans'}
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Routine Title</th>
                <th>Assigned Member</th>
                <th>Goal / Focus</th>
                <th>Schedule</th>
                <th>Exercises</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routines.length > 0 ? (
                routines.map((r) => {
                  const mid = memberOf(r);
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>
                        <div>{r.title}</div>
                        <span className="badge badge-blue" style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>
                          {r.targetMuscle || '—'}
                        </span>
                      </td>
                      <td>
                        {mid ? (
                          <>
                            <strong style={{ color: 'var(--color-primary)' }}>{clientName(mid)}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>MEM-{mid}</div>
                          </>
                        ) : (
                          <span className="badge badge-warning">Not assigned</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>{r.goal || '—'}</td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{r.schedule || '—'}</td>
                      <td>
                        <span className="badge badge-green">{(r.exercises || []).length} Exercises</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemove(r)}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                      No workout routines created yet.
                    </p>
                    <p style={{ fontSize: '0.88rem', margin: 0 }}>
                      Click &quot;+ Create &amp; Assign Workout&quot; above to prescribe a training split for a client.
                    </p>
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

export default TrainerWorkouts;