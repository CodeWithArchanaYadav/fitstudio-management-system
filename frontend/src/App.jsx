import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/AdminMembers';
import AdminTrainers from './pages/AdminTrainers';
import AdminPlans from './pages/AdminPlans';

// Receptionist Pages
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ReceptionistMembers from './pages/ReceptionistMembers';
import ReceptionistTrainers from './pages/ReceptionistTrainers';
import ReceptionistMemberships from './pages/ReceptionistMemberships';
import ReceptionistPayments from './pages/ReceptionistPayments';
import ReceptionistAttendance from './pages/ReceptionistAttendance';

// Trainer Pages
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerMembers from './pages/TrainerMembers';
import TrainerWorkouts from './pages/TrainerWorkouts';

// Member Pages
import MemberDashboard from './pages/MemberDashboard';
import MemberProfile from './pages/MemberProfile';
import MemberWorkouts from './pages/MemberWorkouts';
import MemberMembership from './pages/MemberMembership';
import MemberPayments from './pages/MemberPayments';

/**
 * Main Application Routing Component
 * Implements clean, role-specific URL conventions, persistent dashboard layouts,
 * backwards-compatible redirects, and graceful 404 handling.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Offline member registration only — redirect public /register to Login */}
        <Route path="/register" element={<Navigate to="/login" replace />} />

        {/* Admin Dashboard Routes with Shared Layout */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>

        {/* Receptionist Dashboard Routes with Shared Layout */}
        <Route path="/receptionist" element={<DashboardLayout role="receptionist" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          <Route path="members" element={<ReceptionistMembers />} />
          <Route path="trainers" element={<ReceptionistTrainers />} />
          <Route path="memberships" element={<ReceptionistMemberships />} />
          <Route path="payments" element={<ReceptionistPayments />} />
          <Route path="attendance" element={<ReceptionistAttendance />} />
        </Route>

        {/* Trainer Dashboard Routes with Shared Layout */}
        <Route path="/trainer" element={<DashboardLayout role="trainer" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="members" element={<TrainerMembers />} />
          <Route path="workouts" element={<TrainerWorkouts />} />
        </Route>

        {/* Member Dashboard Routes with Shared Layout */}
        <Route path="/member" element={<DashboardLayout role="member" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="workouts" element={<MemberWorkouts />} />
          <Route path="membership" element={<MemberMembership />} />
          <Route path="payments" element={<MemberPayments />} />
        </Route>

        {/* Backwards Compatibility Redirects for Legacy URLs */}
        <Route path="/members" element={<Navigate to="/admin/members" replace />} />
        <Route path="/memberships" element={<Navigate to="/admin/plans" replace />} />
        <Route path="/payments" element={<Navigate to="/receptionist/payments" replace />} />
        <Route path="/workouts" element={<Navigate to="/trainer/workouts" replace />} />

        {/* Graceful 404 Not Found Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
