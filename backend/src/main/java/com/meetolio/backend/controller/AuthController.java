package com.meetolio.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.meetolio.backend.dto.SignupResponseDto;
import com.meetolio.backend.form.SignupForm;
import com.meetolio.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

/** 認証関連Controller */
@RestController
@RequiredArgsConstructor
public class AuthController {

    /** 認証Service */
    private final AuthService authService;

    /** 新規登録 */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody SignupForm form) {
        authService.register(form);

        SignupResponseDto signupResponseDto = new SignupResponseDto();

        return ResponseEntity.status(201).body(signupResponseDto);
    }
}
