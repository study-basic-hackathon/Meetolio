package com.meetolio.backend.repository;

import org.apache.ibatis.annotations.Mapper;

import com.meetolio.backend.entity.PortfolioEntity;

/** ポートフォリオテーブル用Repository */
@Mapper
public interface PortfolioRepository {

    /** ポートフォリオのID検索 */
    public PortfolioEntity findById(Integer userId);

    /** ポートフォリオの保存 */
    public void save(PortfolioEntity entity);

    /** ユーザーIDによるポートフォリオの削除 */
    void deleteByUserId(Integer userId);
}
