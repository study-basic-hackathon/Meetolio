package com.meetolio.backend.form;

import lombok.Data;

/** メールアドレス変更用Form */
@Data
public class EmailUpdateForm {
    private String email; // メールアドレス
    private String password; // パスワード
}
