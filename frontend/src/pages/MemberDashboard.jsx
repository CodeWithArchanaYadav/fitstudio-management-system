import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { apiRequest } from '../api';

function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [membership, setMembership] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'membership') {
      setMembershipLoading(true);
      apiRequest('/me/membership').then(setMembership).catch(() => {}).finally(() => setMembershipLoading(false));
    }
    if (activeTab === 'overview' || activeTab === 'trainer') {
      setTrainerLoading(true);
      apiRequest('/me/trainer').then(setTrainer).catch(() => {}).finally(() => setTrainerLoading(false));
    }
    if (activeTab === 'workouts') {
      setWorkoutsLoading(true);
      apiRequest('/me/workouts').then(setWorkouts).catch(() => {}).finally(() => setWorkoutsLoading(false));
    }
  }, [activeTab]);

  const daysRemaining = () => {
    if (!membership || !membership.expiryDate) return '—';
    const diff = Math.ceil((new Date(membership.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar
          role="member"
          activeItem={activeTab}
          onSelect={(tabId) => setActiveTab(tabId)}
        />

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Member Dashboard</h1>
            <p>Your FitStudio Membership &amp; Fitness Plan</p>
          </header>

          {activeTab === 'overview' && (
            <div>
              <div className="grid-3 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Membership Status</div>
                  <div className="stat-value">
                    {membershipLoading ? '…' : (membership ? (membership.status || 'Active') : 'None')}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Days Remaining</div>
                  <div className="stat-value">{membershipLoading ? '…' : daysRemaining()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Assigned Trainer</div>
                  <div className="stat-value">
                    {trainerLoading ? '…' : (trainer ? (trainer.name || trainer.fullName) : 'None')}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">My Fitness Dashboard</h2>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  Quick links to your membership details, assigned trainer, routine logs, and payment receipts:
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('membership')}>
                    Check Membership Status
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('trainer')}>
                    View Assigned Trainer
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('workouts')}>
                    Today's Workout
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('payments')}>
                    View Invoices &amp; Receipts
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Membership Plan</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Your current active plan details, validity dates, and renewal options.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Plan Type</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>Access Tier</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membershipLoading ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : !membership ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No active membership plan found.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>{membership.planName || membership.plan || '—'}</td>
                        <td>{membership.startDate || '—'}</td>
                        <td>{membership.expiryDate || membership.endDate || '—'}</td>
                        <td>{membership.accessTier || membership.tier || '—'}</td>
                        <td>
                          <span className={`badge ${membership.status === 'ACTIVE' || membership.active ? 'badge-green' : 'badge-gray'}`}>
                            {membership.status || (membership.active ? 'Active' : 'Expired')}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'trainer' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Assigned Trainer</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Personal trainer assigned by gym administration for your coaching.
              </p>
              {trainerLoading ? (
                <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
              ) : !trainer ? (
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    No trainer currently assigned. Please contact the front desk.
                  </p>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }}>
                  <p><strong>Name:</strong> {trainer.name || trainer.fullName}</p>
                  {trainer.email && <p><strong>Email:</strong> {trainer.email}</p>}
                  {trainer.specialization && <p><strong>Specialization:</strong> {trainer.specialization}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Assigned Workouts</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Personalized routines prescribed by your gym trainer.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Day / Routine</th>
                      <th>Target Focus</th>
                      <th>Exercises</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutsLoading ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : workouts.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No workout routines assigned yet.
                        </td>
                      </tr>
                    ) : workouts.map((w) => (
                      <tr key={w.id}>
                        <td>{w.title || w.name || w.day}</td>
                        <td>{w.targetMuscle || w.goal || '—'}</td>
                        <td>{w.exercises || w.exerciseCount || '—'}</td>
                        <td>
                          <span className={`badge ${w.completed ? 'badge-green' : 'badge-gray'}`}>
                            {w.completed ? 'Done' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Payment History &amp; Receipts</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Past invoices, subscription payments, and receipt downloads in Indian Rupees (₹).
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoice ID</th>
                      <th>Description</th>
                      <th>Amount (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No payment transactions found.
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

export default MemberDashboard;
