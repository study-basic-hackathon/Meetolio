package com.meetolio.backend.common.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 共通エラーハンドリングクラス */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 認証エラー */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponseDto> handleUnauthorize(UnauthorizedException ex) {
        final HttpStatus STATUS = HttpStatus.UNAUTHORIZED;
        ErrorResponseDto errorResponseDto = new ErrorResponseDto(STATUS.value(), ex.getMessage());
        return ResponseEntity.status(STATUS).body(errorResponseDto);
    }

    /** NotFoundエラー */
    @ExceptionHandler
    public ResponseEntity<ErrorResponseDto> handleNotFound(NotFoundException ex) {
        final HttpStatus STATUS = HttpStatus.NOT_FOUND;
        ErrorResponseDto errorResponseDto = new ErrorResponseDto(STATUS.value(), ex.getMessage());
        return ResponseEntity.status(STATUS).body(errorResponseDto);
    }

    /** 重複エラー */
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponseDto> handleDuplicate(DuplicateException ex) {
        final HttpStatus STATUS = HttpStatus.CONFLICT;
        ErrorResponseDto errorResponseDto = new ErrorResponseDto(STATUS.value(), ex.getMessage());
        return ResponseEntity.status(STATUS).body(errorResponseDto);
    }

}
