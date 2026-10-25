import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Workouts Page
 * Interface for viewing and designing workout routines.
 * Clean form and table layout with graceful error handling.
 */
function Workouts() {
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetMuscle: 'Full Body',
    difficulty: 'Beginner',
    exercises: '',
  });
  const [notice, setNotice] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoutineSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setNotice('Validation Error: Please provide a routine title.');
      return;
    }
    // Graceful error notification when backend is unavailable
    setNotice('Unable to save workout routine at this time. Please try again later.');
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Workout Plans & Exercise Routines
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Design personal workout schedules, sets, and fitness regimens
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/trainer" className="btn btn-secondary btn-sm">
              ← Back to Dashboard
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setShowRoutineForm(!showRoutineForm);
                setNotice('');
              }}
            >
              {showRoutineForm ? 'Close Routine Form' : '+ Create Routine'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="notice-box notice-warning">
            {notice}
          </div>
        )}

        {/* Workout Creation Form */}
        {showRoutineForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">Design Workout Routine</h2>
            </div>
            <form onSubmit={handleRoutineSubmit}>
              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="routine-title" className="form-label">Routine Title</label>
                  <input
                    id="routine-title"
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g. Chest & Triceps Hypertrophy"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="routine-target" className="form-label">Target Focus</label>
                  <select
                    id="routine-target"
                    name="targetMuscle"
                    className="form-select"
                    value={formData.targetMuscle}
                    onChange={handleInputChange}
                  >
                    <option value="Full Body">Full Body</option>
                    <option value="Upper Body">Upper Body</option>
                    <option value="Lower Body / Legs">Lower Body / Legs</option>
                    <option value="Core & Cardio">Core & Cardio</option>
                    <option value="Strength Powerlifting">Strength Powerlifting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="routine-diff" className="form-label">Difficulty Level</label>
                  <select
                    id="routine-diff"
                    name="difficulty"
                    className="form-select"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="routine-exercises" className="form-label">Exercise List & Sets (comma separated)</label>
                <textarea
                  id="routine-exercises"
                  name="exercises"
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Barbell Bench Press (4x10), Incline Dumbbell Press (3x12), Cable Tricep Pushdown (3x15)"
                  value={formData.exercises}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  Save Routine
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRoutineForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workout Routines Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Workout Routines</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Routine Name</th>
                  <th>Target Muscle</th>
                  <th>Level</th>
                  <th>Exercise Count</th>
                  <th>Assigned Clients</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No workout routines found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Workouts;
