package com.meetolio.backend.dto;

import lombok.Data;

/** ポートフォリオ更新リクエスト用DTO */
@Data
public class PortfolioUpdateRequestDto {
    private String name;            // 氏名
    private String nameKana;        // 氏名カナ
    private String company;         // 会社名
    private String occupation;      // 役職
    private String description;     // 自己紹介
    private String nameCardImgUrl;  // 名刺画像URL
    private String email;           // メールアドレス
    private String twitter;         // Twitter URL
    private String linkedin;        // LinkedIn URL
    private String github;          // GitHub URL
    private String website;         // ウェブサイト URL
}