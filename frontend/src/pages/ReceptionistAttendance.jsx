import React, { useState } from 'react';
import { useGymData } from '../services/gymData';

/**
 * ReceptionistAttendance Page
 * Dedicated front desk facility check-in and attendance log.
 * Accessible at /receptionist/attendance under DashboardLayout.
 */
function formatCheckInTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateLogId() {
  return `ATT-2026-${Math.floor(100 + Math.random() * 900)}`;
}

function ReceptionistAttendance() {
  const { members, updateMember } = useGymData();
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState({ type: '', text: '' });

  // Attendance log for the current shift (development session preview)
  const [attendanceLog, setAttendanceLog] = useState([
    {
      logId: 'ATT-2026-081',
      memberId: 'MEM-1002',
      memberName: 'Priya Patel',
      plan: 'Premium Elite Plan',
      timestamp: 'Today, 07:15 AM',
      facilityArea: 'Cardio & Functional Turf',
      staffOperator: 'Sunil Rao (Receptionist)',
      status: 'Checked In',
    },
  ]);

  const handleCheckIn = (member) => {
    setNotice({ type: '', text: '' });

    if (member.status === 'Expired') {
      setNotice({
        type: 'error',
        text: `Cannot check in ${member.fullName} (${member.id}): Membership is EXPIRED. Please process a pass renewal first via Memberships & Renewals.`,
      });
      return;
    }

    const timeStr = formatCheckInTime();
    const fullTimeStr = `Today, ${timeStr}`;

    const newLogEntry = {
      logId: generateLogId(),
      memberId: member.id,
      memberName: member.fullName,
      plan: member.plan,
      timestamp: fullTimeStr,
      facilityArea: 'Main Gym Floor',
      staffOperator: 'Front Desk Operator',
      status: 'Checked In',
    };

    setAttendanceLog([newLogEntry, ...attendanceLog]);

    // Update member's last check-in display in shared store
    updateMember(member.id, {
      lastCheckIn: fullTimeStr,
      totalCheckIns: (member.totalCheckIns || 0) + 1,
    });

    setNotice({
      type: 'info',
      text: `Facility check-in recorded for ${member.fullName} (${member.id}) at ${timeStr}. (Tracked in local session state for frontend review).`,
    });
  };

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search by name, phone, or ID..."
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
                    <td style={{ color: 'var(--color-text-muted)' }}>{member.lastCheckIn}</td>
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
                    No members match "{searchQuery}".
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
            {attendanceLog.length} Check-Ins Logged Today
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
              {attendanceLog.length > 0 ? (
                attendanceLog.map((log) => (
                  <tr key={log.logId}>
                    <td style={{ fontWeight: 600 }}>{log.logId}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 500 }}>{log.memberName}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{log.memberId}</td>
                    <td>{log.plan}</td>
                    <td>{log.facilityArea}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{log.staffOperator}</td>
                    <td><span className="badge badge-green">{log.status}</span></td>
                  </tr>
                ))
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
