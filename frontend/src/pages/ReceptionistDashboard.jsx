import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ReceptionistDashboard Page
 * Front desk operations overview for FitStudio reception staff.
 * Coordinates member registration, trainer assignments, attendance check-ins, renewals, and payments.
 * Renders within the shared DashboardLayout.
 */
function ReceptionistDashboard() {
  return (
    <div>
      <header className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <p>Front Desk Member Management, Check-Ins, Trainer Assignments & Billing</p>
      </header>

      {/* Development Prototype Notice */}
      <div className="notice-box mb-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <strong>Frontend Development Stage:</strong> Front desk operational workflows are active for testing and review. Live Spring Boot database persistence and payment processing will be connected during backend integration.
      </div>

      {/* Front Desk Metric Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Today's Check-Ins</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Members</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Expiring This Week</div>
          <div className="stat-value">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Trainers</div>
          <div className="stat-value">2</div>
        </div>
      </div>

      {/* Quick Action Modules */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Front Desk Operations & Workflows</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Select an operational module to perform daily front desk responsibilities:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <Link to="/receptionist/members" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>👤 Member Management</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Offline registrations, directory & contact updates
              </div>
            </div>
          </Link>

          <Link to="/receptionist/trainers" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>🏋️ Trainer Management</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Add trainers & assign members to coaches
              </div>
            </div>
          </Link>

          <Link to="/receptionist/attendance" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>⏱️ Daily Attendance</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Member lookup, barcode/ID check-in & logs
              </div>
            </div>
          </Link>

          <Link to="/receptionist/memberships" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>📋 Subscriptions & Renewals</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Enroll members using Admin-approved plans
              </div>
            </div>
          </Link>

          <Link to="/receptionist/payments" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>💳 Payments & Invoicing</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Record walk-in fees, Cash/UPI/Card receipts
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Front Desk Shift Information */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Front Desk Operations Guidelines</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            <li>• <strong>Offline Member Registration:</strong> Record member details and select an Admin plan. Login credentials and temporary password setup links are sent to the member's email.</li>
            <li>• <strong>Trainer Assignments:</strong> Assign eligible Standard & Premium members to certified coaches based on their training goals.</li>
            <li>• <strong>Check-In Verification:</strong> Ensure member pass is Active before logging facility entry. Prompt expired members to renew pass.</li>
            <li>• <strong>Plan Templates:</strong> All membership prices and durations are configured exclusively by Gym Admin.</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Today's Front Desk Activity</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Member / Visitor</th>
                  <th>Activity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No front desk check-ins recorded yet today. Check-ins logged at the Attendance page will reflect here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
