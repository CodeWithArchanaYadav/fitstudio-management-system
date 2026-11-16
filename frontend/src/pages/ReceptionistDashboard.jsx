import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/** Format ISO timestamp to local readable time */
function formatTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

/**
 * ReceptionistDashboard Page
 * Front desk operations overview for FitStudio reception staff.
 * Coordinates member registration, trainer assignments, attendance check-ins, renewals, and payments.
 * Renders within the shared DashboardLayout.
 */
function ReceptionistDashboard() {
  const [stats, setStats] = useState({
    todayCheckins: 0,
    activeMembers: 0,
    expiringThisWeek: 0,
    availableTrainers: 0,
  });
  const [todayCheckins, setTodayCheckins] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const [statsRes, checkinsRes, membersRes, staffRes] = await Promise.all([
        api.getDashboardStats(),
        api.getTodayCheckins(),
        api.getMembers(),
        api.getTrainers(),
      ]);

      if (cancelled) return;

      const newStats = {
        todayCheckins: 0,
        activeMembers: 0,
        expiringThisWeek: 0,
        availableTrainers: 0,
      };

      if (statsRes.success && statsRes.data) {
        newStats.todayCheckins = statsRes.data.todayCheckins ?? 0;
        newStats.activeMembers = statsRes.data.activeMembers ?? 0;
        newStats.expiringThisWeek = statsRes.data.expiringThisWeek ?? 0;
      }

      if (checkinsRes.success && Array.isArray(checkinsRes.data)) {
        setTodayCheckins(checkinsRes.data);
        if (!statsRes.success) {
          newStats.todayCheckins = checkinsRes.data.length;
        }
      }

      if (membersRes.success && Array.isArray(membersRes.data)) {
        setMembers(membersRes.data);
      }

      if (staffRes.success && Array.isArray(staffRes.data)) {
        newStats.availableTrainers = staffRes.data.filter((t) => t.status === 'Active').length;
      }

      setStats(newStats);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const getMemberName = (memberId) => {
    const found = members.find((m) => m.id === memberId);
    return found ? found.name || found.fullName : `Member #${memberId}`;
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <p>Front desk operations, daily check-ins, member registrations, and billing</p>
      </header>

      {/* Front Desk Metric Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-label">Today's Check-Ins</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {loading ? '—' : stats.todayCheckins}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Members</div>
          <div className="stat-value">{loading ? '—' : stats.activeMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Expiring This Week</div>
          <div className="stat-value" style={{ color: stats.expiringThisWeek > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
            {loading ? '—' : stats.expiringThisWeek}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Trainers</div>
          <div className="stat-value">{loading ? '—' : stats.availableTrainers}</div>
        </div>
      </div>

      {/* Quick Action Modules */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">Front Desk Operations & Workflows</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Select an operational module to perform front desk responsibilities:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <Link
            to="/receptionist/attendance"
            className="btn btn-secondary"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Daily Attendance</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Lookup members and record entry timestamps
              </div>
            </div>
          </Link>

          <Link
            to="/receptionist/members"
            className="btn btn-secondary"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Member Directory</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Offline registrations, directory & contact updates
              </div>
            </div>
          </Link>

          <Link
            to="/receptionist/trainers"
            className="btn btn-secondary"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Trainer Assignments</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Assign registered members to certified coaches
              </div>
            </div>
          </Link>

          <Link
            to="/receptionist/memberships"
            className="btn btn-secondary"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Subscriptions & Renewals</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Enroll members using Admin-approved plan tiers
              </div>
            </div>
          </Link>

          <Link
            to="/receptionist/payments"
            className="btn btn-secondary"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Payments & Invoicing</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Record membership receipts across Cash, UPI & Card
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Front Desk Shift Information & Live Check-ins */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Front Desk Operational Guidelines</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            <li>• <strong>Member Registration:</strong> Record member profile details and assign an Admin plan. Member login credentials are automatically provisioned.</li>
            <li>• <strong>Check-In Verification:</strong> Ensure member membership is Active before recording entry. Expired memberships require renewal prior to gym floor admission.</li>
            <li>• <strong>Personal Trainer Assignments:</strong> Connect eligible members with certified trainers matching their training goals.</li>
            <li>• <strong>Payment Invoicing:</strong> Issue itemized payment receipts for all offline membership fee collections.</li>
          </ul>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Today's Check-In Activity</h2>
            <Link to="/receptionist/attendance" className="btn btn-secondary btn-sm">
              Open Attendance
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Check-In Time</th>
                  <th>Member Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayCheckins.length > 0 ? (
                  todayCheckins.slice(0, 5).map((c) => (
                    <tr key={c.id || c.checkInTime}>
                      <td style={{ fontWeight: 500 }}>{formatTime(c.checkInTime)}</td>
                      <td>{getMemberName(c.memberId)}</td>
                      <td><span className="badge badge-green">Checked In</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                      No check-ins recorded yet today. Check-ins logged via the Attendance module will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
