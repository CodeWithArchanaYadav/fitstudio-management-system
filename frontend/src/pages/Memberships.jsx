import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy Memberships Page Wrapper
 * Redirects to the canonical /admin/plans route to maintain backwards compatibility.
 */
function Memberships() {
  return <Navigate to="/admin/plans" replace />;
}

export default Memberships;
