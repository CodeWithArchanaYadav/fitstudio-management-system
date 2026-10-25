import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Role Dashboards
import AdminDashboard from './pages/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import MemberDashboard from './pages/MemberDashboard';

// Role-Specific Management Pages
import Members from './pages/Members';
import Memberships from './pages/Memberships';
import Payments from './pages/Payments';
import Workouts from './pages/Workouts';

/**
 * Main Application Component
 * Configures clean client-side routing with React Router.
 * Simple, understandable, and free of unnecessary abstractions.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Unified Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Four Role Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />

        {/* Feature Management Pages */}
        <Route path="/members" element={<Members />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/workouts" element={<Workouts />} />

        {/* Catch-all route redirects back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
