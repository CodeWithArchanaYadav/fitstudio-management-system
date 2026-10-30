import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy Workouts Page Wrapper
 * Redirects to the canonical /trainer/workouts route to maintain backwards compatibility.
 */
function Workouts() {
  return <Navigate to="/trainer/workouts" replace />;
}

export default Workouts;
