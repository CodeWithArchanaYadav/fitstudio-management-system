import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * MemberDashboard Page
 * Member portal for tracking gym membership, workout regimens, trainer, and payments.
 * Sections:
 * 1. Overview
 * 2. My Membership
 * 3. My Trainer
 * 4. My Workouts
 * 5. Payment History
 */
function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
            <p>Your FitStudio Membership & Fitness Plan</p>
          </header>

          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid-3 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Membership Status</div>
                  <div className="stat-value">Active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Days Remaining</div>
                  <div className="stat-value">30</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Assigned Trainer</div>
                  <div className="stat-value">None</div>
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
                    View Invoices & Receipts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. My Membership Tab */}
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
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No active membership plan found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. My Trainer Tab */}
          {activeTab === 'trainer' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Assigned Trainer</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Personal trainer assigned by gym administration for your coaching.
              </p>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  No trainer currently assigned. Please contact the front desk.
                </p>
              </div>
            </div>
          )}

          {/* 4. My Workouts Tab */}
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
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No workout routines assigned yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Payment History Tab */}
          {activeTab === 'payments' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Payment History & Receipts</h2>
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
