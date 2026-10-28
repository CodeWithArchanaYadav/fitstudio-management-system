import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { apiRequest } from '../api';

function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notice, setNotice] = useState('');

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [checkins, setCheckins] = useState([]);
  const [checkinsLoading, setCheckinsLoading] = useState(false);

  const [plans, setPlans] = useState([]);

  // Stats derived from API data
  const [stats, setStats] = useState({ todayCheckins: 0, activeMembers: 0, expiringThisWeek: 0, todayCollections: 0 });

  useEffect(() => {
    if (activeTab === 'overview') {
      apiRequest('/dashboard/stats').then((s) => {
        if (s) setStats({
          todayCheckins: s.todayCheckins ?? 0,
          activeMembers: s.activeMembers ?? s.totalMembers ?? 0,
          expiringThisWeek: s.expiringThisWeek ?? 0,
          todayCollections: s.todayCollections ?? 0,
        });
      }).catch(() => {});
    }
    if (activeTab === 'members') {
      setMembersLoading(true);
      apiRequest('/members').then(setMembers).catch(() => setNotice('Failed to load members.')).finally(() => setMembersLoading(false));
    }
    if (activeTab === 'memberships') {
      apiRequest('/plans').then(setPlans).catch(() => {});
    }
    if (activeTab === 'checkins') {
      setCheckinsLoading(true);
      apiRequest('/checkins/today').then(setCheckins).catch(() => setNotice('Failed to load check-ins.')).finally(() => setCheckinsLoading(false));
    }
  }, [activeTab]);

  const handleCheckin = async (memberId) => {
    try {
      await apiRequest(`/checkins/${memberId}`, { method: 'POST' });
      setNotice('Check-in recorded successfully.');
      // refresh today's check-ins list if on that tab
      if (activeTab === 'members') {
        apiRequest('/checkins/today').then(setCheckins).catch(() => {});
      }
    } catch (err) {
      setNotice(err.message || 'Check-in failed.');
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return !q || (m.fullName || m.name || '').toLowerCase().includes(q)
      || String(m.id).includes(q)
      || (m.phone || '').includes(q);
  });

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
            <p>Front Desk Member Check-Ins, Registrations &amp; Billing</p>
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
                  <div className="stat-label">Today's Check-Ins</div>
                  <div className="stat-value">{stats.todayCheckins}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Members</div>
                  <div className="stat-value">{stats.activeMembers}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Expiring This Week</div>
                  <div className="stat-value">{stats.expiringThisWeek}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Today's Collections</div>
                  <div className="stat-value">₹{stats.todayCollections.toLocaleString('en-IN')}</div>
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
                    Member Check-In &amp; Lookup
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('memberships')}>
                    Renew Membership
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('checkins')}>
                    Today's Check-In Log
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('trainers')}>
                    View Trainer Shifts
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Member Lookup &amp; Check-In</h2>
              </div>
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label htmlFor="member-search" className="form-label">Search Member by Name or ID</label>
                <input
                  id="member-search"
                  type="text"
                  className="form-input"
                  placeholder="Enter name, phone, or member ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    {membersLoading ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No members found.
                        </td>
                      </tr>
                    ) : filteredMembers.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.fullName || m.name}</td>
                        <td>
                          <span className={`badge ${m.status === 'ACTIVE' || m.active ? 'badge-green' : 'badge-gray'}`}>
                            {m.status || (m.active ? 'Active' : 'Inactive')}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCheckin(m.id)}
                          >
                            Check In
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'memberships' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Membership Renewals &amp; Subscriptions</h2>
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
                    {plans.length === 0 ? (
                      <>
                        <tr>
                          <td>Basic Gym Plan</td><td>30 Days</td><td>₹1,500</td>
                          <td><button type="button" className="btn btn-secondary btn-sm" onClick={() => setNotice('Enrollment service is currently unavailable.')}>Renew</button></td>
                        </tr>
                        <tr>
                          <td>Standard Pro Plan</td><td>30 Days</td><td>₹3,000</td>
                          <td><button type="button" className="btn btn-primary btn-sm" onClick={() => setNotice('Enrollment service is currently unavailable.')}>Renew</button></td>
                        </tr>
                        <tr>
                          <td>Premium Elite Plan</td><td>30 Days</td><td>₹5,000</td>
                          <td><button type="button" className="btn btn-secondary btn-sm" onClick={() => setNotice('Enrollment service is currently unavailable.')}>Renew</button></td>
                        </tr>
                      </>
                    ) : plans.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.duration || p.durationDays ? `${p.durationDays} Days` : '30 Days'}</td>
                        <td>₹{(p.fee || p.price || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <button type="button" className="btn btn-secondary btn-sm"
                            onClick={() => setNotice('Enrollment service is currently unavailable.')}>
                            Renew
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'checkins' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Today's Check-In Log</h2>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkinsLoading ? (
                      <tr><td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
                    ) : checkins.length === 0 ? (
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                          No check-ins recorded today.
                        </td>
                      </tr>
                    ) : checkins.map((c, i) => (
                      <tr key={i}>
                        <td>{c.memberName || c.member}</td>
                        <td>{c.checkInTime || c.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'trainers' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Trainer Availability &amp; Info</h2>
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
