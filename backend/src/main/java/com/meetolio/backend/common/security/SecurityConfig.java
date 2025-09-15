package com.meetolio.backend.common.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/** セキュリティConfig */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /** 認証フィルター */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /** 認証エラーハンドリング */
    private final CustomAuthenticationEntryPoint customEntryPoint;

    /** セキュリティフィルターの設定 */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // リクエスト認可制御
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/portfolio/**").permitAll()
                .anyRequest().authenticated());

        // CSRF無効化
        http.csrf(csrf -> csrf.disable());

        // JWT認証フィルター処理を追加
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // エラーハンドリング
        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint(customEntryPoint));

        return http.build();
    }

    /** パスワードハッシュ化用 */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
