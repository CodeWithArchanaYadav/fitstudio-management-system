/**
 * FitStudio API Integration Service
 * Configured for Spring Boot backend running on default http://localhost:8080/api.
 * Provides transparent error handling when the backend is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Standard fetch wrapper with timeout and connection error detection.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not JSON
      }
      return {
        success: false,
        status: response.status,
        error: errorJson?.message || `Service returned status ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: 'Backend service is currently unavailable.',
    };
  }
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  // Membership Plans
  getPlans: () => request('/plans'),
  createPlan: (plan) => request('/plans', { method: 'POST', body: JSON.stringify(plan) }),
  updatePlan: (id, plan) => request('/plans/' + id, { method: 'PUT', body: JSON.stringify(plan) }),
  deletePlan: (id) => request('/plans/' + id, { method: 'DELETE' }),

  // Members
  getMembers: () => request('/members'),
  createMember: (member) => request('/members', { method: 'POST', body: JSON.stringify(member) }),
  checkInMember: (memberId) => request('/members/' + memberId + '/check-in', { method: 'POST' }),

  // Trainers & Staff
  getTrainers: () => request('/trainers'),
  createTrainer: (trainer) => request('/trainers', { method: 'POST', body: JSON.stringify(trainer) }),
  assignTrainer: (assignment) => request('/trainers/assign', { method: 'POST', body: JSON.stringify(assignment) }),

  // Attendance
  getAttendance: () => request('/attendance'),
  recordAttendance: (attendanceRecord) => request('/attendance/check-in', { method: 'POST', body: JSON.stringify(attendanceRecord) }),

  // Payments
  getPayments: () => request('/payments'),
  recordPayment: (payment) => request('/payments', { method: 'POST', body: JSON.stringify(payment) }),

  // Workouts
  getWorkouts: () => request('/workouts'),
  createWorkout: (workout) => request('/workouts', { method: 'POST', body: JSON.stringify(workout) }),
};
