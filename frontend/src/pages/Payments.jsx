import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy Payments Page Wrapper
 * Redirects to the canonical /receptionist/payments route to maintain backwards compatibility.
 */
function Payments() {
  return <Navigate to="/receptionist/payments" replace />;
}

export default Payments;
