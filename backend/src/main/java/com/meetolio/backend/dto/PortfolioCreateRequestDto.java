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
    private String description; // 自己紹介（任意）
    private String nameCardImgUrl; // 名刺画像URL（任意）
    private String email; // メールアドレス（任意）
    private String twitter; // Twitter URL（任意）
    private String linkedin; // LinkedIn URL（任意）
    private String github; // GitHub URL（任意）
    private String website; // ウェブサイト URL（任意）
}
