package com.fitstudio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "membership_plans")
@Getter @Setter
public class MembershipPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @NotNull @Min(1)
    private Integer durationDays;

    @NotNull @DecimalMin("0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fee;

    @Column(length = 1000)
    private String features;

    @Column(nullable = false, length = 20)
    private String status = "Active";
}
