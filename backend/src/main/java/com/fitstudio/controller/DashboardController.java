package com.fitstudio.controller;

import com.fitstudio.model.Attendance;
import com.fitstudio.repository.AttendanceRepository;
import com.fitstudio.repository.MemberRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final MemberRepository memberRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardController(MemberRepository memberRepository, AttendanceRepository attendanceRepository) {
        this.memberRepository = memberRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long total = memberRepository.count();
        long active = memberRepository.findAll().stream()
                .filter(m -> "Active".equals(m.getStatus())).count();
        return Map.of(
                "totalMembers", total,
                "activeMembers", active,
                "inactiveMembers", total - active,
                "monthlyRevenue", active * 999
        );
    }

    @GetMapping("/attendance")
    public List<Attendance> attendance() {
        return attendanceRepository.findAll();
    }
}
