import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * ReceptionistDashboard Page
 * Front desk operations dashboard for FitStudio.
 * Sections:
 * 1. Overview
 * 2. Members
 * 3. Memberships
 * 4. Payments
 * 5. Trainer Information
 */
function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar
          role="receptionist"
          activeItem={activeTab}
          onSelect={(tabId) => {
            setActiveTab(tabId);
            setNotice('');
          }}
        />

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Receptionist Dashboard</h1>
            <p>Front Desk Member Check-Ins, Registrations & Billing</p>
          </header>

          {notice && (
            <div className="notice-box notice-warning">
              {notice}
            </div>
          )}

          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid-4 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Today's Check-Ins</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Members</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Expiring This Week</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Today's Collections</div>
                  <div className="stat-value">₹0</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Front Desk Quick Actions</h2>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                  Perform daily reception workflows using the modules below:
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('members')}>
                    Member Check-In & Lookup
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('memberships')}>
                    Renew Membership
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('payments')}>
                    Record Walk-In Payment
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('trainers')}>
                    View Trainer Shifts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Members Tab */}
          {activeTab === 'members' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Member Lookup & Check-In</h2>
              </div>
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label htmlFor="member-search" className="form-label">Search Member by Name or ID</label>
                <input
                  id="member-search"
                  type="text"
                  className="form-input"
                  placeholder="Enter name, phone, or member ID..."
                />
                <span className="form-help">Search member by name, phone number, or ID.</span>
              </div>
              <div className="table-container mt-2">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Plan Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No members found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Memberships Tab */}
          {activeTab === 'memberships' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Membership Renewals & Subscriptions</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Assist walk-in members with purchasing or extending gym passes.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Duration</th>
                      <th>Fee (₹)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Gym Plan</td>
                      <td>30 Days</td>
                      <td>₹1,500</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Standard Pro Plan</td>
                      <td>30 Days</td>
                      <td>₹3,000</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Premium Elite Plan</td>
                      <td>30 Days</td>
                      <td>₹5,000</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Payments Tab */}
          {activeTab === 'payments' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Front Desk Billing & Receipts</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Issue receipts and record cash/POS/UPI payments.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Receipt #</th>
                      <th>Member</th>
                      <th>Amount (₹)</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No transactions recorded.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Trainer Information Tab */}
          {activeTab === 'trainers' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Trainer Availability & Info</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Check available personal trainers on the gym floor for walk-in consultations.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Trainer Name</th>
                      <th>Specialization</th>
                      <th>Floor Shift</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No trainer records available.
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

export default ReceptionistDashboard;
