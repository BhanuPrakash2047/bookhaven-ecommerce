package com.sp_productservice.services;

public class BadRequestException extends RuntimeException {
    private final String fieldName;
    private final String message;

    public BadRequestException(String fieldName, String message) {
        super(String.format("Invalid %s: %s", fieldName, message));
        this.fieldName = fieldName;
        this.message = message;
    }

    public BadRequestException(String message) {
        super(message);
        this.fieldName = "";
        this.message = message;
    }

    public String getFieldName() {
        return fieldName;
    }

    @Override
    public String getMessage() {
        return message;
    }
}