package com.fitstudio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(c -> c.configurationSource(request -> {
                var cfg = new org.springframework.web.cors.CorsConfiguration();
                cfg.setAllowedOriginPatterns(java.util.List.of("http://localhost:*"));
                cfg.setAllowedMethods(java.util.List.of("GET","POST","PUT","DELETE","OPTIONS"));
                cfg.setAllowedHeaders(java.util.List.of("*"));
                return cfg;
            }))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                .authenticationEntryPoint((req, res, ex) -> json(res, 401, "Unauthorized", "Login required or token invalid"))
                .accessDeniedHandler((req, res, ex) -> json(res, 403, "Forbidden", "You do not have access to this resource")))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // ADMIN only
                .requestMatchers("/api/staff/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/members/*/trainer/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/plans").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/plans/**").authenticated()

                // Members: everyone on staff may read, ADMIN/RECEPTIONIST may change
                .requestMatchers(HttpMethod.GET, "/api/members/**").hasAnyRole("ADMIN", "RECEPTIONIST", "TRAINER")
                .requestMatchers("/api/members/**").hasAnyRole("ADMIN", "RECEPTIONIST")

                // Trainer
                .requestMatchers("/api/trainer/**", "/api/workouts/**", "/api/sessions/**").hasRole("TRAINER")

                // Check-in
                .requestMatchers("/api/checkins/**").hasAnyRole("ADMIN", "RECEPTIONIST")

                // Member portal
                .requestMatchers("/api/me/**").hasRole("MEMBER")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private static void json(jakarta.servlet.http.HttpServletResponse res, int status, String error, String message)
            throws java.io.IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.getWriter().write("{\"status\":" + status + ",\"error\":\"" + error + "\",\"message\":\"" + message + "\"}");
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }

    // DEV ONLY: passwords are stored and compared as plain text (no hashing).
    // For real use / submission switch back to: return new BCryptPasswordEncoder();
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String storedPassword) {
                return storedPassword != null && storedPassword.equals(rawPassword.toString());
            }
        };
    }
}
