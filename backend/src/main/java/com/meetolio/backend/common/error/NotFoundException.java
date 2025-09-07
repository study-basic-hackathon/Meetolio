package com.meetolio.backend.common.error;

/** NotFoundException */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
