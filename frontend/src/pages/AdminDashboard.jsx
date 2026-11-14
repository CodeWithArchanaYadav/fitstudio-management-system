import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/**
 * AdminDashboard Page
 * Central executive overview for gym administrators.
 * Displays facility status, live member counts, and administrative quick actions.
 * Renders within the shared DashboardLayout.
 */
function AdminDashboard() {
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    activeTrainers: 0,
    plansCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load live numbers from the backend
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const res = await api.getDashboardStats();
      if (!cancelled) {
        if (res.success && res.data) {
          setStats((prev) => ({ ...prev, ...res.data }));
        }
        setLoading(false);
      }
    };
    load();
    const timer = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Facility status, membership counts, and administrative controls</p>
      </header>

      {notice && (
        <div className="notice-box notice-warning mb-3">
          {notice}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{loading ? '—' : stats.totalMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Members</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {loading ? '—' : stats.activeMembers}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Trainers</div>
          <div className="stat-value">{loading ? '—' : stats.activeTrainers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Membership Plans</div>
          <div className="stat-value">{loading ? '—' : stats.plansCount}</div>
        </div>
      </div>

      <div className="grid-2 mb-3">
        {/* Quick Administrative Tasks */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Administrative Modules</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Direct access to core gym management operations:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/admin/members"
              className="btn btn-secondary"
              style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Member Directory</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                  Register members, assign plans, and update profiles
                </div>
              </div>
            </Link>
            <Link
              to="/admin/trainers"
              className="btn btn-secondary"
              style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Staff & Trainer Management</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                  Create staff accounts, assign trainers, and manage facility shifts
                </div>
              </div>
            </Link>
            <Link
              to="/admin/plans"
              className="btn btn-secondary"
              style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Membership Plans & Pricing</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                  Configure tiers, subscription duration, pricing (₹), and benefits
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Facility Status Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Facility Information & Operational Status</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Current operating state of FitStudio facility zones:
          </p>
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
                  <td>Front Desk Reception & Check-In</td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Operational Reports Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Management Reports</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Operational metrics for facility oversight and periodic administration reviews:
        </p>
        <div className="grid-2">
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Attendance & Visit Summary
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Summary of daily member check-in frequency and facility area utilization.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setNotice('Attendance reporting export will be enabled when backend reporting service is connected.')}
            >
              Export Attendance Summary (CSV)
            </button>
          </div>
          <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginBottom: 0 }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Membership Plan Distribution
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Breakdown of active subscriptions and renewal status across membership tiers.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setNotice('Membership distribution export will be enabled when backend reporting service is connected.')}
            >
              Export Membership Summary (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
