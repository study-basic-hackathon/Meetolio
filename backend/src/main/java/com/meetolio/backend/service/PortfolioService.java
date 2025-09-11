package com.meetolio.backend.service;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.NotFoundException;
import com.meetolio.backend.dto.PortfolioCreateRequestDto;
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

        // TODO: メッセージ共通化
        if (portfolioEntity == null) {
            throw new NotFoundException("ポートフォリオが見つかりません");
        }

        // マッパーでentityをdtoに変換
        ModelMapper mapper = new ModelMapper();
        PortfolioResponseDto portfolioResponseDto = mapper.map(portfolioEntity, PortfolioResponseDto.class);

        return portfolioResponseDto;
    }

    /** ポートフォリオ作成 */
    public void createPortfolio(PortfolioCreateRequestDto request) {
        PortfolioEntity entity = new PortfolioEntity();
        
        // userIdは必須項目
        entity.setUserId(request.getUserId());
        
        // その他の項目は任意（nullでも可）
        entity.setName(request.getName());
        entity.setNameKana(request.getNameKana());
        entity.setCompany(request.getCompany());
        entity.setOccupation(request.getOccupation());
        entity.setIntroduction(request.getIntroduction());
        entity.setNameCardImgUrl(request.getNameCardImgUrl());
        
        // 作成日時・更新日時を設定
        LocalDateTime now = LocalDateTime.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        
        portfolioRepository.insert(entity);
    }
}
