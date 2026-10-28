import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { apiRequest } from '../api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview') {
      apiRequest('/dashboard/stats').then(setStats).catch(() => {});
      apiRequest('/dashboard/attendance').then(setAttendance).catch(() => {});
    }
    if (activeTab === 'staff') {
      setStaffLoading(true);
      apiRequest('/staff').then(setStaff).catch(() => setNotice('Failed to load staff.')).finally(() => setStaffLoading(false));
    }
    if (activeTab === 'members') {
      setMembersLoading(true);
      apiRequest('/members').then(setMembers).catch(() => setNotice('Failed to load members.')).finally(() => setMembersLoading(false));
    }
  }, [activeTab]);

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
          <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>FitStudio Facility &amp; Management Controls</p>
          </header>

          {notice && (
            <div className="notice-box notice-warning">
              {notice}
            </div>
          )}

          {activeTab === 'overview' && (
            <div>
              <div className="grid-4 mb-3">
                <div className="stat-card">
                  <div className="stat-label">Registered Members</div>
                  <div className="stat-value">{stats ? stats.totalMembers ?? 0 : '…'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Trainers</div>
                  <div className="stat-value">{stats ? stats.activeTrainers ?? 0 : '…'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Membership Plans</div>
                  <div className="stat-value">{stats ? stats.membershipPlans ?? 0 : '…'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Monthly Collections</div>
                  <div className="stat-value">₹{stats ? (stats.monthlyCollections ?? 0).toLocaleString('en-IN') : '…'}</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Recent Attendance</h2>
                  </div>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Check-In Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.length === 0 ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                              No recent check-ins.
                            </td>
                          </tr>
                        ) : attendance.map((a, i) => (
                          <tr key={i}>
                            <td>{a.memberName || a.member}</td>
                            <td>{a.checkInTime || a.time}</td>
                          </tr>
                        ))}
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
                      Manage Receptionists &amp; Trainers
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

          {activeTab === 'members' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Member Directory</h2>
              </div>
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
                    {membersLoading ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : members.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                          No members found.
                        </td>
                      </tr>
                    ) : members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.fullName || m.name}</td>
                        <td>{m.email}</td>
                        <td>{m.plan || m.membershipPlan || '—'}</td>
                        <td>
                          <span className={`badge ${m.status === 'ACTIVE' || m.active ? 'badge-green' : 'badge-gray'}`}>
                            {m.status || (m.active ? 'Active' : 'Inactive')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Staff Management (Receptionists &amp; Trainers)</h2>
              </div>
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
                    {staffLoading ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : staff.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                          No staff records found.
                        </td>
                      </tr>
                    ) : staff.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.fullName || s.name}</td>
                        <td>{s.role}</td>
                        <td>{s.email || s.contact || '—'}</td>
                        <td>
                          <span className={`badge ${s.active ? 'badge-green' : 'badge-gray'}`}>
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Membership Plans Configuration</h2>
              </div>
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
                      <td>Basic Gym Plan</td><td>30 Days</td><td>₹1,500</td><td>Gym Floor, Locker Rooms</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                    <tr>
                      <td>Standard Pro Plan</td><td>30 Days</td><td>₹3,000</td><td>Full Facility, Group Classes, Sauna</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                    <tr>
                      <td>Premium Elite Plan</td><td>30 Days</td><td>₹5,000</td><td>Full Facility, Personal Trainer, VIP Perks</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Trainer-to-Member Assignments</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                Assign certified personal trainers to registered members.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const memberId = e.target['member-select'].value;
                  const trainerId = e.target['trainer-select'].value;
                  if (!memberId || !trainerId) { setNotice('Please select both a member and a trainer.'); return; }
                  try {
                    await apiRequest(`/admin/assign-trainer`, {
                      method: 'POST',
                      body: JSON.stringify({ memberId, trainerId }),
                    });
                    setNotice('Trainer assigned successfully.');
                  } catch (err) {
                    setNotice(err.message || 'Failed to save assignment.');
                  }
                }}
                style={{ maxWidth: '500px', marginBottom: '2rem' }}
              >
                <div className="form-group">
                  <label htmlFor="member-select" className="form-label">Select Member</label>
                  <select id="member-select" name="member-select" className="form-select">
                    <option value="">Select a member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.fullName || m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="trainer-select" className="form-label">Select Trainer</label>
                  <select id="trainer-select" name="trainer-select" className="form-select">
                    <option value="">Select a personal trainer</option>
                    {staff.filter(s => s.role === 'TRAINER').map((t) => (
                      <option key={t.id} value={t.id}>{t.fullName || t.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Assignment
                </button>
              </form>
            </div>
          )}

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
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Attendance &amp; Membership Report</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    Aggregates active vs expired memberships and visit frequencies.
                  </p>
                  <button type="button" className="btn btn-secondary btn-sm"
                    onClick={() => setNotice('Report generation is currently unavailable. Please try again later.')}>
                    Export Attendance Summary (CSV)
                  </button>
                </div>
                <div className="card" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Revenue &amp; Dues Report</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    Summary of completed transactions and pending renewal payments in Indian Rupees (₹).
                  </p>
                  <button type="button" className="btn btn-secondary btn-sm"
                    onClick={() => setNotice('Report generation is currently unavailable. Please try again later.')}>
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
