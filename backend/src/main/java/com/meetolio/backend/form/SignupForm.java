package com.meetolio.backend.form;

import lombok.Data;

/** 新規登録用Form */
@Data
public class SignupForm {
    private String email; // メールアドレス
    private String password; // パスワード
}
