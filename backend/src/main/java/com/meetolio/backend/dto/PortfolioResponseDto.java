package com.meetolio.backend.dto;

import lombok.Data;

/** ポートフォリオ情報レスポンス用DTO */
@Data
public class PortfolioResponseDto {
    private Integer userId; // ユーザーID
    private String name; // 氏名
    private String nameKana; // 氏名カナ
    private String company; // 会社名
    private String occupation; // 職種
    private String description; // 自己紹介
    private String email; // メールアドレス
    private String website; // ウェブサイト
    private String twitter; // Twitterアカウント
    private String github; // GitHubアカウント
    private String linkedin; // LinkedInアカウント
    private String nameCardImgUrl; // 名刺画像URL
    private String email; // メールアドレス
    private String twitter; // Twitter URL
    private String linkedin; // LinkedIn URL
    private String github; // GitHub URL
    private String website; // ウェブサイト URL
}
