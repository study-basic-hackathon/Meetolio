package com.meetolio.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.DuplicateException;
import com.meetolio.backend.entity.UserEntity;
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
}
