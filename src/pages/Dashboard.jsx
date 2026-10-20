

import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Members",
    value: "248",
    note: "Registered members",
    icon: "👥",
  },
  {
    title: "Active Memberships",
    value: "186",
    note: "Currently active",
    icon: "💳",
  },
  {
    title: "Today's Attendance",
    value: "42",
    note: "Check-ins today",
    icon: "📋",
  },
  {
    title: "Monthly Revenue",
    value: "₹84,500",
    note: "Sample revenue",
    icon: "₹",
  },
];

const attendance = [
  { day: "Mon", count: 32 },
  { day: "Tue", count: 45 },
  { day: "Wed", count: 38 },
  { day: "Thu", count: 52 },
  { day: "Fri", count: 42 },
  { day: "Sat", count: 64 },
  { day: "Sun", count: 25 },
];

const recentMembers = [
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    plan: "Monthly",
    status: "Active",
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    plan: "Quarterly",
    status: "Active",
  },
  {
    name: "Amit Kumar",
    email: "amit@example.com",
    plan: "Yearly",
    status: "Inactive",
  },
];

const expiringMemberships = [
  { name: "Neha Verma", plan: "Monthly", date: "25 Oct 2026" },
  { name: "Rohit Gupta", plan: "Quarterly", date: "28 Oct 2026" },
  { name: "Anjali Singh", plan: "Monthly", date: "31 Oct 2026" },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's your gym's performance at a glance.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/members")}
        >
          + Add Member
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.title}>
            <div className="stat-top">
              <p>{stat.title}</p>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <h2>{stat.value}</h2>
            <span className="stat-note">{stat.note}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="content-card attendance-card">
          <div className="section-heading">
            <div>
              <h2>Weekly Attendance</h2>
              <p>Member check-ins throughout the week</p>
            </div>
            <span className="chart-label">Last 7 days</span>
          </div>

          <div className="attendance-chart">
            {attendance.map((item) => (
              <div className="chart-column" key={item.day}>
                <span className="chart-value">{item.count}</span>
                <div className="bar-track">
                  <div
                    className="attendance-bar"
                    style={{ height: `${(item.count / 70) * 100}%` }}
                    title={`${item.count} check-ins`}
                  />
                </div>
                <span className="chart-day">{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-card reminders-card">
          <div className="section-heading">
            <div>
              <h2>Expiring Memberships</h2>
              <p>Upcoming renewal dates</p>
            </div>
            <span className="reminder-icon">!</span>
          </div>

          <div className="reminder-list">
            {expiringMemberships.map((member) => (
              <div className="reminder-item" key={member.name}>
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <div className="reminder-info">
                  <strong>{member.name}</strong>
                  <span>{member.plan} plan</span>
                </div>
                <span className="expiry-date">{member.date}</span>
              </div>
            ))}
          </div>

          <button
            className="text-button"
            onClick={() => navigate("/members")}
          >
            View Members →
          </button>
        </section>
      </div>

      <section className="content-card recent-members-card">
        <div className="section-heading">
          <div>
            <h2>Recent Members</h2>
            <p>Overview of recently registered members</p>
          </div>
          <button
            className="text-button"
            onClick={() => navigate("/members")}
          >
            View All →
          </button>
        </div>

        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Membership Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member) => (
                <tr key={member.email}>
                  <td>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </td>
                  <td>{member.plan}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="dashboard-disclaimer">
        Demo dashboard · Figures shown are sample data, not live records.
      </p>
    </section>
  );
}

export default Dashboard;
