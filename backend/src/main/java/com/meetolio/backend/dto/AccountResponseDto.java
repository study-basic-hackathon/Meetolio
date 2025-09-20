package com.meetolio.backend.dto;

import java.time.LocalDateTime;

import lombok.Data;

/** アカウント情報レスポンス用DTO */
@Data
public class AccountResponseDto {
    private Integer id; // ユーザーID
    private String email; // メールアドレス
    private LocalDateTime createdAt; // 作成日時
    private LocalDateTime updatedAt; // 更新日時
}
