package com.meetolio.backend.common.error;

/** 認証エラーException */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
