package com.meetolio.backend.common.error;

import lombok.Data;

/** エラーAPIレスポンスDTO */
@Data
public class ErrorResponseDto {
    private int status; // ステータスコード
    private String message; // エラーメッセージ

    public ErrorResponseDto(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
