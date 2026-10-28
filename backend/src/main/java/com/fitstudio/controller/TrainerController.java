package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.model.TrainingSession;
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
import java.util.List;

/** Trainer only: my clients, workout routines, training sessions. */
@RestController
public class TrainerController {

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

    // ---------------------------------------------------------------- Clients

    @GetMapping("/api/trainer/me/members")
    public List<Member> myClients(Authentication auth) {
        return members.findByTrainerId(me(auth));
    }

    // ---------------------------------------------------------------- Workouts

    @GetMapping("/api/workouts")
    public List<WorkoutRoutine> myRoutines(Authentication auth) {
        return routines.findByTrainerId(me(auth));
    }

    @PostMapping("/api/workouts")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkoutRoutine createRoutine(@Valid @RequestBody WorkoutRoutine req, Authentication auth) {
        req.setId(null);
        req.setTrainerId(me(auth));
        req.getMemberIds().clear();
        return routines.save(req);
    }

    @PutMapping("/api/workouts/{id}")
    public WorkoutRoutine updateRoutine(@PathVariable Long id, @Valid @RequestBody WorkoutRoutine req, Authentication auth) {
        WorkoutRoutine r = ownRoutine(id, auth);
        r.setTitle(req.getTitle());
        r.setTargetMuscle(req.getTargetMuscle());
        r.setDifficulty(req.getDifficulty());
        r.setExercises(req.getExercises());
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
        ownClient(req.getMemberId(), auth);
        req.setId(null);
        req.setTrainerId(me(auth));
        return sessions.save(req);
    }

    @PutMapping("/api/sessions/{id}")
    public TrainingSession updateSession(@PathVariable Long id, @Valid @RequestBody TrainingSession req, Authentication auth) {
        TrainingSession s = ownSession(id, auth);
        ownClient(req.getMemberId(), auth);
        s.setMemberId(req.getMemberId());
        s.setSessionTime(req.getSessionTime());
        s.setFocus(req.getFocus());
        s.setStatus(req.getStatus());
        return sessions.save(s);
    }

    @DeleteMapping("/api/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id, Authentication auth) {
        sessions.delete(ownSession(id, auth));
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- helpers

    private Long me(Authentication auth) {
        return users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found")).getId();
    }

    private WorkoutRoutine ownRoutine(Long id, Authentication auth) {
        return routines.findById(id).filter(r -> me(auth).equals(r.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
    }

    private TrainingSession ownSession(Long id, Authentication auth) {
        return sessions.findById(id).filter(s -> me(auth).equals(s.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    /** The member must be assigned to this trainer. */
    private Member ownClient(Long memberId, Authentication auth) {
        return members.findById(memberId).filter(m -> me(auth).equals(m.getTrainerId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member is not your client"));
    }
}
