package com.sp_productservice.services;

public class CheckoutException extends RuntimeException {

    private final String errorCode;

    public CheckoutException(String message) {
        super(message);
        this.errorCode = "CHECKOUT_ERROR";
    }

    public CheckoutException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    // Common checkout error types as static methods
    public static CheckoutException emptyCart() {
        return new CheckoutException("Cart is empty. Cannot proceed with checkout.", "EMPTY_CART");
    }

    public static CheckoutException insufficientStock(String bookTitle) {
        return new CheckoutException("Insufficient stock for book: " + bookTitle, "INSUFFICIENT_STOCK");
    }

    public static CheckoutException invalidAddress() {
        return new CheckoutException("Invalid or incomplete shipping address", "INVALID_ADDRESS");
    }
}