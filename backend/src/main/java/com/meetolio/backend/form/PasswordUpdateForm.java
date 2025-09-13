package com.meetolio.backend.form;

import lombok.Data;

/** パスワード変更用Form */
@Data
public class PasswordUpdateForm {
    private String currentPassword; // 現在のパスワード
    private String newPassword; // 新しいパスワード
}
