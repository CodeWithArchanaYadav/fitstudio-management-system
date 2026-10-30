package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.model.MembershipPlan;
import com.fitstudio.model.User;
import com.fitstudio.repository.Repositories.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository members;
    private final UserRepository users;
    private final MembershipPlanRepository plans;
    private final WorkoutRoutineRepository routines;
    private final TrainingSessionRepository sessions;
    private final CheckinRepository checkins;
    private final PasswordEncoder encoder;

    public MemberController(MemberRepository members, UserRepository users, MembershipPlanRepository plans,
                            WorkoutRoutineRepository routines, TrainingSessionRepository sessions,
                            CheckinRepository checkins, PasswordEncoder encoder) {
        this.members = members;
        this.users = users;
        this.plans = plans;
        this.routines = routines;
        this.sessions = sessions;
        this.checkins = checkins;
        this.encoder = encoder;
    }

    /** Admin/Receptionist see everyone; a Trainer sees only their own clients. */
    @GetMapping
    public List<Member> getAll(Authentication auth) {
        if (isTrainer(auth)) return members.findByTrainerId(userId(auth));
        return members.findAll();
    }

    @GetMapping("/{id}")
    public Member getOne(@PathVariable Long id, Authentication auth) {
        Member m = find(id);
        if (isTrainer(auth) && !userId(auth).equals(m.getTrainerId())) throw notFound("Member not found");
        return m;
    }

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public Member create(@Valid @RequestBody Member req) {
        if (users.existsByEmail(req.getEmail()) || members.existsByEmail(req.getEmail()))
            throw conflict("Email already exists");

        // login account for the member (password defaults to phone number)
        String rawPassword = (req.getPassword() != null && req.getPassword().length() >= 6)
                ? req.getPassword() : req.getPhone();
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setRole(User.Role.MEMBER);
        u.setPassword(encoder.encode(rawPassword));
        u.setStatus(req.getStatus());
        u = users.save(u);

        req.setId(null);
        req.setUserId(u.getId());
        req.setTrainerId(null);                       // trainer is assigned by Admin only
        req.setJoinDate(LocalDate.now());
        applyPlan(req, req.getPlanId(), req.getPlan());
        return members.save(req);
    }

    @PutMapping("/{id}")
    @Transactional
    public Member update(@PathVariable Long id, @Valid @RequestBody Member req) {
        Member m = find(id);
        User u = m.getUserId() == null ? null : users.findById(m.getUserId()).orElse(null);
        boolean emailChanged = !req.getEmail().equals(m.getEmail());
        if (emailChanged && (users.existsByEmail(req.getEmail()) || members.existsByEmail(req.getEmail())))
            throw conflict("Email already exists");

        m.setName(req.getName());
        m.setEmail(req.getEmail());
        m.setPhone(req.getPhone());
        m.setStatus(req.getStatus());
        boolean planChanged = (req.getPlanId() != null && !req.getPlanId().equals(m.getPlanId()))
                || (req.getPlanId() == null && req.getPlan() != null && !req.getPlan().equals(m.getPlan()));
        if (planChanged) applyPlan(m, req.getPlanId(), req.getPlan());

        if (u != null) {                              // keep the login account in sync
            u.setName(m.getName());
            u.setEmail(m.getEmail());
            u.setPhone(m.getPhone());
            u.setStatus(m.getStatus());
            users.save(u);
        }
        return members.save(m);
    }

    /** Give a member a plan: end_date = start_date + plan.durationDays. */
    @PutMapping("/{id}/plan/{planId}")
    public Member assignPlan(@PathVariable Long id, @PathVariable Long planId) {
        Member m = find(id);
        applyPlan(m, planId, null);
        return members.save(m);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Member m = find(id);
        checkins.deleteByMemberId(id);
        sessions.deleteByMemberId(id);
        routines.findAssignedTo(id).forEach(r -> r.getMemberIds().remove(id));
        members.delete(m);
        if (m.getUserId() != null) users.deleteById(m.getUserId());
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- helpers

    /** Resolve the plan by id (preferred) or by name, then set plan name and dates. */
    private void applyPlan(Member m, Long planId, String planName) {
        MembershipPlan p = null;
        if (planId != null) {
            p = plans.findById(planId).orElseThrow(() -> notFound("Plan not found"));
        } else if (planName != null && !planName.isBlank()) {
            p = plans.findAll().stream().filter(x -> x.getName().equalsIgnoreCase(planName)).findFirst().orElse(null);
            if (p == null) { m.setPlan(planName); return; }   // unknown name: just store the text
        }
        if (p == null) return;
        if (!"Active".equals(p.getStatus())) throw bad("Plan is not active");
        LocalDate start = LocalDate.now();
        m.setPlanId(p.getId());
        m.setPlan(p.getName());
        m.setStartDate(start);
        m.setEndDate(start.plusDays(p.getDurationDays()));
        m.setStatus("Active");
    }

    private Member find(Long id) { return members.findById(id).orElseThrow(() -> notFound("Member not found")); }

    private boolean isTrainer(Authentication a) {
        return a.getAuthorities().stream().anyMatch(g -> g.getAuthority().equals("ROLE_TRAINER"));
    }

    private Long userId(Authentication a) {
        return users.findByEmail(a.getName()).orElseThrow(() -> notFound("User not found")).getId();
    }

    private static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }
    private static ResponseStatusException conflict(String m) { return new ResponseStatusException(HttpStatus.CONFLICT, m); }
    private static ResponseStatusException notFound(String m) { return new ResponseStatusException(HttpStatus.NOT_FOUND, m); }
}
