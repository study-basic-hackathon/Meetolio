package com.meetolio.backend.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.NotFoundException;
import com.meetolio.backend.dto.PortfolioCreateRequestDto;
import com.meetolio.backend.dto.PortfolioResponseDto;
import com.meetolio.backend.dto.PortfolioUpdateRequestDto;
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
    public void createPortfolio(Integer userId, PortfolioCreateRequestDto request) {
        // userIdとrequestのuserIdが異なる場合は権限エラー(403)
        if (!userId.equals(request.getUserId())) {
            throw new AccessDeniedException("不正なユーザーIDです");
        }

        PortfolioEntity entity = new PortfolioEntity();

        // userIdは必須項目
        entity.setUserId(request.getUserId());

        // その他の項目は任意（nullでも可）
        entity.setName(request.getName());
        entity.setNameKana(request.getNameKana());
        entity.setCompany(request.getCompany());
        entity.setOccupation(request.getOccupation());
        entity.setDescription(request.getDescription());
        entity.setNameCardImgUrl(request.getNameCardImgUrl());
        entity.setEmail(request.getEmail());
        entity.setTwitter(request.getTwitter());
        entity.setLinkedin(request.getLinkedin());
        entity.setGithub(request.getGithub());
        entity.setWebsite(request.getWebsite());

        portfolioRepository.save(entity);
    }

    /** ポートフォリオ更新 */
    public void updatePortfolio(Integer userId, PortfolioUpdateRequestDto request) {
        PortfolioEntity entity = portfolioRepository.findById(userId);

        if (entity == null) {
            throw new NotFoundException("ポートフォリオが見つかりません");
        }

        // 必要に応じてフィールドを更新（null はスキップする設計でもOK）
        entity.setName(request.getName());
        entity.setNameKana(request.getNameKana());
        entity.setCompany(request.getCompany());
        entity.setOccupation(request.getOccupation());
        entity.setDescription(request.getDescription());
        entity.setNameCardImgUrl(request.getNameCardImgUrl());
        entity.setEmail(request.getEmail());
        entity.setTwitter(request.getTwitter());
        entity.setLinkedin(request.getLinkedin());
        entity.setGithub(request.getGithub());
        entity.setWebsite(request.getWebsite());

        portfolioRepository.save(entity);
    }
}
