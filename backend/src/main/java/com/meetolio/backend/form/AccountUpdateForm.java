package com.meetolio.backend.form;

import lombok.Data;

/** アカウント情報更新用Form */
@Data
public class AccountUpdateForm {
    private String email; // メールアドレス
    private String password; // パスワード
}
