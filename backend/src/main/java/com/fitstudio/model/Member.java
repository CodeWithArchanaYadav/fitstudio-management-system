package com.fitstudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "members")
@Getter @Setter
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank @Pattern(regexp = "\\d{10,15}", message = "phone must be 10-15 digits")
    @Column(nullable = false, length = 15)
    private String phone;

    /** Plan name - kept as a string so the existing frontend keeps working. */
    @Column(length = 50)
    private String plan;

    private Long planId;
    private Long userId;      // login account (users.id, role MEMBER)
    private Long trainerId;   // assigned trainer (users.id, role TRAINER)

    private LocalDate joinDate;
    private LocalDate startDate;
    private LocalDate endDate;   // startDate + plan.durationDays

    @NotNull @Pattern(regexp = "Active|Inactive", message = "status must be Active or Inactive")
    @Column(nullable = false, length = 20)
    private String status = "Active";

    /** Optional login password on create; defaults to the phone number. Never returned. */
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
