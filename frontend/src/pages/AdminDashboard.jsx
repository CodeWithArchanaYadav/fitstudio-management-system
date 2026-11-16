import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/**
 * AdminDashboard Page
 * Main overview dashboard for gym administrators.
 * Renders within the shared DashboardLayout.
 */
function AdminDashboard() {
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeTrainers: 0,
    plansCount: 0,
    monthlyRevenue: 0,
  });
  const [recentMembers, setRecentMembers] = useState([]);

  // Refresh dashboard stats and the newest member registrations together.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [statsRes, membersRes] = await Promise.all([
        api.getDashboardStats(),
        api.getMembers(),
      ]);
      if (cancelled) return;
      if (statsRes.success && statsRes.data) {
        setStats((prev) => ({ ...prev, ...statsRes.data }));
      }
      if (membersRes.success && Array.isArray(membersRes.data)) {
        const newestFirst = [...membersRes.data].sort((a, b) => {
          const dateDifference = new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0);
          return dateDifference || Number(b.id) - Number(a.id);
        });
        setRecentMembers(newestFirst.slice(0, 5));
      }
    };
    load();
    const timer = setInterval(load, 10000);
    window.addEventListener('focus', load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener('focus', load);
    };
  }, []);

  return (
    <div>
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>FitStudio Facility & Management Controls</p>
      </header>

      {notice && (
        <div className="notice-box notice-warning">
          {notice}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Registered Members</div>
          <div className="stat-value">{stats.totalMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Trainers</div>
          <div className="stat-value">{stats.activeTrainers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Membership Plans</div>
          <div className="stat-value">{stats.plansCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Collections</div>
          <div className="stat-value">₹{stats.monthlyRevenue}</div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Recently Registered Members</h2>
          <Link to="/admin/members" className="btn btn-secondary btn-sm">View all members</Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.length ? recentMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.fullName || member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.plan || '—'}</td>
                  <td>{member.joinedDate || '—'}</td>
                  <td>{member.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No members registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        {/* Facility Status Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Facility Information & Operational Status</h2>
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
                  <td>Gym Floor & Resistance Racks</td>
                  <td><span className="badge badge-green">Operational</span></td>
                </tr>
                <tr>
                  <td>Cardio & Functional Turf Studio</td>
                  <td><span className="badge badge-green">Operational</span></td>
                </tr>
                <tr>
                  <td>Locker Rooms & Steam Recovery</td>
                  <td><span className="badge badge-green">Open</span></td>
                </tr>
                <tr>
                  <td>Front Desk Reception & POS</td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Administrative Tasks */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Administrative Tasks</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            Direct access to FitStudio administrative modules:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/members" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              👤 Manage Member Directory
            </Link>
            <Link to="/admin/trainers" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              🏋️ Staff Management & Trainer Assignments
            </Link>
            <Link to="/admin/plans" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              📋 Configure Membership Plans & Pricing (₹)
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Reports Card */}
      <div className="card mt-3">
        <div className="card-header">
          <h2 className="card-title">Basic Management Reports</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Standard operational metrics for gym administration and management reviews.
        </p>
        <div className="grid-2">
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Attendance & Membership Report</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Aggregates active vs expired memberships and visit frequencies across facility zones.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setNotice('Attendance reporting export will be enabled when backend reporting is connected.')}
            >
              Export Attendance Summary (CSV)
            </button>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Revenue & Dues Report</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Summary of completed transactions and pending renewal payments in Indian Rupees (₹).
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setNotice('Revenue export will be enabled when backend reporting is connected.')}
            >
              Export Revenue Summary (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
