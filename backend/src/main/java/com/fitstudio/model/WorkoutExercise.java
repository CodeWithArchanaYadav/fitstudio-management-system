package com.fitstudio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workout_exercises")
@Getter @Setter
public class WorkoutExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "routine_id", nullable = false)
    private WorkoutRoutine routine;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @NotBlank @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String name;

    @NotNull @Min(1) @Max(99)
    @Column(nullable = false)
    private Integer sets;

    @NotBlank @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String reps;            // "10", "10-12", "30 sec"

    @Size(max = 100)
    private String weightOrDifficulty;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;
}