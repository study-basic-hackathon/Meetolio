package com.meetolio.backend.common.security;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

/** Jwtトークン操作Service */
@Service
public class JwtService {

    /** シークレットキー */
    private static final String SECRET_KEY = "sercret-key"; // TODO: 環境変数に設定

    /** アルゴリズム */
    private final Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

    /** JWT作成 */
    public String generateToken(Integer userId) {

        // subにuserId入れる
        // TODO: 有効期限の設定がなし
        return JWT.create().withSubject(userId.toString()).sign(algorithm);
    }
}
