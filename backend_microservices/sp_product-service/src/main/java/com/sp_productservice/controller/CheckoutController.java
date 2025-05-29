package com.sp_productservice.controller;

import com.sp_productservice.dto.CheckoutDTO;
import com.sp_productservice.modal.Address;
import com.sp_productservice.services.CheckoutException;
import com.sp_productservice.services.CheckoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private static final Logger logger = LoggerFactory.getLogger(CheckoutController.class);

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping
    public ResponseEntity<?> checkout(
            @RequestBody Address shippingAddress,
            @RequestHeader("userName") String username) {

        try {
            // Input validation
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username not provided in header");
            }

            if (shippingAddress == null) {
                return ResponseEntity.badRequest().body("Shipping address not provided");
            }

            if (shippingAddress.getStreetAddress() == null || shippingAddress.getCity() == null ||
                    shippingAddress.getState() == null || shippingAddress.getCountry() == null ||
                    shippingAddress.getPostalCode() == null) {
                return ResponseEntity.badRequest().body("Incomplete shipping address provided");
            }

            // Process the checkout
            CheckoutDTO checkoutResult = checkoutService.processCheckout(username, shippingAddress);

            logger.info("Checkout completed successfully for user: {}", username);
            return ResponseEntity.ok(checkoutResult);

        } catch (CheckoutException e) {
            logger.error("Checkout failed for user: {}, error code: {}", username, e.getErrorCode(), e);

            // Handle specific error scenarios
            switch (e.getErrorCode()) {
                case "EMPTY_CART":
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Your cart is empty. Please add items before checkout.");
                case "INSUFFICIENT_STOCK":
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(e.getMessage());
                case "INVALID_ADDRESS":
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Please provide a valid and complete shipping address.");
                default:
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("An error occurred during checkout: " + e.getMessage());
            }
        } catch (Exception e) {
            logger.error("Unexpected error during checkout for user: {}", username, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }
}