import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Register Page Wrapper
 * Member registration is conducted offline in-person at the gym front desk.
 * Public self-registration is disabled. Redirects to Login.
 */
function Register() {
  return <Navigate to="/login" replace />;
}

export default Register;
