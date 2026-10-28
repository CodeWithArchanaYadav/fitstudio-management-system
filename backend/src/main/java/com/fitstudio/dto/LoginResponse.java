package com.fitstudio.dto;

public class LoginResponse {
    private final String token;
    private final String email;
    private final String role;
    private final String name;

    public LoginResponse(String token, String email, String role, String name) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.name = name;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getName() { return name; }
}
