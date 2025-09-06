package com.meetolio.backend.entity;

import lombok.Data;

/** ポートフォリオテーブルEntity */
@Data
public class PortfolioEntity {
    private Integer userId; // ユーザーID
    private String name; // 氏名
    private String nameKana; // 氏名カナ
    private String company; // 会社名
    private String occupation; // 職種
    private String introduction; // 自己紹介
    private String nameCardImgUrl; // 名刺画像URL
}
