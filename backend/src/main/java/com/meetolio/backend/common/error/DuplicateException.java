package com.meetolio.backend.common.error;

/** 重複エラーException */
public class DuplicateException extends RuntimeException {
    public DuplicateException(String message) {
        super(message);
    }
}
