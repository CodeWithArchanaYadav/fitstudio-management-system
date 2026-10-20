
import { NavLink, Outlet } from "react-router-dom";
import "../index.css";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>FitStudio</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/members">Members</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>Gym Management System</h2>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
