import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Sidebar Component
 * Provides clean, role-specific navigation for dashboard views.
 * Supports Admin, Receptionist, Trainer, and Member.
 */
function Sidebar({ role, activeItem, onSelect }) {
  const navigate = useNavigate();

  // Define navigation items based on the current user role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'members', label: 'Members', path: '/members' },
          { id: 'staff', label: 'Staff Management' },
          { id: 'plans', label: 'Membership Plans', path: '/memberships' },
          { id: 'assignments', label: 'Trainer Assignments' },
          { id: 'reports', label: 'Basic Reports' },
        ];
      case 'receptionist':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'members', label: 'Members', path: '/members' },
          { id: 'memberships', label: 'Memberships', path: '/memberships' },
          { id: 'payments', label: 'Payments', path: '/payments' },
          { id: 'trainers', label: 'Trainer Information' },
        ];
      case 'trainer':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'assigned-members', label: 'Assigned Members' },
          { id: 'workouts', label: 'Workouts', path: '/workouts' },
          { id: 'schedule', label: 'Schedule' },
        ];
      case 'member':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'membership', label: 'My Membership', path: '/memberships' },
          { id: 'trainer', label: 'My Trainer' },
          { id: 'workouts', label: 'My Workouts', path: '/workouts' },
          { id: 'payments', label: 'Payment History', path: '/payments' },
        ];
      default:
        return [{ id: 'overview', label: 'Overview' }];
    }
  };

  const navItems = getNavItems();

  const handleClick = (item) => {
    if (onSelect) {
      onSelect(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        {role ? `${role.toUpperCase()} MENU` : 'NAVIGATION'}
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`sidebar-link ${activeItem === item.id ? 'active' : ''}`}
              style={{
                width: '100%',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => handleClick(item)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <Link to="/login" className="sidebar-link" style={{ color: 'var(--color-danger)' }}>
          ← Exit to Login
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
