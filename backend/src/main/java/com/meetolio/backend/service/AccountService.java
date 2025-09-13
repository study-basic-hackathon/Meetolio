package com.meetolio.backend.service;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.NotFoundException;
import com.meetolio.backend.dto.AccountResponseDto;
import com.meetolio.backend.entity.UserEntity;
import com.meetolio.backend.form.AccountUpdateForm;
import com.meetolio.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/** アカウント関連Service */
@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    /** ユーザーRepository */
    private final UserRepository userRepository;

    /** パスワードエンコーダー */
    private final PasswordEncoder passwordEncoder;

    /** ユーザーアカウント取得 */
    public AccountResponseDto getAccount(Integer userId) {
        UserEntity userEntity = userRepository.findById(userId);

        if (userEntity == null) {
            // TODO: メッセージ共通化
            throw new NotFoundException("ユーザーアカウントが見つかりません");
        }

        ModelMapper mapper = new ModelMapper();
        AccountResponseDto accountResponseDto = mapper.map(userEntity, AccountResponseDto.class);

        return accountResponseDto;
    }

    /** メールアドレス変更 */
    public AccountResponseDto updateEmail(Integer userId, AccountUpdateForm form) {
        // パスワード一致確認
        UserEntity userEntity = userRepository.findById(userId);
        if (!passwordEncoder.matches(form.getPassword(), userEntity.getPasswordHash())) {
            // 403ステータスコードをthrowする。
            throw new AccessDeniedException("パスワードが一致しません");
        }

        // メールアドレス変更
        userEntity.setEmail(form.getEmail());
        userEntity.setUpdatedAt(LocalDateTime.now());
        userRepository.update(userEntity);

        // 変更後の情報をセット
        AccountResponseDto accountResponseDto = new AccountResponseDto();
        accountResponseDto.setId(userEntity.getId());
        accountResponseDto.setEmail(userEntity.getEmail());
        accountResponseDto.setCreatedAt(userEntity.getCreatedAt());
        accountResponseDto.setUpdatedAt(userEntity.getUpdatedAt());

        return accountResponseDto;
    }
}
