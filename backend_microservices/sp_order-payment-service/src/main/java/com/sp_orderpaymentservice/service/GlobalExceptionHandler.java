package com.sp_orderpaymentservice.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppExceptions.ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFoundException(
            AppExceptions.ResourceNotFoundException ex, WebRequest request) {
        ApiResponse response = new ApiResponse(false, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AppExceptions.AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(
            AppExceptions.AccessDeniedException ex, WebRequest request) {
        ApiResponse response = new ApiResponse(false, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AppExceptions.InvalidOperationException.class)
    public ResponseEntity<ApiResponse> handleInvalidOperationException(
            AppExceptions.InvalidOperationException ex, WebRequest request) {
        ApiResponse response = new ApiResponse(false, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AppExceptions.InvalidOrderStatusException.class)
    public ResponseEntity<ApiResponse> handleInvalidOrderStatusException(
            AppExceptions.InvalidOrderStatusException ex, WebRequest request) {
        ApiResponse response = new ApiResponse(false, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiResponse response = new ApiResponse(false, "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}