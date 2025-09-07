package com.meetolio.backend.repository;

import org.apache.ibatis.annotations.Mapper;

import com.meetolio.backend.entity.UserEntity;

/** ユーザーテーブル用Repository */
@Mapper
public interface UserRepository {

    /** メールアドレス検索 */
    public UserEntity findByEmail(String email);

    /** ユーザー作成 */
    public void save(UserEntity userEntity);
}
