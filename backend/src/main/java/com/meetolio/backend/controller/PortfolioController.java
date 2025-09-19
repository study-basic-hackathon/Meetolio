package com.meetolio.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.meetolio.backend.dto.PortfolioCreateRequestDto;
import com.meetolio.backend.dto.PortfolioResponseDto;
import com.meetolio.backend.dto.PortfolioUpdateRequestDto;
import com.meetolio.backend.service.PortfolioService;

import lombok.RequiredArgsConstructor;

/** ポートフォリオ関連Controller */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolio")
public class PortfolioController {

    /** ポートフォリオService */
    private final PortfolioService portfolioService;

    /** ポートフォリオ詳細の取得 */
    @GetMapping("/{userId}")
    public ResponseEntity<PortfolioResponseDto> getPortfolio(@PathVariable Integer userId) {

        PortfolioResponseDto portfolioResponseDto = portfolioService.getPortfolio(userId);

        return ResponseEntity.status(HttpStatus.OK).body(portfolioResponseDto);
    }

    /** ポートフォリオ作成 */
    @PostMapping
    public ResponseEntity<Void> createPortfolio(Principal principal, @RequestBody PortfolioCreateRequestDto request) {
        Integer userId = Integer.parseInt(principal.getName());

        portfolioService.createPortfolio(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /** ポートフォリオ更新 */
    @PutMapping("/{userId}")
    public ResponseEntity<Void> updatePortfolio(
            Principal principal,
            @PathVariable Integer userId,
            @RequestBody PortfolioUpdateRequestDto request) {
        Integer loginUserId = Integer.parseInt(principal.getName());

        // ログインユーザーと更新対象の一致チェック
        if (!loginUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        portfolioService.updatePortfolio(userId, request);
        return ResponseEntity.ok().build();
    }
}
