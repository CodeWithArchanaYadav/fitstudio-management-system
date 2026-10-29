import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * DashboardLayout Component
 * Shared persistent layout for all FitStudio role dashboards.
 * Hosts the Navbar, persistent role Sidebar, and dynamic route Outlet.
 * Fixes disappearing sidebar issues and ensures seamless tab/page transitions.
 */
function DashboardLayout({ role }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        {/* Persistent Sidebar */}
        <Sidebar
          role={role}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Dynamic Main Content Area */}
        <main className="dashboard-main">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-sidebar-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span>☰</span>
            <span>{isMobileOpen ? 'Close Menu' : `${role.toUpperCase()} Menu`}</span>
          </button>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
