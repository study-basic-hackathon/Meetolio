package com.meetolio.backend.entity;

import java.time.LocalDateTime;

import lombok.Data;

/** ユーザーテーブルEntity */
@Data
public class UserEntity {
    private Integer id; // ユーザーID
    private String email; // メールアドレス
    private String passwordHash; // ハッシュパスワード
    private LocalDateTime createdAt; // 作成日時
    private LocalDateTime updatedAt; // 更新日時
}
