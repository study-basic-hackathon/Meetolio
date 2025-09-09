package com.meetolio.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.meetolio.backend.common.security.JwtService;
import com.meetolio.backend.dto.LoginResponseDto;
import com.meetolio.backend.dto.SignupResponseDto;
import com.meetolio.backend.form.LoginForm;
import com.meetolio.backend.form.SignupForm;
import com.meetolio.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

/** 認証関連Controller */
@RestController
@RequiredArgsConstructor
public class AuthController {

    /** 認証Service */
    private final AuthService authService;

    /** JWTService */
    private final JwtService jwtService;

    /** 新規登録 */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody SignupForm form) {
        Integer userId = authService.register(form);
        String accessToken = jwtService.generateToken(userId);

        SignupResponseDto signupResponseDto = new SignupResponseDto();
        signupResponseDto.setAccessToken(accessToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(signupResponseDto);
    }

    /** ログイン */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginForm form) {
        Integer userId = authService.login(form);
        String accessToken = jwtService.generateToken(userId);

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setAccessToken(accessToken);

        return ResponseEntity.status(HttpStatus.OK).body(loginResponseDto);
    }
}
