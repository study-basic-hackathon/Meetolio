package com.meetolio.backend.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.dto.PortfolioResponseDto;
import com.meetolio.backend.entity.PortfolioEntity;
import com.meetolio.backend.repository.PortfolioRepository;

import lombok.RequiredArgsConstructor;

/** ポートフォリオ関連Service */
@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {

    /** ポートフォリオRepository */
    private final PortfolioRepository portfolioRepository;

    /** ポートフォリオの取得 */
    public PortfolioResponseDto getPortfolio(Integer userId) {

        PortfolioEntity portfolioEntity = portfolioRepository.findById(userId);

        // マッパーでentityをdtoに変換
        ModelMapper mapper = new ModelMapper();
        PortfolioResponseDto portfolioResponseDto = mapper.map(portfolioEntity, PortfolioResponseDto.class);

        return portfolioResponseDto;
    }
}
