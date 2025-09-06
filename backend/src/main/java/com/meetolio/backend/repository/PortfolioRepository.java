package com.meetolio.backend.repository;

import org.apache.ibatis.annotations.Mapper;

import com.meetolio.backend.entity.PortfolioEntity;

/** ポートフォリオテーブル用Repository */
@Mapper
public interface PortfolioRepository {

    /** ポートフォリオのID検索 */
    public PortfolioEntity findById(Integer userId);
}
