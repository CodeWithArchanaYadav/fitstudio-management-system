import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * TrainerDashboard Page
 * Personal trainer interface for managing clients, workouts, and sessions.
 * Sections:
 * 1. Overview
 * 2. Assigned Members
 * 3. Workouts
 * 4. Schedule
 */
function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

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
            <p>Client Workouts, Progress & Training Sessions</p>
          </header>

          {notice && (
            <div className="notice-box notice-warning">
              {notice}
            </div>
          )}

          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid-3 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Assigned Clients</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Today's Sessions</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Workout Plans</div>
                  <div className="stat-value">0</div>
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

          {/* 2. Assigned Members Tab */}
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
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No assigned clients found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Workouts Tab */}
          {activeTab === 'workouts' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Workout Plans & Routines</h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setNotice('Unable to create workout routine at this time. Please try again later.')}
                >
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
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No workout routines found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Training Schedule & Sessions</h2>
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
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No sessions scheduled for this week.
                      </td>
                    </tr>
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
