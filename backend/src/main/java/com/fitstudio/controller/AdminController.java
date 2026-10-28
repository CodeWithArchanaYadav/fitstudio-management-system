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

import java.util.List;

/** Admin only: staff (receptionist / trainer), membership plans, trainer assignment. */
@RestController
@RequestMapping("/api")
public class AdminController {

    private final UserRepository users;
    private final MembershipPlanRepository plans;
    private final MemberRepository members;
    private final WorkoutRoutineRepository routines;
    private final TrainingSessionRepository sessions;
    private final PasswordEncoder encoder;

    public AdminController(UserRepository users, MembershipPlanRepository plans, MemberRepository members,
                           WorkoutRoutineRepository routines, TrainingSessionRepository sessions,
                           PasswordEncoder encoder) {
        this.users = users;
        this.plans = plans;
        this.members = members;
        this.routines = routines;
        this.sessions = sessions;
        this.encoder = encoder;
    }

    // ---------------------------------------------------------------- Staff

    @GetMapping("/staff")
    public List<User> listStaff(@RequestParam(required = false) User.Role role) {
        if (role != null) {
            if (role == User.Role.ADMIN || role == User.Role.MEMBER) throw bad("role must be RECEPTIONIST or TRAINER");
            return users.findByRole(role);
        }
        return users.findAll().stream()
                .filter(u -> u.getRole() == User.Role.RECEPTIONIST || u.getRole() == User.Role.TRAINER).toList();
    }

    @PostMapping("/staff")
    @ResponseStatus(HttpStatus.CREATED)
    public User createStaff(@Valid @RequestBody User req) {
        checkStaffRole(req.getRole());
        if (req.getPassword() == null || req.getPassword().length() < 6) throw bad("password must be at least 6 characters");
        if (users.existsByEmail(req.getEmail())) throw conflict("Email already exists");
        req.setId(null);
        req.setPassword(encoder.encode(req.getPassword()));
        return users.save(req);
    }

    @PutMapping("/staff/{id}")
    public User updateStaff(@PathVariable Long id, @Valid @RequestBody User req) {
        User u = staff(id);
        checkStaffRole(req.getRole());
        if (users.existsByEmailAndIdNot(req.getEmail(), id)) throw conflict("Email already exists");
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setRole(req.getRole());
        if (req.getStatus() != null) u.setStatus(req.getStatus());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            if (req.getPassword().length() < 6) throw bad("password must be at least 6 characters");
            u.setPassword(encoder.encode(req.getPassword()));
        }
        return users.save(u);
    }

    @DeleteMapping("/staff/{id}")
    @Transactional
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id, Authentication auth) {
        User u = staff(id);
        if (u.getEmail().equals(auth.getName())) throw bad("You cannot delete your own account");
        if (u.getRole() == User.Role.TRAINER) {          // free up everything that points to this trainer
            members.findByTrainerId(id).forEach(m -> m.setTrainerId(null));
            routines.deleteByTrainerId(id);
            sessions.deleteByTrainerId(id);
        }
        users.delete(u);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- Plans

    @GetMapping("/plans")
    public List<MembershipPlan> listPlans() { return plans.findAll(); }

    @PostMapping("/plans")
    @ResponseStatus(HttpStatus.CREATED)
    public MembershipPlan createPlan(@Valid @RequestBody MembershipPlan p) {
        if (plans.existsByName(p.getName())) throw conflict("Plan name already exists");
        p.setId(null);
        return plans.save(p);
    }

    @PutMapping("/plans/{id}")
    public MembershipPlan updatePlan(@PathVariable Long id, @Valid @RequestBody MembershipPlan req) {
        MembershipPlan p = plans.findById(id).orElseThrow(() -> notFound("Plan not found"));
        if (plans.existsByNameAndIdNot(req.getName(), id)) throw conflict("Plan name already exists");
        p.setName(req.getName());
        p.setDurationDays(req.getDurationDays());
        p.setFee(req.getFee());
        p.setFeatures(req.getFeatures());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        return plans.save(p);
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        if (!plans.existsById(id)) throw notFound("Plan not found");
        if (members.existsByPlanId(id)) throw conflict("Plan is in use by members - set it Inactive instead");
        plans.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- Trainer assignment

    @PutMapping("/members/{id}/trainer/{trainerId}")
    public Member assignTrainer(@PathVariable Long id, @PathVariable Long trainerId) {
        Member m = members.findById(id).orElseThrow(() -> notFound("Member not found"));
        User t = users.findById(trainerId).filter(u -> u.getRole() == User.Role.TRAINER)
                .orElseThrow(() -> notFound("Trainer not found"));
        m.setTrainerId(t.getId());
        return members.save(m);
    }

    // ---------------------------------------------------------------- helpers

    private User staff(Long id) {
        return users.findById(id)
                .filter(u -> u.getRole() == User.Role.RECEPTIONIST || u.getRole() == User.Role.TRAINER)
                .orElseThrow(() -> notFound("Staff member not found"));
    }

    private void checkStaffRole(User.Role r) {
        if (r != User.Role.RECEPTIONIST && r != User.Role.TRAINER) throw bad("role must be RECEPTIONIST or TRAINER");
    }

    private static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }
    private static ResponseStatusException conflict(String m) { return new ResponseStatusException(HttpStatus.CONFLICT, m); }
    private static ResponseStatusException notFound(String m) { return new ResponseStatusException(HttpStatus.NOT_FOUND, m); }
}
