package com.fitstudio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "training_sessions")
@Getter @Setter
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long trainerId;   // set from the token, ignored in requests

    @NotNull
    private Long memberId;

    @NotNull
    private LocalDateTime sessionTime;

    private String focus;

    @Pattern(regexp = "Scheduled|Completed|Cancelled")
    @Column(nullable = false, length = 20)
    private String status = "Scheduled";
}
