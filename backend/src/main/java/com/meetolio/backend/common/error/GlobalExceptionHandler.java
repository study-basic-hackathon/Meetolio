package com.meetolio.backend.common.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 共通エラーハンドリングクラス */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 重複エラー */
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponseDto> handleDuplicate(DuplicateException ex) {
        final HttpStatus STAUTS = HttpStatus.CONFLICT;
        ErrorResponseDto errorResponseDto = new ErrorResponseDto(STAUTS.value(), ex.getMessage());
        return ResponseEntity.status(STAUTS).body(errorResponseDto);
    }

}
