import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../index.css";

function DashboardLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  }

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
          <button onClick={logout} style={{ marginLeft: "auto", cursor: "pointer" }}>
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
