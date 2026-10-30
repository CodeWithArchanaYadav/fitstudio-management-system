import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy Members Page Wrapper
 * Redirects to the canonical /admin/members route to maintain backwards compatibility.
 */
function Members() {
  return <Navigate to="/admin/members" replace />;
}

export default Members;
