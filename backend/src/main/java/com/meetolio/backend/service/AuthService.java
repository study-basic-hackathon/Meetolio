package com.meetolio.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.DuplicateException;
import com.meetolio.backend.common.error.UnauthorizedException;
import com.meetolio.backend.entity.UserEntity;
import com.meetolio.backend.form.LoginForm;
import com.meetolio.backend.form.SignupForm;
import com.meetolio.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/** 認証関連Service */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    /** ユーザーRepository */
    private final UserRepository userRepository;

    /** パスワードエンコーダー */
    private final PasswordEncoder passwordEncoder;

    /** ユーザー登録 */
    public Integer register(SignupForm form) {
        UserEntity userEntity = userRepository.findByEmail(form.getEmail());

        if (userEntity != null) {
            // TODO: メッセージ共通化
            throw new DuplicateException("すでに存在しているメールアドレスです");
        }

        userEntity = new UserEntity();
        userEntity.setEmail(form.getEmail());
        userEntity.setPasswordHash(passwordEncoder.encode(form.getPassword()));
        userRepository.save(userEntity);

        return userEntity.getId();
    }

    /** ログイン */
    public Integer login(LoginForm form) {
        UserEntity userEntity = userRepository.findByEmail(form.getEmail());

        // メールアドレス不一致とパスワード不一致のエラーメッセージは一緒だが、今後の拡張可能性のため処理をわけている。：T.ARAKI
        if (userEntity == null) {
            // TODO: メッセージ共通化
            throw new UnauthorizedException("メールアドレス または パスワードが違います");
        }

        if (!passwordEncoder.matches(form.getPassword(), userEntity.getPasswordHash())) {
            // TODO: メッセージ共通化
            throw new UnauthorizedException("メールアドレス または パスワードが違います");
        }

        return userEntity.getId();

    }
}
