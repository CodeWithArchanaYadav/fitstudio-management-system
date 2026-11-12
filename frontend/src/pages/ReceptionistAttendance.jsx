import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * ReceptionistAttendance Page
 * Dedicated front desk facility check-in and attendance log.
 * Accessible at /receptionist/attendance under DashboardLayout.
 */
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ReceptionistAttendance() {
  // Members and today's check-ins come from the backend (real DB ids).
  const [members, setMembers] = useState([]);
  const [todayLog, setTodayLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState({ type: '', text: '' });

  const loadData = useCallback(async () => {
    const [mRes, cRes] = await Promise.all([api.getMembers(), api.getTodayCheckins()]);
    if (mRes.success) {
      setMembers(Array.isArray(mRes.data) ? mRes.data : []);
    } else {
      setNotice({ type: 'error', text: mRes.error || 'Could not load members from the server.' });
    }
    if (cRes.success && Array.isArray(cRes.data)) setTodayLog(cRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const memberById = (id) => members.find((m) => m.id === id);

  const handleCheckIn = async (member) => {
    setNotice({ type: '', text: '' });

    const res = await api.checkIn(member.id);
    if (!res.success) {
      setNotice({
        type: 'error',
        text: `Cannot check in ${member.fullName} (ID ${member.id}): ${res.error}`,
      });
      return;
    }

    await loadData();
    setNotice({
      type: 'info',
      text: `Facility check-in recorded for ${member.fullName} (ID ${member.id}) at ${formatTime(res.data.checkInTime)}.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredMembers = members.filter(
    (m) =>
      !q ||
      String(m.id) === q ||
      String(m.userId ?? '') === q ||
      String(m.id).includes(q) ||
      (m.fullName || '').toLowerCase().includes(q) ||
      String(m.phone || '').includes(q)
  );

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Daily Attendance & Facility Check-In
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Verify member validity, record gym floor entry timestamps, and inspect daily access logs
          </p>
        </div>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : 'notice-box'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Member Lookup & Check-In Action Card */}
      <div className="card mb-3">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">Look Up Member for Check-In</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Search member by name, phone number, or Member ID to record their check-in
            </p>
          </div>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, phone, or member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Contact</th>
                <th>Pass Tier</th>
                <th>Status</th>
                <th>Last Check-In</th>
                <th>Record Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: 600 }}>{member.id}</td>
                    <td style={{ fontWeight: 500 }}>{member.fullName}</td>
                    <td>{member.phone}</td>
                    <td>{member.plan}</td>
                    <td>
                      <span className={`badge ${member.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {todayLog.some((c) => c.memberId === member.id) ? 'Today' : '-'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${member.status === 'Active' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleCheckIn(member)}
                      >
                        ✓ Record Check-In
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    {loading ? 'Loading members...' : `No members match "${searchQuery}".`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Attendance Log */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Today's Check-In Log & Timestamps</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Real-time audit log of member visits recorded during the current front desk shift
            </p>
          </div>
          <span className="badge badge-blue">
            {todayLog.length} Check-Ins Logged Today
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Member Name</th>
                <th>Member ID</th>
                <th>Pass Tier</th>
                <th>Facility Area</th>
                <th>Logged By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayLog.length > 0 ? (
                [...todayLog].reverse().map((log) => {
                  const m = memberById(log.memberId);
                  return (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 600 }}>ATT-{log.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Today, {formatTime(log.checkInTime)}</td>
                      <td style={{ fontWeight: 500 }}>{m?.fullName || `Member #${log.memberId}`}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{log.memberId}</td>
                      <td>{m?.plan || '-'}</td>
                      <td>Main Gym Floor</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>Front Desk</td>
                      <td><span className="badge badge-green">Checked In</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                    No check-ins recorded today. Look up a member above to log an entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistAttendance;