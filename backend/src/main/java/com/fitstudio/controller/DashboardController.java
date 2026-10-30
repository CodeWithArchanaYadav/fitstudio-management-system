package com.fitstudio.controller;

import com.fitstudio.model.Checkin;
import com.fitstudio.model.Member;
import com.fitstudio.model.User;
import com.fitstudio.repository.Repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

/** Dashboard stats (per role), check-in and weekly attendance. Payments are not part of this module. */
@RestController
@RequestMapping("/api")
public class DashboardController {

    private final UserRepository users;
    private final MemberRepository members;
    private final MembershipPlanRepository plans;
    private final TrainingSessionRepository sessions;
    private final CheckinRepository checkins;

    public DashboardController(UserRepository users, MemberRepository members, MembershipPlanRepository plans,
                               TrainingSessionRepository sessions, CheckinRepository checkins) {
        this.users = users;
        this.members = members;
        this.plans = plans;
        this.sessions = sessions;
        this.checkins = checkins;
    }

    @GetMapping("/dashboard/stats")
    public Map<String, Object> stats(Authentication auth) {
        User u = users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        LocalDate today = LocalDate.now();
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("role", u.getRole().name());

        switch (u.getRole()) {
            case ADMIN -> {
                long total = members.count();
                long active = members.countByStatus("Active");
                s.put("totalMembers", total);
                s.put("activeMembers", active);
                s.put("inactiveMembers", total - active);
                s.put("activeTrainers", users.countByRoleAndStatus(User.Role.TRAINER, "Active"));
                s.put("plansCount", plans.count());
                s.put("monthlyRevenue", 0);       // payments module is handled separately
            }
            case RECEPTIONIST -> {
                s.put("todayCheckins", checkins.countByCheckInTimeBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay()));
                s.put("activeMembers", members.countByStatus("Active"));
                s.put("expiringThisWeek", members.countByStatusAndEndDateBetween("Active", today, today.plusDays(7)));
            }
            case TRAINER -> {
                s.put("assignedClients", members.countByTrainerId(u.getId()));
                s.put("todaySessions", sessions.countByTrainerIdAndSessionTimeBetween(
                        u.getId(), today.atStartOfDay(), today.plusDays(1).atStartOfDay()));
            }
            case MEMBER -> {
                Member m = members.findByUserId(u.getId()).orElse(null);
                s.put("daysRemaining", m == null ? 0 : MemberPortalController.daysRemaining(m));
                String trainer = null;
                if (m != null && m.getTrainerId() != null)
                    trainer = users.findById(m.getTrainerId()).map(User::getName).orElse(null);
                s.put("trainer", trainer);
            }
        }
        return s;
    }

    /** Current week (Mon-Sun) check-in counts: [{day:"Mon",count:3}, ...] - same shape as the old attendance table. */
    @GetMapping("/dashboard/attendance")
    public List<Map<String, Object>> attendance() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        int[] counts = new int[7];
        for (Checkin c : checkins.findByCheckInTimeBetween(monday.atStartOfDay(), monday.plusDays(7).atStartOfDay()))
            counts[c.getCheckInTime().getDayOfWeek().getValue() - 1]++;

        List<Map<String, Object>> out = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("day", DayOfWeek.of(i + 1).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            row.put("count", counts[i]);
            out.add(row);
        }
        return out;
    }

    /** Receptionist marks a member as arrived. Only active, non-expired members, once per day. */
    @PostMapping("/checkins/{memberId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Checkin checkIn(@PathVariable Long memberId) {
        Member m = members.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        LocalDate today = LocalDate.now();
        if (!"Active".equals(m.getStatus()) || (m.getEndDate() != null && m.getEndDate().isBefore(today)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Membership is not active or has expired");
        if (checkins.existsByMemberIdAndCheckInTimeBetween(memberId, today.atStartOfDay(), today.plusDays(1).atStartOfDay()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already checked in today");

        Checkin c = new Checkin();
        c.setMemberId(memberId);
        c.setCheckInTime(LocalDateTime.now());
        return checkins.save(c);
    }

    @GetMapping("/checkins/today")
    public List<Checkin> todayCheckins() {
        LocalDate today = LocalDate.now();
        return checkins.findByCheckInTimeBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay());
    }
}
