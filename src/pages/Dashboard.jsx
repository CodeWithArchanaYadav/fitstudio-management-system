import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    api.get("/api/dashboard/stats").then((res) => setStats(res.data));
    api.get("/api/dashboard/attendance").then((res) => setAttendance(res.data));
  }, []);

  const statCards = stats ? [
    { title: "Total Members",      value: stats.totalMembers,    note: "Registered members", icon: "👥" },
    { title: "Active Memberships", value: stats.activeMembers,   note: "Currently active",   icon: "💳" },
    { title: "Inactive Members",   value: stats.inactiveMembers, note: "Currently inactive", icon: "📋" },
    { title: "Monthly Revenue",    value: stats.monthlyRevenue,  note: "Sample revenue",     icon: "₹"  },
  ] : [];

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your gym's performance at a glance.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/members")}>+ Add Member</button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
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
              <h2>Recent Members</h2>
              <p>Overview of recently registered members</p>
            </div>
            <button className="text-button" onClick={() => navigate("/members")}>View All →</button>
          </div>
          <p style={{ color: "#57606a", padding: "1rem 0" }}>Go to Members page to manage all records.</p>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
