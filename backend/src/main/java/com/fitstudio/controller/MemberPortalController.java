package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.model.User;
import com.fitstudio.model.WorkoutRoutine;
import com.fitstudio.repository.Repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** What a logged-in MEMBER sees about themselves. Identified by the email in the token. */
@RestController
@RequestMapping("/api/me")
public class MemberPortalController {

    private final UserRepository users;
    private final MemberRepository members;
    private final WorkoutRoutineRepository routines;

    public MemberPortalController(UserRepository users, MemberRepository members, WorkoutRoutineRepository routines) {
        this.users = users;
        this.members = members;
        this.routines = routines;
    }

    @GetMapping("/membership")
    public Map<String, Object> membership(Authentication auth) {
        Member m = me(auth);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("name", m.getName());
        out.put("plan", m.getPlan());
        out.put("status", m.getStatus());
        out.put("joinDate", m.getJoinDate());
        out.put("startDate", m.getStartDate());
        out.put("endDate", m.getEndDate());
        out.put("daysRemaining", daysRemaining(m));
        return out;
    }

    @GetMapping("/trainer")
    public Map<String, Object> trainer(Authentication auth) {
        Member m = me(auth);
        if (m.getTrainerId() == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No trainer assigned yet");
        User t = users.findById(m.getTrainerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No trainer assigned yet"));
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", t.getId());
        out.put("name", t.getName());
        out.put("email", t.getEmail());
        out.put("phone", t.getPhone());
        return out;
    }

    @GetMapping("/workouts")
    public List<WorkoutRoutine> workouts(Authentication auth) {
        return routines.findAssignedTo(me(auth).getId());
    }

    // ---------------------------------------------------------------- helpers

    static long daysRemaining(Member m) {
        if (m.getEndDate() == null) return 0;
        return Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(), m.getEndDate()));
    }

    private Member me(Authentication auth) {
        User u = users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return members.findByUserId(u.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member profile not found"));
    }
}
