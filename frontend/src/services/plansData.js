/**
 * FitStudio Plan Templates Store
 * Defines the official gym membership plans managed by Admin.
 * Used by Admin (creation/modification) and Receptionist (view/selection only).
 */

export const INITIAL_PLANS = [
  {
    id: 'plan-basic',
    name: 'Basic Gym Plan',
    duration: '30 Days',
    durationDays: 30,
    fee: 1500,
    facilities: 'Gym Floor, Locker Rooms',
    benefits: [
      'Gym Floor Access',
      'Locker Room Access',
      'General Fitness Orientation',
    ],
    excluded: [
      'Personal Trainer',
      'Weekend Guest Passes',
      'Steam & Sauna Access',
    ],
    status: 'Active',
    description: 'Essential access for everyday fitness, cardio zones, and gym floor weight training.',
  },
  {
    id: 'plan-standard',
    name: 'Standard Pro Plan',
    duration: '30 Days',
    durationDays: 30,
    fee: 3000,
    facilities: 'Full Facility, Group Classes, Sauna',
    benefits: [
      'Full Facility 24/7 Access',
      'Group Fitness Classes',
      'Locker & Sauna Access',
      'Cardio & Functional Studio',
    ],
    excluded: [
      'Dedicated Personal Trainer',
      'Custom Nutrition Blueprint',
    ],
    status: 'Active',
    description: 'Our most popular membership tier including full gym access, fitness classes, and spa amenities.',
  },
  {
    id: 'plan-premium',
    name: 'Premium Elite Plan',
    duration: '30 Days',
    durationDays: 30,
    fee: 5000,
    facilities: 'Full Facility, Personal Trainer, VIP Perks',
    benefits: [
      'All Standard Features Included',
      'Assigned Certified Personal Trainer',
      'Custom Nutrition & Diet Plan',
      'Unlimited Weekend Guest Passes',
      'Priority Locker & Recovery Suite',
    ],
    excluded: [],
    status: 'Active',
    description: 'Complete elite membership featuring 1-on-1 personal coaching and customized workout tracking.',
  },
];

// Helper to load plans from localStorage if customized during this session, falling back to INITIAL_PLANS
export function getStoredPlans() {
  try {
    const stored = localStorage.getItem('fitstudio_plans');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Unable to read plans from localStorage:', err);
  }
  return INITIAL_PLANS;
}

// Helper to save plans in localStorage
export function saveStoredPlans(plans) {
  try {
    localStorage.setItem('fitstudio_plans', JSON.stringify(plans));
  } catch (err) {
    console.warn('Unable to write plans to localStorage:', err);
  }
}
