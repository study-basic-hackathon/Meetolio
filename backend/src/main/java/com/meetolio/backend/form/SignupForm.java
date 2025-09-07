package com.meetolio.backend.form;

import lombok.Data;

/** 新規登録用Form */
@Data
public class SignupForm {
    private String email; // メールアドレス
    private String password; // パスワード
    private String name; // 氏名
    private String company; // 会社名・組織名
    private String occupation; // 職種・役職
}
