package com.fitstudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** Login account for every role: ADMIN, RECEPTIONIST, TRAINER, MEMBER. */
@Entity
@Table(name = "users")
@Getter @Setter
public class User {
    public enum Role { ADMIN, RECEPTIONIST, TRAINER, MEMBER }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank @Email
    @Column(unique = true, nullable = false)
    private String email;

    /** BCrypt hash. Accepted in requests, never returned in responses. */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false, length = 20)
    private String status = "Active";
}
