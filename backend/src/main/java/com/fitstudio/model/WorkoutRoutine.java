package com.fitstudio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workout_routines")
@Getter @Setter
public class WorkoutRoutine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String targetMuscle;
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String exercises;

    private Long trainerId;

    /** Members this routine is assigned to (table member_workouts). */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_workouts", joinColumns = @JoinColumn(name = "routine_id"))
    @Column(name = "member_id")
    private Set<Long> memberIds = new HashSet<>();
}
