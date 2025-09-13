package com.meetolio.backend.repository;

import org.apache.ibatis.annotations.Mapper;

import com.meetolio.backend.entity.UserEntity;

/** ユーザーテーブル用Repository */
@Mapper
public interface UserRepository {

    /** ID検索 */
    public UserEntity findById(Integer id);

    /** メールアドレス検索 */
    public UserEntity findByEmail(String email);

    /** ユーザー作成 */
    public void save(UserEntity userEntity);

    /** 更新 */
    public void update(UserEntity userEntity);
}
