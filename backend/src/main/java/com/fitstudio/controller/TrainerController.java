package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.model.TrainingSession;
import com.fitstudio.model.User;
import com.fitstudio.model.WorkoutExercise;
import com.fitstudio.model.WorkoutRoutine;
import com.fitstudio.repository.Repositories.*;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

/**
 * Trainer only (SecurityConfig enforces ROLE_TRAINER on /api/trainer, /api/workouts, /api/sessions).
 * Profile, dashboard, client roster, coaching goals, workout routines, training sessions.
 */
@RestController
public class TrainerController {

    private static final Set<String> SESSION_STATUSES = Set.of("Scheduled", "Completed", "Cancelled");

    private final UserRepository users;
    private final MemberRepository members;
    private final WorkoutRoutineRepository routines;
    private final TrainingSessionRepository sessions;

    public TrainerController(UserRepository users, MemberRepository members,
                             WorkoutRoutineRepository routines, TrainingSessionRepository sessions) {
        this.users = users;
        this.members = members;
        this.routines = routines;
        this.sessions = sessions;
    }

    /** Body for PUT /api/trainer/me/members/{id}/coaching. */
    public record CoachingRequest(String coachingGoal, Integer sessionsPerWeek) {}

    // ---------------------------------------------------------------- Profile & dashboard

    @GetMapping("/api/trainer/me/profile")
    public Map<String, Object> profile(Authentication auth) {
        User t = meUser(auth);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", t.getId());
        out.put("name", t.getName());
        out.put("email", t.getEmail());
        out.put("phone", t.getPhone());
        out.put("specialization", t.getSpecialization());
        out.put("shift", t.getShift());
        out.put("status", t.getStatus());
        return out;
    }

    /** One call for the whole Trainer Dashboard page: profile + counts + roster. */
    @GetMapping("/api/trainer/me/dashboard")
    public Map<String, Object> dashboard(Authentication auth) {
        User t = meUser(auth);
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> roster = roster(t.getId());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("trainer", profile(auth));
        out.put("assignedClients", roster.size());
        out.put("activeRoutines", routines.countByTrainerId(t.getId()));
        out.put("clientsWithoutWorkout", roster.stream().filter(r -> !(Boolean) r.get("hasWorkout")).count());
        out.put("todaySessions", sessions.countByTrainerIdAndSessionTimeBetween(
                t.getId(), today.atStartOfDay(), today.plusDays(1).atStartOfDay()));
        out.put("clients", roster);
        return out;
    }

    // ---------------------------------------------------------------- Clients

    /** Plain member records (kept for the Sessions page). */
    @GetMapping("/api/trainer/me/members")
    public List<Member> myClients(Authentication auth) {
        return members.findByTrainerId(me(auth));
    }

    /** Roster: member + coaching goal + which routine(s) are prescribed. */
    @GetMapping("/api/trainer/me/clients")
    public List<Map<String, Object>> clientRoster(Authentication auth) {
        return roster(me(auth));
    }

    @GetMapping("/api/trainer/me/members/{memberId}")
    public Map<String, Object> clientDetail(@PathVariable Long memberId, Authentication auth) {
        Long me = me(auth);
        Member m = ownClient(memberId, auth);
        Map<String, Object> out = rosterRow(m, routines.findByTrainerId(me));
        out.put("joinDate", m.getJoinDate());
        out.put("startDate", m.getStartDate());
        out.put("endDate", m.getEndDate());
        out.put("workouts", assignedRoutines(m.getId(), routines.findByTrainerId(me)));
        return out;
    }

    /** Trainer sets the coaching focus and target sessions per week for a client. */
    @PutMapping("/api/trainer/me/members/{memberId}/coaching")
    public Member updateCoaching(@PathVariable Long memberId, @RequestBody CoachingRequest req, Authentication auth) {
        Member m = ownClient(memberId, auth);
        if (req.sessionsPerWeek() != null && (req.sessionsPerWeek() < 1 || req.sessionsPerWeek() > 7))
            throw bad("sessionsPerWeek must be between 1 and 7");
        String goal = req.coachingGoal() == null ? null : req.coachingGoal().trim();
        if (goal != null && goal.length() > 255) throw bad("coachingGoal must be at most 255 characters");
        m.setCoachingGoal(goal == null || goal.isEmpty() ? null : goal);
        m.setSessionsPerWeek(req.sessionsPerWeek());
        return members.save(m);
    }

    /** Routines this trainer has prescribed to one client. */
    @GetMapping("/api/trainer/me/members/{memberId}/workouts")
    public List<WorkoutRoutine> clientWorkouts(@PathVariable Long memberId, Authentication auth) {
        ownClient(memberId, auth);
        return routines.findByTrainerId(me(auth)).stream()
                .filter(r -> r.getMemberIds().contains(memberId)).toList();
    }

    // ---------------------------------------------------------------- Workouts

    @GetMapping("/api/workouts")
    public List<WorkoutRoutine> myRoutines(Authentication auth) {
        return routines.findByTrainerId(me(auth));
    }

    @GetMapping("/api/workouts/{id}")
    public WorkoutRoutine getRoutine(@PathVariable Long id, Authentication auth) {
        return ownRoutine(id, auth);
    }

    /** Optional ?memberId=.. assigns the new routine to that client straight away. */
    @PostMapping("/api/workouts")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public WorkoutRoutine createRoutine(@Valid @RequestBody WorkoutRoutine req,
                                        @RequestParam(required = false) Long memberId, Authentication auth) {
        if (req.getExercises() == null || req.getExercises().isEmpty())
            throw bad("Add at least one exercise");
        List<WorkoutExercise> incoming = new ArrayList<>(req.getExercises());
        req.setId(null);
        req.setTrainerId(me(auth));
        req.setMemberIds(new HashSet<>());
        req.setExercises(new ArrayList<>());
        req.replaceExercises(incoming);
        if (memberId != null) {
            ownClient(memberId, auth);
            req.getMemberIds().add(memberId);
        }
        return routines.save(req);
    }

    @PutMapping("/api/workouts/{id}")
    @Transactional
    public WorkoutRoutine updateRoutine(@PathVariable Long id, @Valid @RequestBody WorkoutRoutine req, Authentication auth) {
        WorkoutRoutine r = ownRoutine(id, auth);
        if (req.getExercises() == null || req.getExercises().isEmpty())
            throw bad("Add at least one exercise");
        r.setTitle(req.getTitle());
        r.setGoal(req.getGoal());
        r.setSchedule(req.getSchedule());
        r.setTargetMuscle(req.getTargetMuscle());
        r.setDifficulty(req.getDifficulty());
        r.replaceExercises(new ArrayList<>(req.getExercises()));
        r.setUpdatedAt(java.time.LocalDateTime.now());   // exercise rows changed even if the header did not
        return routines.save(r);
    }

    @DeleteMapping("/api/workouts/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id, Authentication auth) {
        routines.delete(ownRoutine(id, auth));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/workouts/{id}/assign/{memberId}")
    @Transactional
    public WorkoutRoutine assign(@PathVariable Long id, @PathVariable Long memberId, Authentication auth) {
        WorkoutRoutine r = ownRoutine(id, auth);
        ownClient(memberId, auth);
        r.getMemberIds().add(memberId);
        return routines.save(r);
    }

    @DeleteMapping("/api/workouts/{id}/assign/{memberId}")
    @Transactional
    public WorkoutRoutine unassign(@PathVariable Long id, @PathVariable Long memberId, Authentication auth) {
        WorkoutRoutine r = ownRoutine(id, auth);
        r.getMemberIds().remove(memberId);
        return routines.save(r);
    }

    // ---------------------------------------------------------------- Sessions

    /** Optional ?date=2026-10-28 to see one day only. */
    @GetMapping("/api/sessions")
    public List<TrainingSession> mySessions(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, Authentication auth) {
        Long me = me(auth);
        if (date == null) return sessions.findByTrainerIdOrderBySessionTime(me);
        return sessions.findByTrainerIdAndSessionTimeBetweenOrderBySessionTime(
                me, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    @PostMapping("/api/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingSession createSession(@Valid @RequestBody TrainingSession req, Authentication auth) {
        Long me = me(auth);
        ownClient(req.getMemberId(), auth);
        checkNoClash(me, req.getSessionTime(), null);
        req.setId(null);
        req.setTrainerId(me);
        return sessions.save(req);
    }

    @PutMapping("/api/sessions/{id}")
    public TrainingSession updateSession(@PathVariable Long id, @Valid @RequestBody TrainingSession req, Authentication auth) {
        TrainingSession s = ownSession(id, auth);
        ownClient(req.getMemberId(), auth);
        if (!"Cancelled".equals(req.getStatus())) checkNoClash(s.getTrainerId(), req.getSessionTime(), s.getId());
        s.setMemberId(req.getMemberId());
        s.setSessionTime(req.getSessionTime());
        s.setFocus(req.getFocus());
        s.setStatus(req.getStatus());
        return sessions.save(s);
    }

    /** Quick status change: Scheduled | Completed | Cancelled. */
    @PutMapping("/api/sessions/{id}/status/{status}")
    public TrainingSession setSessionStatus(@PathVariable Long id, @PathVariable String status, Authentication auth) {
        if (!SESSION_STATUSES.contains(status)) throw bad("status must be Scheduled, Completed or Cancelled");
        TrainingSession s = ownSession(id, auth);
        s.setStatus(status);
        return sessions.save(s);
    }

    @DeleteMapping("/api/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id, Authentication auth) {
        sessions.delete(ownSession(id, auth));
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- helpers

    private User meUser(Authentication auth) {
        return users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Long me(Authentication auth) {
        return meUser(auth).getId();
    }

    private List<Map<String, Object>> roster(Long trainerId) {
        List<WorkoutRoutine> mine = routines.findByTrainerId(trainerId);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Member m : members.findByTrainerId(trainerId)) out.add(rosterRow(m, mine));
        return out;
    }

    private Map<String, Object> rosterRow(Member m, List<WorkoutRoutine> trainerRoutines) {
        List<Map<String, Object>> assigned = assignedRoutines(m.getId(), trainerRoutines);
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", m.getId());
        row.put("name", m.getName());
        row.put("email", m.getEmail());
        row.put("phone", m.getPhone());
        row.put("plan", m.getPlan());
        row.put("status", m.getStatus());
        row.put("coachingGoal", m.getCoachingGoal());
        row.put("sessionsPerWeek", m.getSessionsPerWeek());
        row.put("hasWorkout", !assigned.isEmpty());
        row.put("assignedRoutine", assigned.isEmpty() ? "No Workout Assigned" : assigned.get(0).get("title"));
        row.put("assignedRoutines", assigned);
        return row;
    }

    private List<Map<String, Object>> assignedRoutines(Long memberId, List<WorkoutRoutine> trainerRoutines) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (WorkoutRoutine r : trainerRoutines) {
            if (!r.getMemberIds().contains(memberId)) continue;
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("id", r.getId());
            x.put("title", r.getTitle());
            x.put("targetMuscle", r.getTargetMuscle());
            x.put("difficulty", r.getDifficulty());
            x.put("goal", r.getGoal());
            x.put("schedule", r.getSchedule());
            x.put("exerciseCount", r.getExercises().size());
            out.add(x);
        }
        return out;
    }

    private void checkNoClash(Long trainerId, java.time.LocalDateTime time, Long ignoreId) {
        boolean clash = sessions.findByTrainerIdAndSessionTime(trainerId, time).stream()
                .anyMatch(x -> !"Cancelled".equals(x.getStatus()) && !x.getId().equals(ignoreId));
        if (clash) throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have a session at that time");
    }

    private WorkoutRoutine ownRoutine(Long id, Authentication auth) {
        Long me = me(auth);
        return routines.findById(id).filter(r -> me.equals(r.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
    }

    private TrainingSession ownSession(Long id, Authentication auth) {
        Long me = me(auth);
        return sessions.findById(id).filter(s -> me.equals(s.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    /** The member must be assigned to this trainer. */
    private Member ownClient(Long memberId, Authentication auth) {
        Long me = me(auth);
        return members.findById(memberId).filter(m -> me.equals(m.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member is not your client"));
    }

    private static ResponseStatusException bad(String m) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, m);
    }
}