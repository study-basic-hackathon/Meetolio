package com.meetolio.backend.dto;

import lombok.Data;

/** 新規登録レスポンス用DTO */
@Data
public class SignupResponseDto {
    private String accessToken; // アクセストークン
}
