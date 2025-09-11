package com.meetolio.backend.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meetolio.backend.common.error.NotFoundException;
import com.meetolio.backend.dto.AccountResponseDto;
import com.meetolio.backend.entity.UserEntity;
import com.meetolio.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/** アカウント関連Service */
@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    /** ユーザーRepository */
    private final UserRepository userRepository;

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
}
