package com.meetolio.backend.repository;

import org.springframework.stereotype.Repository;

import com.meetolio.backend.entity.PortfolioEntity;

import lombok.RequiredArgsConstructor;

/** ポートフォリオテーブル用Repository */
@Repository
@RequiredArgsConstructor
public class PortfolioRepository {

    /** ポートフォリオのID検索 */
    public PortfolioEntity findById(String userId) {

        // テスト用データ
        PortfolioEntity portfolioEntity = new PortfolioEntity();
        portfolioEntity.setUserId("test_id");
        portfolioEntity.setName("test_name");
        portfolioEntity.setNameKana("test_kana");
        portfolioEntity.setCompany("test_company");

        return portfolioEntity;
    }
}
