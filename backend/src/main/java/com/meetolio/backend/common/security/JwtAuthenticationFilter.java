package com.meetolio.backend.common.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/** 認証フィルター設定クラス */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** JWTService */
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Authorizationヘッダーからトークンを取得
        String authHeader = request.getHeader("Authorization");

        // トークンなしの場合は認証なし
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // トークンを解析し認証
        String token = authHeader.substring(7);

        try {
            String userId = jwtService.extractUserId(token);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null, null);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            // トークンが無効な場合は認証なしで次へ
            // SecurityContextに認証情報を設定せず、Spring Securityがこれを未認証として扱う
        }

        filterChain.doFilter(request, response);
    }

}
