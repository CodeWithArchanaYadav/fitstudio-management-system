package com.fitstudio.controller;

import com.fitstudio.model.Checkin;
import com.fitstudio.model.Member;
import com.fitstudio.repository.Repositories.CheckinRepository;
import com.fitstudio.repository.Repositories.MemberRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/receptionist/attendance")
@PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
public class ReceptionistAttendanceController {

    private final CheckinRepository checkins;
    private final MemberRepository members;

    public ReceptionistAttendanceController(
            CheckinRepository checkins,
            MemberRepository members) {

        this.checkins = checkins;
        this.members = members;
    }

    // 1. Record Member Check-In
    @PostMapping("/checkin/{memberId}")
    public ResponseEntity<Checkin> recordCheckIn(
            @PathVariable Long memberId) {

        Member member = members.findById(memberId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Member not found"));

        LocalDate today = LocalDate.now();

        if (!"Active".equalsIgnoreCase(member.getStatus())
                || (member.getEndDate() != null
                && member.getEndDate().isBefore(today))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Member membership is expired or inactive");
        }

        Checkin checkin = new Checkin();

        checkin.setMemberId(memberId);
        checkin.setCheckInTime(LocalDateTime.now());

        Checkin savedCheckin = checkins.save(checkin);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCheckin);
    }

    // 2. View Today's Attendance
    @GetMapping("/today")
    public List<Checkin> getTodayAttendance() {

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay()
                .minusNanos(1);

        return checkins.findByCheckInTimeBetween(start, end);
    }

    // 3. Get Today's Total Check-In Count
    @GetMapping("/count")
    public long getTodayCheckInCount() {

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay()
                .minusNanos(1);

        return checkins.countByCheckInTimeBetween(start, end);
    }
}