import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { session, ROLE_HOME } from '../services/api';

/**
 * ProtectedRoute Component
 *
 * Implements client-side authentication and role-based route protection for FitStudio:
 *
 * 1. Authentication Protection:
 *    Ensures a valid, unexpired token and user identity exist in the session.
 *    If unauthenticated or session has expired, cleans up storage and redirects
 *    the user to /login, preserving the attempted location in navigation state.
 *
 * 2. Role-Based Route Protection:
 *    Restricts page access strictly according to the logged-in user's role:
 *      - ADMIN        -> /admin/* only
 *      - RECEPTIONIST -> /receptionist/* only
 *      - TRAINER      -> /trainer/* only
 *      - MEMBER       -> /member/* only
 *    If an authenticated user attempts to access another role's dashboard or
 *    internal page (by manually editing the URL in the address bar), they are
 *    immediately redirected to their own role's home dashboard.
 *
 * 3. Direct URL Access & Refresh:
 *    When authorized, renders the requested child component/layout immediately.
 */
function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();
  const authUser = session.getAuthenticatedUser();

  // 1. Unauthenticated -> redirect to /login
  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Role-Based Route Protection
  const userRole = (authUser.role || '').toUpperCase();
  const requiredRole = (allowedRole || '').toUpperCase();

  if (requiredRole && userRole !== requiredRole) {
    const ownDashboard = ROLE_HOME[userRole] || '/login';
    return <Navigate to={ownDashboard} replace />;
  }

  // 3. Authorized -> allow direct access
  return children;
}

export default ProtectedRoute;

