package com.meetolio.backend.dto;

import lombok.Data;

/** ポートフォリオ作成リクエストDTO */
@Data
public class PortfolioCreateRequestDto {
    private Integer userId; // ユーザーID（必須）
    private String name; // 氏名（任意）
    private String nameKana; // 氏名カナ（任意）
    private String company; // 会社名（任意）
    private String occupation; // 職種（任意）
    private String introduction; // 自己紹介（任意）
    private String nameCardImgUrl; // 名刺画像URL（任意）
}
