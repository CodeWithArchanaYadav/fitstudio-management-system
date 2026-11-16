import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { api, session, SESSION_EVENT, ROLE_HOME } from '../services/api';

/** Helper to extract 1 or 2 capital initials for the avatar */
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Formats uppercase backend roles into clean SaaS labels */
function formatRole(role) {
  if (!role) return 'Portal User';
  const r = role.toUpperCase();
  switch (r) {
    case 'ADMIN':
      return 'Administrator';
    case 'RECEPTIONIST':
      return 'Receptionist';
    case 'TRAINER':
      return 'Personal Trainer';
    case 'MEMBER':
      return 'Gym Member';
    default:
      return role;
  }
}

/**
 * DashboardLayout Component
 * Dedicated dashboard layout for all FitStudio roles.
 * Replaces the public Navbar with a dashboard topbar featuring:
 * - Brand logo & role badge
 * - Actual authenticated user details (name, email, role, avatar)
 * - Fixed sidebar with independent scrolling and responsive mobile drawer
 * - Scrollable main content area
 */
function DashboardLayout({ role }) {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(() => session.getUser());

  // Listen to session changes (login/logout across tabs/actions)
  useEffect(() => {
    const syncUser = () => setUser(session.getUser());
    window.addEventListener(SESSION_EVENT, syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener(SESSION_EVENT, syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const handleLogout = () => {
    api.logout();
    navigate('/login', { replace: true });
  };

  const roleHomePath = ROLE_HOME[(role || '').toUpperCase()] || `/${role}/dashboard`;

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Header (Replaces Public Website Navbar) */}
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ display: 'none', padding: '0.4rem 0.65rem' }}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation drawer"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation drawer"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: 1,
              color: 'var(--color-text)',
            }}
            className="mobile-header-toggle"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>

          <Link to={roleHomePath} className="dashboard-brand">
            Fit<span>Studio</span>
          </Link>

          <span className="dashboard-role-badge">
            {role.toUpperCase()}
          </span>
        </div>

        {/* Actual Authenticated User Profile Area */}
        <div className="dashboard-topbar-right">
          <div className="dashboard-user-area">
            <div className="dashboard-user-avatar" title={user?.name || 'User Profile'}>
              {user?.name ? getInitials(user.name) : '👤'}
            </div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">
                {user?.name || 'Signed In'}
              </span>
              <span className="dashboard-user-role">
                {formatRole(user?.role || role)}
              </span>
              {user?.email && (
                <span className="dashboard-user-email">
                  {user.email}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout-btn"
            onClick={handleLogout}
            title="Log out of FitStudio"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body: Fixed Sidebar + Scrollable Content */}
      <div className="dashboard-layout">
        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Fixed Role Sidebar */}
        <Sidebar
          role={role}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />

        {/* Independently Scrollable Main Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
