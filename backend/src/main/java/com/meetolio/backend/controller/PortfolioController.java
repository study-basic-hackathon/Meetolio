package com.meetolio.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meetolio.backend.dto.PortfolioResponseDto;
import com.meetolio.backend.service.PortfolioService;

import lombok.RequiredArgsConstructor;

/** ポートフォリオ関連Controller */
@RestController
@RequiredArgsConstructor
@RequestMapping("/portfolio")
public class PortfolioController {

    /** ポートフォリオService */
    private final PortfolioService portfolioService;

    /** ポートフォリオ詳細の取得 */
    @GetMapping("/{userId}")
    public ResponseEntity<PortfolioResponseDto> getPortfolio(@PathVariable Integer userId) {

        PortfolioResponseDto portfolioResponseDto = portfolioService.getPortfolio(userId);

        // ステータス200
        return ResponseEntity.ok(portfolioResponseDto);
    }

}
