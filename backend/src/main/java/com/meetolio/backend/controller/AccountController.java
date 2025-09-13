package com.meetolio.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meetolio.backend.dto.AccountResponseDto;
import com.meetolio.backend.form.AccountUpdateForm;
import com.meetolio.backend.service.AccountService;

import lombok.RequiredArgsConstructor;

/** アカウント関連Controller */
@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
public class AccountController {

    /** アカウントService */
    private final AccountService accountService;

    /** ログインユーザーアカウントの取得 */
    @GetMapping("/me")
    public ResponseEntity<AccountResponseDto> getMyAccount(Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        AccountResponseDto accountResponseDto = accountService.getAccount(userId);

        return ResponseEntity.status(HttpStatus.OK).body(accountResponseDto);
    }

    /** ログインユーザーメールアドレスの情報更新 */
    @PutMapping("/me/email")
    public ResponseEntity<AccountResponseDto> updateMyEmail(Principal principal, @RequestBody AccountUpdateForm form) {
        Integer userId = Integer.parseInt(principal.getName());
        AccountResponseDto accountResponseDto = accountService.updateEmail(userId, form);

        return ResponseEntity.status(HttpStatus.OK).body(accountResponseDto);
    }
}
