import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * AdminDashboard Page
 * Main dashboard for gym administrators.
 * Includes sections for:
 * 1. Overview
 * 2. Members
 * 3. Staff Management (Receptionists & Trainers)
 * 4. Membership Plans
 * 5. Trainer Assignments
 * 6. Basic Reports
 */
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar
          role="admin"
          activeItem={activeTab}
          onSelect={(tabId) => {
            setActiveTab(tabId);
            setNotice('');
          }}
        />

        <main className="dashboard-main">
          {/* Dashboard Title Header */}
          <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>FitStudio Facility & Management Controls</p>
          </header>

          {notice && (
            <div className="notice-box notice-warning">
              {notice}
            </div>
          )}

          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid-4 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Registered Members</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Trainers</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Membership Plans</div>
                  <div className="stat-value">3</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Monthly Collections</div>
                  <div className="stat-value">₹0</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Facility Information</h2>
                  </div>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Facility Area</th>
                          <th>Operational Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Gym Floor & Equipment</td>
                          <td><span className="badge badge-green">Operational</span></td>
                        </tr>
                        <tr>
                          <td>Cardio & Aerobics Studio</td>
                          <td><span className="badge badge-green">Operational</span></td>
                        </tr>
                        <tr>
                          <td>Locker Rooms & Steam Room</td>
                          <td><span className="badge badge-green">Open</span></td>
                        </tr>
                        <tr>
                          <td>Front Reception Desk</td>
                          <td><span className="badge badge-green">Active</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Quick Administrative Tasks</h2>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                    Select a management module to administer gym operations:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('staff')}>
                      Manage Receptionists & Trainers
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('assignments')}>
                      Assign Trainers to Members
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('reports')}>
                      Generate Facility Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Members Management Tab */}
          {activeTab === 'members' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Member Directory</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                View registered gym members and account statuses.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                        No members found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Staff Management Tab */}
          {activeTab === 'staff' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Staff Management (Receptionists & Trainers)</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setNotice('Unable to add receptionist at this time. Please try again later.')}
                  >
                    + Add Receptionist
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setNotice('Unable to add trainer at this time. Please try again later.')}
                  >
                    + Add Trainer
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Administer receptionist staff and certified personal trainer accounts.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Contact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                        No staff records found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Membership Plans Tab */}
          {activeTab === 'plans' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Membership Plans Configuration</h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setNotice('Unable to create plan at this time. Please try again later.')}
                >
                  + Create New Plan
                </button>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Administer gym pricing tiers, durations, and access privileges.
              </p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Duration</th>
                      <th>Fee (₹)</th>
                      <th>Facility Access</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Gym Plan</td>
                      <td>30 Days</td>
                      <td>₹1,500</td>
                      <td>Gym Floor, Locker Rooms</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                    <tr>
                      <td>Standard Pro Plan</td>
                      <td>30 Days</td>
                      <td>₹3,000</td>
                      <td>Full Facility, Group Classes, Sauna</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                    <tr>
                      <td>Premium Elite Plan</td>
                      <td>30 Days</td>
                      <td>₹5,000</td>
                      <td>Full Facility, Personal Trainer, VIP Perks</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Trainer Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Trainer-to-Member Assignments</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Assign certified personal trainers to registered members.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice('Unable to save trainer assignment at this time. Please try again later.');
                }}
                style={{ maxWidth: '500px', marginBottom: '2rem' }}
              >
                <div className="form-group">
                  <label htmlFor="member-select" className="form-label">Select Member</label>
                  <select id="member-select" className="form-select">
                    <option value="">Select a member</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="trainer-select" className="form-label">Select Trainer</label>
                  <select id="trainer-select" className="form-select">
                    <option value="">Select a personal trainer</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Assignment
                </button>
              </form>
            </div>
          )}

          {/* 6. Basic Reports Tab */}
          {activeTab === 'reports' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Basic Management Reports</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Standard operational metrics for gym administration.
              </p>
              <div className="grid-2">
                <div className="card" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Attendance & Membership Report</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    Aggregates active vs expired memberships and visit frequencies.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setNotice('Report generation is currently unavailable. Please try again later.')}
                  >
                    Export Attendance Summary (CSV)
                  </button>
                </div>
                <div className="card" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Revenue & Dues Report</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    Summary of completed transactions and pending renewal payments in Indian Rupees (₹).
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setNotice('Report generation is currently unavailable. Please try again later.')}
                  >
                    Export Revenue Summary (CSV)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
