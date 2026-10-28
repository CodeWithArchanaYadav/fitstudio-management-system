package com.fitstudio.repository;

import com.fitstudio.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** All repository interfaces in one file. */
public final class Repositories {
    private Repositories() {}

    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);
        boolean existsByEmail(String email);
        boolean existsByEmailAndIdNot(String email, Long id);
        List<User> findByRole(User.Role role);
        long countByRoleAndStatus(User.Role role, String status);
    }

    public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {
        boolean existsByName(String name);
        boolean existsByNameAndIdNot(String name, Long id);
    }

    public interface MemberRepository extends JpaRepository<Member, Long> {
        Optional<Member> findByUserId(Long userId);
        boolean existsByEmail(String email);
        boolean existsByPlanId(Long planId);
        List<Member> findByTrainerId(Long trainerId);
        long countByStatus(String status);
        long countByTrainerId(Long trainerId);
        long countByStatusAndEndDateBetween(String status, LocalDate from, LocalDate to);
    }

    public interface WorkoutRoutineRepository extends JpaRepository<WorkoutRoutine, Long> {
        List<WorkoutRoutine> findByTrainerId(Long trainerId);
        void deleteByTrainerId(Long trainerId);

        @Query("select r from WorkoutRoutine r where :memberId member of r.memberIds")
        List<WorkoutRoutine> findAssignedTo(@Param("memberId") Long memberId);
    }

    public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
        List<TrainingSession> findByTrainerIdOrderBySessionTime(Long trainerId);
        List<TrainingSession> findByTrainerIdAndSessionTimeBetweenOrderBySessionTime(Long trainerId, LocalDateTime from, LocalDateTime to);
        long countByTrainerIdAndSessionTimeBetween(Long trainerId, LocalDateTime from, LocalDateTime to);
        void deleteByTrainerId(Long trainerId);
        void deleteByMemberId(Long memberId);
    }

    public interface CheckinRepository extends JpaRepository<Checkin, Long> {
        List<Checkin> findByCheckInTimeBetween(LocalDateTime from, LocalDateTime to);
        boolean existsByMemberIdAndCheckInTimeBetween(Long memberId, LocalDateTime from, LocalDateTime to);
        long countByCheckInTimeBetween(LocalDateTime from, LocalDateTime to);
        void deleteByMemberId(Long memberId);
    }
}
