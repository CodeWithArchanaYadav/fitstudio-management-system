# Fit Studio — Gym & Fitness Studio Management System (Frontend)

Fit Studio is a responsive, production-ready frontend for a modern Gym & Fitness Studio Management System. It is built as a realistic, maintainable web application designed for a real gym's daily operations involving four distinct user roles: **Admin (Gym Owner)**, **Receptionist (Front Desk)**, **Certified Fitness Trainer**, and **Gym Member**.

---

## 🚀 Tech Stack

- **Core Framework**: React 19 (Functional Components & Hooks)
- **Tooling & Bundler**: Vite
- **Language**: JavaScript (JSX)
- **Routing**: React Router DOM (v7)
- **Styling**: Plain Vanilla CSS with custom CSS variables (no bloated CSS frameworks)
- **Icons**: Lucide React
- **API Communication**: Native Fetch API client with structured service abstraction, ready for Java Spring Boot

---

## 📂 Project Structure

```text
Fit-Studio-Frontend/
├── public/
│   ├── favicon.svg              # Studio branded favicon
│   └── logo.svg                 # Vector logo & wordmark
├── src/
│   ├── assets/                  # Static assets
│   ├── components/              # Shared, reusable UI components
│   │   ├── Badge.jsx            # Dynamic semantic status badge (Active, Expiring, Expired, Paid)
│   │   ├── Button.jsx           # Standard button with loading spinner & icon support
│   │   ├── DataTable.jsx        # Responsive table with client-side search & empty states
│   │   ├── Input.jsx            # Form control with accessibility labels, hints & errors
│   │   ├── LoadingSpinner.jsx   # Non-blocking loading indicator
│   │   ├── Modal.jsx            # Accessible dialog with ESC key & backdrop close
│   │   ├── ReceiptModal.jsx     # Printable payment receipt view (window.print() ready)
│   │   └── StatCard.jsx         # Dashboard KPI summary card
│   ├── context/
│   │   └── AuthContext.jsx      # Safe authentication state, session storage & demo role switcher
│   ├── hooks/
│   │   └── useAuth.js           # Convenient auth hook
│   ├── layouts/
│   │   ├── DashboardLayout.jsx  # Authenticated layout with role guards & mobile overlay
│   │   ├── PublicLayout.jsx     # Public site navbar, announcement banner & gym footer
│   │   ├── Sidebar.jsx          # Role-aware navigation menu (updates based on role)
│   │   └── Topbar.jsx           # Topbar with profile preview, demo role switcher & logout
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx         # Public gym landing page (Hero, Amenities, Hours, Map, CTA)
│   │   │   ├── Login.jsx        # Unified login with 1-click demo role selector
│   │   │   └── NotFound.jsx     # 404 page with return to dashboard navigation
│   │   ├── admin/               # Owner / Admin portal
│   │   │   ├── AdminOverview.jsx       # KPIs, active staff counts & revenue summaries
│   │   │   ├── Members.jsx             # Member directory, registration & status toggles
│   │   │   ├── StaffManagement.jsx     # Receptionist & Trainer account provisioning
│   │   │   ├── MembershipPlans.jsx     # Pricing plans, durations & perks
│   │   │   ├── TrainerAssignments.jsx  # Member-to-trainer allocation & reassignments
│   │   │   └── Reports.jsx             # Retention, plan popularity & revenue breakdowns
│   │   ├── receptionist/        # Front Desk / Reception portal
│   │   │   ├── ReceptionistOverview.jsx # Daily metrics, 7-day expiry alerts & shortcuts
│   │   │   ├── Members.jsx             # Member registration & directory
│   │   │   ├── Trainers.jsx            # Trainer roster & trainer onboarding form
│   │   │   ├── Memberships.jsx         # Plan enrollments & renewals with auto remaining days
│   │   │   └── Payments.jsx            # Fee payment entry & receipt printing
│   │   ├── trainer/             # Fitness Trainer portal
│   │   │   ├── TrainerOverview.jsx     # Assigned client counts & daily session slots
│   │   │   ├── AssignedMembers.jsx     # Strictly scoped to trainer's assigned clients
│   │   │   ├── Workouts.jsx            # Split builder (exercises, sets, reps, rest periods)
│   │   │   └── Schedule.jsx            # Day-by-day coaching agenda & session booking
│   │   ├── member/              # Gym Member portal
│   │   │   ├── MemberOverview.jsx      # Personal overview, coach card & today's exercises
│   │   │   ├── MyMembership.jsx        # Read-only plan validity & days remaining counter
│   │   │   ├── MyWorkouts.jsx          # Interactive routine with completion checklist & progress bar
│   │   │   ├── MyTrainer.jsx           # Coach bio, specialization & permitted contacts
│   │   │   └── PaymentHistory.jsx      # Historical invoices & printable receipts
│   │   └── shared/
│   │       ├── ChangePassword.jsx      # Password modification with ephemeral state
│   │       └── Profile.jsx             # Profile info & studio business settings (Admin)
│   ├── services/
│   │   ├── api.js               # Centralized Fetch API client with JWT header support
│   │   ├── authService.js       # Login logic & demo accounts
│   │   ├── memberService.js     # Member CRUD & allocations
│   │   ├── membershipService.js # Plans, enrollments & renewals
│   │   ├── paymentService.js    # Transactions & receipt numbering
│   │   ├── workoutService.js    # Workout programs & session appointments
│   │   └── mockData.js          # Persistent mock database (localStorage backed)
│   ├── utils/
│   │   ├── formatCurrency.js    # INR currency formatting (₹)
│   │   └── formatDate.js        # Safe date formatting & remaining days calculation
│   ├── App.jsx                  # Main router & route guard definitions
│   ├── index.css                # Master CSS tokens, compact forms & print rules
│   └── main.jsx                 # Application entry point
├── .env.example                 # Environment variables template
├── package.json
└── vite.config.js
```

---

## 👥 The Four User Roles & Permissions

| Role | Permitted Responsibilities | Navigation Scope |
| :--- | :--- | :--- |
| **Admin (Gym Owner)** | Oversees business health, total revenues, and creates staff accounts (Receptionists & Trainers). Configures membership plans and reassigns trainers. *(Does not manage routine daily payments or workout logs).* | Overview, Members, Staff Management, Membership Plans, Trainer Assignments, Reports & Analytics, Profile |
| **Receptionist** | Handles front-desk administrative duties: member registrations, plan enrollments, renewals, recording fee payments, and printing customer receipts. Can create Trainer accounts. *(Cannot create Admin or Receptionist accounts).* | Overview, Members, Trainers, Memberships, Payments, Profile |
| **Trainer** | Manages assigned athletes only. Builds workout routines (exercises, muscle groups, sets, reps, rest intervals), views remaining membership days, and schedules 1-on-1 sessions. *(Cannot access billing records or unrelated members).* | Overview, Assigned Members, Workouts, Schedule, Profile |
| **Member** | Self-service portal: views remaining membership days, current workout routine with interactive completion checkboxes, coach profile, and personal fee payment receipts. *(Read-only access to plans and cannot alter trainer assignments).* | Overview, My Membership, My Workouts, My Trainer, Payment History, Profile |

---

## ⚡ Getting Started & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Default configuration:
```properties
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=true
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
To verify bundle generation and check for zero syntax/type warnings:
```bash
npm run build
```

---

## 🧪 Demo Mode Instructions (Internship Presentation Ready)

The application includes a development-only mock service layer with realistic gym data that persists in your browser's `localStorage`. You can test all 4 roles **without needing a running Spring Boot backend**:

### Option A: 1-Click Role Access on Login Page
Navigate to `/login` and click any of the 4 demo cards at the bottom:
- **Admin (Gym Owner)**: `owner@fitstudio.com`
- **Receptionist**: `reception@fitstudio.com`
- **Trainer**: `trainer.marcus@fitstudio.com`
- **Member**: `alex.member@fitstudio.com`

### Option B: Quick Role Switcher in Dashboard Topbar
Once logged in, use the **"Switch Role"** dropdown located in the top navigation bar to switch between Admin, Receptionist, Trainer, and Member on the fly.

---

## 🔌 Spring Boot Integration Guide

When your teammates finish the Java Spring Boot backend, the frontend is already pre-configured to connect:

1. **Centralized Fetch Client (`src/services/api.js`)**:
   Standardized `api.get()`, `api.post()`, `api.put()`, and `api.delete()` methods automatically include `Content-Type: application/json` and `Authorization: Bearer <token>`.
2. **Planned Spring Boot Endpoints**:
   - `POST /api/auth/login` → Returns JWT and user payload `{ id, name, email, role }`
   - `GET /api/members` & `POST /api/members`
   - `GET /api/plans` & `POST /api/plans`
   - `POST /api/payments` → Records transaction & generates official receipt
   - `GET /api/workouts/member/{memberId}`
   - `GET /api/schedules/trainer/{trainerId}`
3. **Security Note**:
   Frontend route guards and conditional navigation are for user experience. The Spring Boot backend **must** enforce Spring Security `@PreAuthorize("hasRole('ADMIN')")`, etc., on every REST endpoint.

---

## 🎓 Internship Review & Technical Interview Highlights

Key technical choices to explain during your presentation:
- **Separation of Concerns**: UI components (`pages/` and `components/`) never communicate directly with `localStorage` or external APIs; all data operations pass through the `services/` layer.
- **Predictable Local Date Arithmetic**: Membership expiry calculations in `formatDate.js` compare normalized calendar midnights to avoid off-by-one errors caused by client timezone offsets.
- **Accessible State Handling**: Ephemeral password fields in `ChangePassword.jsx` and `Login.jsx` are cleared immediately after request dispatch to prevent sensitive credential retention in memory.
- **Native Print CSS**: `@media print` rules in `index.css` allow the `ReceiptModal` to print clean, professional gym invoices directly to physical paper or PDF.
