import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * Provides clean, role-specific navigation for FitStudio dashboard views.
 * Supports Admin, Receptionist, Trainer, and Member with accurate active-route highlighting.
 */
function Sidebar({ role, isMobileOpen, onCloseMobile }) {
  const location = useLocation();

  // Define navigation items based on current role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Overview', path: '/admin/dashboard' },
          { id: 'members', label: 'Members', path: '/admin/members' },
          { id: 'trainers', label: 'Trainers & Staff', path: '/admin/trainers' },
          { id: 'plans', label: 'Membership Plans', path: '/admin/plans' },
        ];
      case 'receptionist':
        return [
          { id: 'dashboard', label: 'Overview', path: '/receptionist/dashboard' },
          { id: 'members', label: 'Members Directory', path: '/receptionist/members' },
          { id: 'trainers', label: 'Trainers & Assignments', path: '/receptionist/trainers' },
          { id: 'attendance', label: 'Daily Attendance', path: '/receptionist/attendance' },
          { id: 'memberships', label: 'Memberships & Renewals', path: '/receptionist/memberships' },
          { id: 'payments', label: 'Payments & Billing', path: '/receptionist/payments' },
        ];
      case 'trainer':
        return [
          { id: 'dashboard', label: 'Overview', path: '/trainer/dashboard' },
          { id: 'members', label: 'Assigned Clients', path: '/trainer/members' },
          { id: 'workouts', label: 'Workout Plans', path: '/trainer/workouts' },
        ];
      case 'member':
        return [
          { id: 'dashboard', label: 'Overview', path: '/member/dashboard' },
          { id: 'profile', label: 'My Profile', path: '/member/profile' },
          { id: 'workouts', label: 'My Workouts', path: '/member/workouts' },
          { id: 'membership', label: 'My Membership', path: '/member/membership' },
          { id: 'payments', label: 'Payment History', path: '/member/payments' },
        ];
      default:
        return [{ id: 'dashboard', label: 'Overview', path: '/' }];
    }
  };

  const navItems = getNavItems();

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'sidebar-open-mobile' : 'sidebar-hidden-mobile'}`}>
      <div className="sidebar-title">
        {role ? `${role.toUpperCase()} MENU` : 'NAVIGATION'}
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <Link
          to="/login"
          className="sidebar-link"
          style={{ color: 'var(--color-danger)' }}
          onClick={handleLinkClick}
        >
          ← Exit to Login
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
