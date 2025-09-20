package com.meetolio.backend.entity;

import java.time.LocalDateTime;

import lombok.Data;

/** ポートフォリオテーブルEntity */
@Data
public class PortfolioEntity {
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
    private LocalDateTime createdAt; // 作成日時
    private LocalDateTime updatedAt; // 更新日時
}
