package com.fitstudio.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "workout_routines")
@Getter @Setter
public class WorkoutRoutine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String goal;        // NEW
    private String schedule;    // NEW
    private String targetMuscle;
    private String difficulty;

    @Valid
    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private List<WorkoutExercise> exercises = new ArrayList<>();   // was a TEXT field

    private Long trainerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_workouts", joinColumns = @JoinColumn(name = "routine_id"))
    @Column(name = "member_id")
    private Set<Long> memberIds = new HashSet<>();

    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }

    public void replaceExercises(List<WorkoutExercise> incoming) {
        exercises.clear();
        if (incoming == null) return;
        int i = 0;
        for (WorkoutExercise e : incoming) {
            e.setId(null);
            e.setRoutine(this);
            e.setSortOrder(i++);
            exercises.add(e);
        }
    }
}