import { useState, useEffect, useCallback } from 'react';

/**
 * FitStudio Shared Data Layer
 * Single source of truth for Members, Trainers, Coaching Assignments, and Workouts.
 * Provides browser persistence via localStorage and reactive updates across components.
 */

const STORAGE_KEYS = {
  MEMBERS: 'fitstudio_members',
  TRAINERS: 'fitstudio_trainers',
  ASSIGNMENTS: 'fitstudio_assignments',
  WORKOUTS: 'fitstudio_workouts',
  ACTIVE_TRAINER: 'fitstudio_active_trainer_id',
  ACTIVE_MEMBER: 'fitstudio_active_member_id',
};

const DATA_CHANGE_EVENT = 'fitstudio_gym_data_change';

// -------------------------------------------------------------
// Baseline Mock Data (Consistent IDs used throughout FitStudio)
// -------------------------------------------------------------

export const INITIAL_TRAINERS = [
  {
    id: 'STF-T01',
    name: 'Vikram Singh',
    email: 'vikram.singh@fitstudio.com',
    phone: '+91 98765 43220',
    specialization: 'Strength & Conditioning',
    status: 'Active',
    shift: 'Morning & Evening',
  },
  {
    id: 'STF-T02',
    name: 'Kavita Menon',
    email: 'kavita.menon@fitstudio.com',
    phone: '+91 98765 43221',
    specialization: 'Functional HIIT & Agility',
    status: 'Active',
    shift: 'Morning',
  },
  {
    id: 'STF-T03',
    name: 'Arjun Nair',
    email: 'arjun.nair@fitstudio.com',
    phone: '+91 98765 43225',
    specialization: 'Hypertrophy & Bodybuilding',
    status: 'Active',
    shift: 'Evening',
  },
];

export const INITIAL_MEMBERS = [
  {
    id: 'MEM-1001',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    emergencyContact: '+91 98765 43211 (Ramesh Sharma - Father)',
    address: 'Flat 402, Sea View Apartments, Bandra West, Mumbai, MH 400050',
    plan: 'Standard Pro Plan',
    planFee: 3000,
    status: 'Active',
    joinedDate: '15 Aug 2026',
    expiryDate: '31 Oct 2026',
  },
  {
    id: 'MEM-1002',
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43211',
    emergencyContact: '+91 98765 43299 (Sunita Patel - Mother)',
    address: '12 Emerald Heights, Khar West, Mumbai, MH 400052',
    plan: 'Premium Elite Plan',
    planFee: 5000,
    status: 'Active',
    joinedDate: '01 Sep 2026',
    expiryDate: '31 Oct 2026',
  },
  {
    id: 'MEM-1003',
    fullName: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 98765 43212',
    emergencyContact: 'Not provided',
    address: '404 Sunrise Towers, Santacruz, Mumbai, MH 400054',
    plan: 'Basic Gym Plan',
    planFee: 1500,
    status: 'Expired',
    joinedDate: '10 Jul 2026',
    expiryDate: '10 Aug 2026',
  },
];

export const INITIAL_ASSIGNMENTS = [
  {
    assignmentId: 'ASN-101',
    memberId: 'MEM-1001',
    trainerId: 'STF-T01',
    coachingGoal: 'Lean Muscle Hypertrophy & Bench Technique',
    sessionsPerWeek: '4',
    assignedDate: '15 Aug 2026',
    status: 'Active',
  },
  {
    assignmentId: 'ASN-102',
    memberId: 'MEM-1002',
    trainerId: 'STF-T02',
    coachingGoal: 'Cardiovascular Endurance & Functional Agility',
    sessionsPerWeek: '3',
    assignedDate: '01 Sep 2026',
    status: 'Active',
  },
  // MEM-1003 is unassigned intentionally to test empty states
];

export const INITIAL_WORKOUTS = [
  {
    id: 'WRK-101',
    planName: 'Upper Body Hypertrophy & Core Conditioning',
    memberId: 'MEM-1001',
    trainerId: 'STF-T01',
    goal: 'Lean Muscle Hypertrophy & Core Stability',
    schedule: '4 Days / Week (Monday, Tuesday, Thursday, Friday)',
    targetMuscle: 'Upper Body Push & Core',
    difficulty: 'Intermediate',
    exercises: [
      {
        name: 'Barbell Flat Bench Press',
        sets: 4,
        reps: 10,
        weightOrDifficulty: '75 kg',
        notes: 'Focus on full pectoral stretch, 2-sec eccentric contraction',
      },
      {
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: 12,
        weightOrDifficulty: '26 kg DBs',
        notes: 'Set bench to 30-degree incline, control the descent',
      },
      {
        name: 'Cable Chest Fly',
        sets: 3,
        reps: 15,
        weightOrDifficulty: '15 kg/side',
        notes: 'Squeeze at peak contraction, keep slight elbow bend',
      },
      {
        name: 'Tricep Rope Pushdown',
        sets: 4,
        reps: 12,
        weightOrDifficulty: '25 kg',
        notes: 'Lock out elbows and flare rope outwards at the bottom',
      },
      {
        name: 'Hanging Leg Raises',
        sets: 3,
        reps: 15,
        weightOrDifficulty: 'Bodyweight',
        notes: 'Control the swing, curl pelvis upward at the peak',
      },
    ],
    assignedDate: '15 Aug 2026',
    updatedDate: '15 Aug 2026',
    status: 'Active',
  },
  {
    id: 'WRK-102',
    planName: 'Functional Agility & Metabolic Circuit',
    memberId: 'MEM-1002',
    trainerId: 'STF-T02',
    goal: 'Cardiovascular Conditioning & Core Agility',
    schedule: '3 Days / Week (Monday, Wednesday, Friday)',
    targetMuscle: 'Full Body & Functional Cardio',
    difficulty: 'Intermediate',
    exercises: [
      {
        name: 'Kettlebell Russian Swings',
        sets: 4,
        reps: 20,
        weightOrDifficulty: '16 kg',
        notes: 'Drive through hips and glutes, keep spine neutral',
      },
      {
        name: 'Indoor Turf Sled Push',
        sets: 4,
        reps: '25m',
        weightOrDifficulty: '50 kg sled',
        notes: 'Explosive drive from balls of feet',
      },
      {
        name: 'Plyometric Box Jumps',
        sets: 3,
        reps: 12,
        weightOrDifficulty: '24-inch box',
        notes: 'Land softly in athletic quarter-squat',
      },
    ],
    assignedDate: '01 Sep 2026',
    updatedDate: '01 Sep 2026',
    status: 'Active',
  },
  // MEM-1003 has no workout assigned intentionally to test empty states
];

// -------------------------------------------------------------
// Storage Helper Utilities
// -------------------------------------------------------------

function safeGetStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
  } catch (err) {
    console.warn(`[FitStudio Data] Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[FitStudio Data] Error saving ${key} to storage:`, err);
  }
}

function emitDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT));
  }
}

// -------------------------------------------------------------
// Direct Synchronous Data Accessors & Mutators
// -------------------------------------------------------------

export const gymStore = {
  // Members
  getMembers: () => safeGetStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (members) => {
    safeSetStorage(STORAGE_KEYS.MEMBERS, members);
    emitDataChange();
  },
  addMember: (memberData) => {
    const members = gymStore.getMembers();
    const newMember = {
      id: memberData.id || `MEM-${Math.floor(1004 + Math.random() * 800)}`,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
      ...memberData,
    };
    gymStore.saveMembers([newMember, ...members]);
    return newMember;
  },
  updateMember: (memberId, updates) => {
    const members = gymStore.getMembers();
    const updated = members.map((m) => (m.id === memberId ? { ...m, ...updates } : m));
    gymStore.saveMembers(updated);
  },

  // Trainers
  getTrainers: () => safeGetStorage(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS),
  saveTrainers: (trainers) => {
    safeSetStorage(STORAGE_KEYS.TRAINERS, trainers);
    emitDataChange();
  },
  addTrainer: (trainerData) => {
    const trainers = gymStore.getTrainers();
    const newTrainer = {
      id: trainerData.id || `STF-T0${trainers.length + 1}`,
      status: 'Active',
      shift: 'General',
      ...trainerData,
    };
    gymStore.saveTrainers([...trainers, newTrainer]);
    return newTrainer;
  },

  // Assignments
  getAssignments: () => safeGetStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
  saveAssignments: (assignments) => {
    safeSetStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
    emitDataChange();
  },
  assignTrainerToMember: ({ memberId, trainerId, coachingGoal = '', sessionsPerWeek = '3' }) => {
    const assignments = gymStore.getAssignments();
    // A member can have only one primary personal trainer assignment
    const existingIndex = assignments.findIndex((a) => a.memberId === memberId);
    const newAssignment = {
      assignmentId: existingIndex >= 0 ? assignments[existingIndex].assignmentId : `ASN-${Math.floor(103 + Math.random() * 800)}`,
      memberId,
      trainerId,
      coachingGoal: coachingGoal.trim() || 'General Fitness & Strength Progression',
      sessionsPerWeek: String(sessionsPerWeek),
      assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
    };

    let updatedAssignments;
    if (existingIndex >= 0) {
      updatedAssignments = [...assignments];
      updatedAssignments[existingIndex] = newAssignment;
    } else {
      updatedAssignments = [newAssignment, ...assignments];
    }

    gymStore.saveAssignments(updatedAssignments);
    return newAssignment;
  },
  removeAssignment: (assignmentId) => {
    const assignments = gymStore.getAssignments();
    const updated = assignments.filter((a) => a.assignmentId !== assignmentId);
    gymStore.saveAssignments(updated);
  },

  // Workouts
  getWorkouts: () => safeGetStorage(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS),
  saveWorkouts: (workouts) => {
    safeSetStorage(STORAGE_KEYS.WORKOUTS, workouts);
    emitDataChange();
  },
  saveWorkoutPlan: ({ id, planName, memberId, trainerId, goal, schedule, targetMuscle, difficulty, exercises }) => {
    const workouts = gymStore.getWorkouts();
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Validate that this member belongs to this trainer
    const assignedMembers = gymStore.getMembersAssignedToTrainer(trainerId);
    const isAssigned = assignedMembers.some((m) => m.id === memberId);
    if (!isAssigned) {
      throw new Error(`Member ${memberId} is not assigned to trainer ${trainerId}.`);
    }

    // Check if updating an existing workout by ID or by member
    const existingIndex = id
      ? workouts.findIndex((w) => w.id === id)
      : workouts.findIndex((w) => w.memberId === memberId);

    const workoutRecord = {
      id: id || (existingIndex >= 0 ? workouts[existingIndex].id : `WRK-${Math.floor(103 + Math.random() * 800)}`),
      planName: planName.trim(),
      memberId,
      trainerId,
      goal: goal?.trim() || 'Custom Fitness Progression',
      schedule: schedule?.trim() || '4 Days / Week',
      targetMuscle: targetMuscle || 'Full Body',
      difficulty: difficulty || 'Intermediate',
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        sets: Number(ex.sets) || 3,
        reps: ex.reps || 10,
        weightOrDifficulty: ex.weightOrDifficulty?.trim() || '',
        notes: ex.notes?.trim() || '',
      })),
      assignedDate: existingIndex >= 0 ? workouts[existingIndex].assignedDate : dateStr,
      updatedDate: dateStr,
      status: 'Active',
    };

    let updatedWorkouts;
    if (existingIndex >= 0) {
      updatedWorkouts = [...workouts];
      updatedWorkouts[existingIndex] = workoutRecord;
    } else {
      updatedWorkouts = [workoutRecord, ...workouts];
    }

    gymStore.saveWorkouts(updatedWorkouts);
    return workoutRecord;
  },
  deleteWorkoutPlan: (workoutId) => {
    const workouts = gymStore.getWorkouts();
    const updated = workouts.filter((w) => w.id !== workoutId);
    gymStore.saveWorkouts(updated);
  },

  // Prototype Identity Selectors (Allows testing Trainer & Member views for different users)
  getActiveTrainerId: () => safeGetStorage(STORAGE_KEYS.ACTIVE_TRAINER, 'STF-T01'),
  setActiveTrainerId: (trainerId) => {
    safeSetStorage(STORAGE_KEYS.ACTIVE_TRAINER, trainerId);
    emitDataChange();
  },
  getActiveMemberId: () => safeGetStorage(STORAGE_KEYS.ACTIVE_MEMBER, 'MEM-1001'),
  setActiveMemberId: (memberId) => {
    safeSetStorage(STORAGE_KEYS.ACTIVE_MEMBER, memberId);
    emitDataChange();
  },

  // Joined Relationship Getters
  getMembersAssignedToTrainer: (trainerId) => {
    const members = gymStore.getMembers();
    const assignments = gymStore.getAssignments();
    const assignedMemberIds = assignments
      .filter((a) => a.trainerId === trainerId && a.status === 'Active')
      .map((a) => a.memberId);

    return members
      .filter((m) => assignedMemberIds.includes(m.id))
      .map((m) => {
        const assignment = assignments.find((a) => a.memberId === m.id && a.trainerId === trainerId);
        const workout = gymStore.getWorkoutForMember(m.id);
        return {
          ...m,
          assignment,
          coachingGoal: assignment?.coachingGoal || 'General Fitness',
          sessionsPerWeek: assignment?.sessionsPerWeek || '3',
          assignedRoutine: workout ? workout.planName : 'No Workout Assigned',
          hasWorkout: !!workout,
        };
      });
  },

  getTrainerForMember: (memberId) => {
    const trainers = gymStore.getTrainers();
    const assignments = gymStore.getAssignments();
    const assignment = assignments.find((a) => a.memberId === memberId && a.status === 'Active');
    if (!assignment) return null;
    const trainer = trainers.find((t) => t.id === assignment.trainerId);
    return trainer ? { ...trainer, assignment } : null;
  },

  getWorkoutForMember: (memberId) => {
    const workouts = gymStore.getWorkouts();
    return workouts.find((w) => w.memberId === memberId && w.status === 'Active') || null;
  },

  getWorkoutsForTrainer: (trainerId) => {
    const workouts = gymStore.getWorkouts();
    const members = gymStore.getMembers();
    return workouts
      .filter((w) => w.trainerId === trainerId)
      .map((w) => {
        const member = members.find((m) => m.id === w.memberId);
        return {
          ...w,
          memberName: member ? member.fullName : 'Unknown Member',
        };
      });
  },

  // Reset to initial prototype baseline
  resetToDefault: () => {
    safeSetStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    safeSetStorage(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
    safeSetStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    safeSetStorage(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS);
    safeSetStorage(STORAGE_KEYS.ACTIVE_TRAINER, 'STF-T01');
    safeSetStorage(STORAGE_KEYS.ACTIVE_MEMBER, 'MEM-1001');
    emitDataChange();
  },
};

// -------------------------------------------------------------
// React Custom Hook for Reactive Subscriptions
// -------------------------------------------------------------

export function useGymData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    window.addEventListener(DATA_CHANGE_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_CHANGE_EVENT, handleUpdate);
  }, []);

  const members = gymStore.getMembers();
  const trainers = gymStore.getTrainers();
  const assignments = gymStore.getAssignments();
  const workouts = gymStore.getWorkouts();
  const activeTrainerId = gymStore.getActiveTrainerId();
  const activeMemberId = gymStore.getActiveMemberId();

  const activeTrainer = trainers.find((t) => t.id === activeTrainerId) || trainers[0];
  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  const assignedMembers = activeTrainer ? gymStore.getMembersAssignedToTrainer(activeTrainer.id) : [];
  const trainerWorkouts = activeTrainer ? gymStore.getWorkoutsForTrainer(activeTrainer.id) : [];

  const memberTrainer = activeMember ? gymStore.getTrainerForMember(activeMember.id) : null;
  const memberWorkout = activeMember ? gymStore.getWorkoutForMember(activeMember.id) : null;

  return {
    members,
    trainers,
    assignments,
    workouts,
    activeTrainer,
    activeTrainerId,
    activeMember,
    activeMemberId,
    assignedMembers,
    trainerWorkouts,
    memberTrainer,
    memberWorkout,

    // Methods
    setActiveTrainerId: useCallback((id) => gymStore.setActiveTrainerId(id), []),
    setActiveMemberId: useCallback((id) => gymStore.setActiveMemberId(id), []),
    assignTrainerToMember: useCallback((params) => gymStore.assignTrainerToMember(params), []),
    removeAssignment: useCallback((id) => gymStore.removeAssignment(id), []),
    saveWorkoutPlan: useCallback((params) => gymStore.saveWorkoutPlan(params), []),
    deleteWorkoutPlan: useCallback((id) => gymStore.deleteWorkoutPlan(id), []),
    addMember: useCallback((data) => gymStore.addMember(data), []),
    updateMember: useCallback((id, updates) => gymStore.updateMember(id, updates), []),
    addTrainer: useCallback((data) => gymStore.addTrainer(data), []),
    resetToDefault: useCallback(() => gymStore.resetToDefault(), []),
  };
}

