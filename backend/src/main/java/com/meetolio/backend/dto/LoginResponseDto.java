package com.meetolio.backend.dto;

import lombok.Data;

/** ログインレスポンス用DTO */
@Data
public class LoginResponseDto {
    private String accessToken; // アクセストークン
}
