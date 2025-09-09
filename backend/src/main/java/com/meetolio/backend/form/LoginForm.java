package com.meetolio.backend.form;

import lombok.Data;

/** ログイン用Form */
@Data
public class LoginForm {
    private String email; // メールアドレス
    private String password; // パスワード
}
