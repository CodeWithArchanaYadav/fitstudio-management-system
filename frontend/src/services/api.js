/**
 * FitStudio API service
 * Connects the React frontend to the Spring Boot backend (default http://localhost:6967/api).
 *
 * Every call returns   { success: true,  data, status }
 *                 or   { success: false, error, status }
 * so pages never need try/catch around network errors.
 *
 * Login stores the JWT in localStorage and every later request sends it as
 *   Authorization: Bearer <token>
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:6967/api').replace(/\/$/, '');
const TOKEN_KEY = 'fitstudio_token';
const USER_KEY = 'fitstudio_user';
const TIMEOUT_MS = 10000;

// ---------------------------------------------------------------------------
// Session helpers (token + logged-in user)
// ---------------------------------------------------------------------------

export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  },
  save: ({ token, email, role, name }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ email, role, name }));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
};

/** Where each backend role lands after login. */
export const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  TRAINER: '/trainer/dashboard',
  MEMBER: '/member/dashboard',
};

// ---------------------------------------------------------------------------
// Core request wrapper
// ---------------------------------------------------------------------------

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = session.getToken();

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let message = `Service returned status ${response.status}`;
      try {
        const body = await response.json();
        if (body?.message) message = body.message;
        else if (body?.error) message = body.error;
      } catch {
        // body was not JSON
      }
      // Token expired / invalid -> force a fresh login
      if (response.status === 401 && token && !endpoint.startsWith('/auth/')) {
        session.clear();
        if (window.location.pathname !== '/login') window.location.assign('/login');
      }
      return { success: false, status: response.status, error: message };
    }

    // 204 No Content (DELETE) or empty body
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    return { success: true, status: response.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      status: 0,
      error:
        err?.name === 'AbortError'
          ? 'Backend did not respond in time.'
          : 'Backend service is currently unavailable.',
    };
  }
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

// ---------------------------------------------------------------------------
// Shape adapters (frontend field names <-> backend field names)
// ---------------------------------------------------------------------------

/** Frontend form {fullName,...} -> backend Member {name,...}. */
function toBackendMember(m = {}) {
  const out = {
    name: (m.name ?? m.fullName ?? '').trim(),
    email: (m.email ?? '').trim(),
    phone: String(m.phone ?? '').replace(/\D/g, ''), // backend wants 10-15 digits only
    status: m.status === 'Inactive' ? 'Inactive' : 'Active',
  };
  if (m.planId != null) out.planId = m.planId;
  if (m.plan) out.plan = m.plan;
  if (m.password) out.password = m.password;
  return out;
}

/** Backend Member -> also expose the names the existing pages use. */
function fromBackendMember(m) {
  if (!m) return m;
  return { ...m, fullName: m.name, joinedDate: m.joinDate, expiryDate: m.endDate };
}

/** Frontend plan -> backend MembershipPlan. */
function toBackendPlan(p = {}) {
  const features =
    p.features ?? p.facilities ?? (Array.isArray(p.benefits) ? p.benefits.join(', ') : '');
  return {
    name: (p.name ?? '').trim(),
    durationDays: Number(p.durationDays) || 30,
    fee: Number(p.fee) || 0,
    features,
    status: p.status || 'Active',
  };
}

/** Backend plan -> also expose the fields the existing plan pages use. */
function fromBackendPlan(p) {
  if (!p) return p;
  const list = p.features ? p.features.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return {
    ...p,
    duration: `${p.durationDays} Days`,
    facilities: p.features || '',
    benefits: list,
    excluded: [],
  };
}

const mapData = (promise, fn) =>
  promise.then((res) => (res.success && Array.isArray(res.data) ? { ...res, data: res.data.map(fn) } : res.success && res.data ? { ...res, data: fn(res.data) } : res));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const api = {
  // ----- Authentication ----------------------------------------------------
  /** POST /auth/login  ->  {token,email,role,name}; token is saved automatically. */
  login: async (credentials) => {
    const res = await request('/auth/login', json('POST', credentials));
    if (res.success) session.save(res.data);
    else if (res.status === 401) res.error = 'Invalid email or password.';
    return res;
  },
  logout: () => session.clear(),
  getSession: () => session.getUser(),
  isLoggedIn: () => session.isLoggedIn(),

  // ----- Dashboard (any logged-in role) -----------------------------------
  getDashboardStats: () => request('/dashboard/stats'),
  getWeeklyAttendance: () => request('/dashboard/attendance'),

  // ----- Membership plans (GET: any user, change: ADMIN) ------------------
  getPlans: () => mapData(request('/plans'), fromBackendPlan),
  createPlan: (plan) => mapData(request('/plans', json('POST', toBackendPlan(plan))), fromBackendPlan),
  updatePlan: (id, plan) => mapData(request(`/plans/${id}`, json('PUT', toBackendPlan(plan))), fromBackendPlan),
  deletePlan: (id) => request(`/plans/${id}`, { method: 'DELETE' }),

  // ----- Members (ADMIN / RECEPTIONIST; TRAINER read-only own clients) ----
  getMembers: () => mapData(request('/members'), fromBackendMember),
  getMember: (id) => mapData(request(`/members/${id}`), fromBackendMember),
  createMember: (member) => mapData(request('/members', json('POST', toBackendMember(member))), fromBackendMember),
  updateMember: (id, member) => mapData(request(`/members/${id}`, json('PUT', toBackendMember(member))), fromBackendMember),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),
  /** Gives a member a plan; end date is calculated by the backend. */
  assignPlan: (memberId, planId) => request(`/members/${memberId}/plan/${planId}`, { method: 'PUT' }),
  /** ADMIN only. */
  assignTrainer: (memberId, trainerId) => request(`/members/${memberId}/trainer/${trainerId}`, { method: 'PUT' }),

  // ----- Staff: receptionists & trainers (ADMIN) --------------------------
  getStaff: (role) => request(`/staff${role ? `?role=${role}` : ''}`),
  createStaff: (staff) => request('/staff', json('POST', staff)),
  updateStaff: (id, staff) => request(`/staff/${id}`, json('PUT', staff)),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
  getTrainers: () => request('/staff?role=TRAINER'),
  getReceptionists: () => request('/staff?role=RECEPTIONIST'),
  createTrainer: (t) =>
    request('/staff', json('POST', { name: t.name ?? t.fullName, email: t.email, phone: String(t.phone ?? '').replace(/\D/g, ''), password: t.password, role: 'TRAINER', status: t.status || 'Active' })),

  // ----- Check-ins (ADMIN / RECEPTIONIST) ----------------------------------
  checkIn: (memberId) => request(`/checkins/${memberId}`, { method: 'POST' }),
  checkInMember: (memberId) => request(`/checkins/${memberId}`, { method: 'POST' }),
  getTodayCheckins: () => request('/checkins/today'),
  getAttendance: () => request('/checkins/today'),

  // ----- Trainer (TRAINER) -------------------------------------------------
  getMyClients: () => request('/trainer/me/members'),

  getWorkouts: () => request('/workouts'),
  createWorkout: (w) => request('/workouts', json('POST', w)),
  updateWorkout: (id, w) => request(`/workouts/${id}`, json('PUT', w)),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),
  assignWorkout: (workoutId, memberId) => request(`/workouts/${workoutId}/assign/${memberId}`, { method: 'POST' }),
  unassignWorkout: (workoutId, memberId) => request(`/workouts/${workoutId}/assign/${memberId}`, { method: 'DELETE' }),

  /** date = 'YYYY-MM-DD' (optional) */
  getSessions: (date) => request(`/sessions${date ? `?date=${date}` : ''}`),
  createSession: (s) => request('/sessions', json('POST', s)),
  updateSession: (id, s) => request(`/sessions/${id}`, json('PUT', s)),
  deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

  // ----- Member portal (MEMBER) -------------------------------------------
  getMyMembership: () => request('/me/membership'),
  getMyTrainer: () => request('/me/trainer'),
  getMyWorkouts: () => request('/me/workouts'),

  // ----- Payments: not part of the backend yet ----------------------------
  getPayments: async () => ({ success: false, status: 501, error: 'Payments are not available in the backend yet.' }),
  recordPayment: async () => ({ success: false, status: 501, error: 'Payments are not available in the backend yet.' }),
};

export default api;
