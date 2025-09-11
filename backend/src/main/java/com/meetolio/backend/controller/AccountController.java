package com.meetolio.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meetolio.backend.dto.AccountResponseDto;
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
}
