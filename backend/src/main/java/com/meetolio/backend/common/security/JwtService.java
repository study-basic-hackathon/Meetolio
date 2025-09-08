package com.meetolio.backend.common.security;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

/** Jwtトークン操作Service */
@Service
public class JwtService {

    /** シークレットキー */
    private static final String SECRET_KEY = "sercret-key"; // TODO: 環境変数に設定

    /** アルゴリズム */
    private final Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

    /** JWTトークン検証用 */
    private final JWTVerifier verifier = JWT.require(algorithm).build();

    /** JWT作成 */
    public String generateToken(Integer userId) {

        // subにuserId入れる
        // TODO: 有効期限の設定がなし
        return JWT.create().withSubject(userId.toString()).sign(algorithm);
    }

    /** JWT解析 */
    public DecodedJWT verifyToken(String token) {
        return verifier.verify(token);
    }

    /** Subject(UserId)の抽出 */
    public String extractUserId(String token) {
        return verifyToken(token).getSubject();
    }
}
