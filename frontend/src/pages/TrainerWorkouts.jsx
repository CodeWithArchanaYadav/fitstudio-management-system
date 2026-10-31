import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGymData } from '../services/gymData';

/**
 * TrainerWorkouts Page
 * Interface for certified personal trainers to design, customize, and assign workout routines.
 * Directly connected to the shared FitStudio data layer.
 * Accessible at /trainer/workouts under DashboardLayout.
 */
function TrainerWorkouts() {
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get('memberId');

  const {
    activeTrainer,
    assignedMembers,
    trainerWorkouts,
    saveWorkoutPlan,
    deleteWorkoutPlan,
  } = useGymData();

  const preselectedWorkout = preselectedMemberId
    ? trainerWorkouts.find((w) => w.memberId === preselectedMemberId)
    : null;

  const [showForm, setShowForm] = useState(() => Boolean(preselectedMemberId));
  const [editingWorkoutId, setEditingWorkoutId] = useState(() => (preselectedWorkout ? preselectedWorkout.id : null));
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state initialized with preselected workout/member if present
  const [formData, setFormData] = useState(() => {
    if (preselectedWorkout) {
      return {
        memberId: preselectedWorkout.memberId,
        planName: preselectedWorkout.planName,
        goal: preselectedWorkout.goal || '',
        schedule: preselectedWorkout.schedule || '4 Days / Week',
        targetMuscle: preselectedWorkout.targetMuscle || 'Upper Body Push & Core',
        difficulty: preselectedWorkout.difficulty || 'Intermediate',
        exercises: preselectedWorkout.exercises && preselectedWorkout.exercises.length > 0
          ? preselectedWorkout.exercises.map((ex) => ({
              name: ex.name || '',
              sets: ex.sets || 3,
              reps: ex.reps || 10,
              weightOrDifficulty: ex.weightOrDifficulty || '',
              notes: ex.notes || '',
            }))
          : [{ name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' }],
      };
    }
    return {
      memberId: preselectedMemberId || assignedMembers[0]?.id || '',
      planName: '',
      goal: '',
      schedule: '4 Days / Week (Monday, Tuesday, Thursday, Friday)',
      targetMuscle: 'Upper Body Push & Core',
      difficulty: 'Intermediate',
      exercises: [
        { name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' },
      ],
    };
  });
  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setFormData({
      memberId: assignedMembers[0]?.id || '',
      planName: '',
      goal: '',
      schedule: '4 Days / Week (Monday, Tuesday, Thursday, Friday)',
      targetMuscle: 'Upper Body Push & Core',
      difficulty: 'Intermediate',
      exercises: [
        { name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' },
      ],
    });
    setFormErrors({});
    setEditingWorkoutId(null);
  };

  const handleOpenCreate = (targetMemberId = '') => {
    resetForm();
    if (targetMemberId) {
      setFormData((prev) => ({ ...prev, memberId: targetMemberId }));
    } else if (assignedMembers.length > 0) {
      setFormData((prev) => ({ ...prev, memberId: assignedMembers[0].id }));
    }
    setShowForm(true);
    setNotice({ type: '', text: '' });
  };

  const handleOpenEdit = (workout) => {
    setEditingWorkoutId(workout.id);
    setFormData({
      memberId: workout.memberId,
      planName: workout.planName,
      goal: workout.goal || '',
      schedule: workout.schedule || '4 Days / Week',
      targetMuscle: workout.targetMuscle || 'Upper Body Push & Core',
      difficulty: workout.difficulty || 'Intermediate',
      exercises: workout.exercises && workout.exercises.length > 0
        ? workout.exercises.map((ex) => ({
            name: ex.name || '',
            sets: ex.sets || 3,
            reps: ex.reps || 10,
            weightOrDifficulty: ex.weightOrDifficulty || '',
            notes: ex.notes || '',
          }))
        : [{ name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' }],
    });
    setFormErrors({});
    setShowForm(true);
    setNotice({ type: '', text: '' });
  };

  // Exercise Row Handlers
  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index][field] = value;
    setFormData({ ...formData, exercises: updated });

    if (formErrors[`exercise_${index}_${field}`]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[`exercise_${index}_${field}`];
      setFormErrors(updatedErrors);
    }
  };

  const handleAddExerciseRow = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { name: '', sets: 3, reps: '10-12', weightOrDifficulty: '', notes: '' },
      ],
    });
  };

  const handleRemoveExerciseRow = (index) => {
    if (formData.exercises.length <= 1) return;
    const updated = formData.exercises.filter((_, idx) => idx !== index);
    setFormData({ ...formData, exercises: updated });
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.memberId) {
      errors.memberId = 'Please select an assigned member.';
    }
    if (!formData.planName.trim()) {
      errors.planName = 'Workout plan name is required.';
    }
    if (!formData.goal.trim()) {
      errors.goal = 'Workout focus / goal is required.';
    }

    if (!formData.exercises || formData.exercises.length === 0) {
      errors.exercises = 'At least one exercise is required.';
    } else {
      formData.exercises.forEach((ex, idx) => {
        if (!ex.name.trim()) {
          errors[`exercise_${idx}_name`] = 'Exercise name is required.';
        }
        if (!ex.sets || Number(ex.sets) <= 0) {
          errors[`exercise_${idx}_sets`] = 'Enter valid sets (>0).';
        }
        if (!ex.reps || String(ex.reps).trim() === '') {
          errors[`exercise_${idx}_reps`] = 'Enter reps (e.g. 10 or 10-12).';
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAndAssign = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setNotice({ type: '', text: '' });

    try {
      const selectedMember = assignedMembers.find((m) => m.id === formData.memberId);
      const savedRecord = saveWorkoutPlan({
        id: editingWorkoutId,
        planName: formData.planName,
        memberId: formData.memberId,
        trainerId: activeTrainer.id,
        goal: formData.goal,
        schedule: formData.schedule,
        targetMuscle: formData.targetMuscle,
        difficulty: formData.difficulty,
        exercises: formData.exercises,
      });

      setShowForm(false);
      resetForm();
      setNotice({
        type: 'info',
        text: `Workout plan "${savedRecord.planName}" assigned to ${selectedMember?.fullName || formData.memberId} successfully. The member's My Workouts page now reflects this regimen.`,
      });
    } catch (err) {
      setNotice({
        type: 'error',
        text: err.message || 'Unable to save workout assignment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveWorkout = (workoutId, planName, memberName) => {
    if (window.confirm(`Are you sure you want to remove the workout routine "${planName}" assigned to ${memberName}?`)) {
      deleteWorkoutPlan(workoutId);
      setNotice({
        type: 'info',
        text: `Workout routine "${planName}" removed from ${memberName}. Their Member dashboard will now show the unassigned empty state.`,
      });
      if (editingWorkoutId === workoutId) {
        setShowForm(false);
        resetForm();
      }
    }
  };

  const currentSelectedMember = assignedMembers.find((m) => m.id === formData.memberId);

  return (
    <div>
      {/* Prototype Coach Selector Banner */}
      <div className="card mb-3" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Coach View:
            </span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {activeTrainer ? `${activeTrainer.name} (${activeTrainer.id})` : 'Coach'}
            </strong>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              {activeTrainer?.specialization}
            </span>
          </div>


        </div>
      </div>

      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Workout Plans & Assignments
          </h1>
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
            } else {
              handleOpenCreate();
            }
          }}
          disabled={assignedMembers.length === 0}
        >
          {showForm ? 'Close Routine Form' : '+ Create & Assign Workout'}
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

      {/* Warning when Trainer has no assigned members */}
      {assignedMembers.length === 0 && (
        <div className="notice-box notice-warning mb-3">
          <strong>No Assigned Members:</strong> You do not currently have any members assigned to your coaching roster. An Admin or Receptionist must assign a member to Coach {activeTrainer?.name} before you can create and assign a workout regimen.
        </div>
      )}

      {/* Routine Creation / Assignment Form */}
      {showForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">
                {editingWorkoutId ? 'Edit Prescribed Workout Plan' : 'Create & Assign New Workout Plan'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Prescribe exercises, volume, and instructions for your assigned client
              </p>
            </div>
            {currentSelectedMember && (
              <span className="badge badge-blue">
                Assigning to: {currentSelectedMember.fullName} ({currentSelectedMember.id})
              </span>
            )}
          </div>

          <form onSubmit={handleSaveAndAssign} noValidate>
            {/* Target Member Selection & Plan Info */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Assigned Member *</label>
                <select
                  className="form-select"
                  value={formData.memberId}
                  onChange={(e) => {
                    setFormData({ ...formData, memberId: e.target.value });
                    if (formErrors.memberId) {
                      const upd = { ...formErrors };
                      delete upd.memberId;
                      setFormErrors(upd);
                    }
                  }}
                  disabled={editingWorkoutId !== null}
                >
                  <option value="">-- Choose Assigned Member --</option>
                  {assignedMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id}) — {m.plan}
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
                  onChange={(e) => {
                    setFormData({ ...formData, planName: e.target.value });
                    if (formErrors.planName) {
                      const upd = { ...formErrors };
                      delete upd.planName;
                      setFormErrors(upd);
                    }
                  }}
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
                  onChange={(e) => {
                    setFormData({ ...formData, goal: e.target.value });
                    if (formErrors.goal) {
                      const upd = { ...formErrors };
                      delete upd.goal;
                      setFormErrors(upd);
                    }
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.goal && <div className="form-error">{formErrors.goal}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Weekly Training Schedule *</label>
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

            {/* Prescribed Exercises Section */}
            <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="flex-between mb-1">
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Prescribed Exercises List *</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Specify exercise name, target sets, repetitions, optional weight, and form cues
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddExerciseRow}
                >
                  + Add Exercise Row
                </button>
              </div>

              {formErrors.exercises && <div className="form-error mb-2">{formErrors.exercises}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem',
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '0.65rem', alignItems: 'flex-start' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Exercise #{idx + 1} *
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Barbell Flat Bench Press"
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_name`] && (
                          <div className="form-error">{formErrors[`exercise_${idx}_name`]}</div>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Sets *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="form-input"
                          placeholder="4"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_sets`] && (
                          <div className="form-error">{formErrors[`exercise_${idx}_sets`]}</div>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Reps *
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="10 or 10-12"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        />
                        {formErrors[`exercise_${idx}_reps`] && (
                          <div className="form-error">{formErrors[`exercise_${idx}_reps`]}</div>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Weight / Intensity
                        </label>
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
                          onClick={() => handleRemoveExerciseRow(idx)}
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
                        placeholder="Form notes & instructions (e.g. 2-sec eccentric pause, explosive drive, keep core braced)"
                        value={ex.notes}
                        onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingWorkoutId ? 'Update Workout Assignment' : 'Assign Workout to Member'}
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

      {/* Available Workout Routines Assigned by This Trainer */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Assigned Routines for Coach {activeTrainer?.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Workouts prescribed to your clients. Edits or removals immediately update the member's view.
            </p>
          </div>
          <span className="badge badge-green">
            {trainerWorkouts.length} {trainerWorkouts.length === 1 ? 'Plan Assigned' : 'Plans Assigned'}
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
                <th>Exercises Prescribed</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainerWorkouts.length > 0 ? (
                trainerWorkouts.map((workout) => (
                  <tr key={workout.id}>
                    <td style={{ fontWeight: 600 }}>
                      <div>{workout.planName}</div>
                      <span className="badge badge-blue" style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>
                        {workout.targetMuscle}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-primary)' }}>{workout.memberName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{workout.memberId}</div>
                    </td>
                    <td style={{ fontSize: '0.88rem' }}>{workout.goal}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{workout.schedule}</td>
                    <td>
                      <span className="badge badge-green">
                        {workout.exercises ? workout.exercises.length : 0} Exercises
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{workout.updatedDate || workout.assignedDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(workout)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveWorkout(workout.id, workout.planName, workout.memberName)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                      <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                        No workout routines currently assigned by Coach {activeTrainer?.name}.
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        Click "+ Create & Assign Workout" above to prescribe a customized training split for an assigned member.
                      </p>
                    </div>
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
