package com.sp_productservice.controller;


import com.sp_productservice.dto.CartRequestDTO;
import com.sp_productservice.dto.CartResponseDTO;
import com.sp_productservice.dto.ErrorResponse;
import com.sp_productservice.services.BadRequestException;
import com.sp_productservice.services.CartService;
import com.sp_productservice.services.ResourceNotFoundException;
import com.sp_productservice.services.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get all items in the user's cart
     */
    @GetMapping
    public ResponseEntity<?> getUserCart(@RequestHeader(value = "userName", required = false) String username,
                                         HttpServletRequest request) {
        try {
            validateUser(username);
            CartResponseDTO cartResponseDTO = cartService.getUserCart(username);
            return ResponseEntity.ok(cartResponseDTO);
        } catch (UnauthorizedException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, request);
        } catch (BadRequestException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, request);
        } catch (Exception e) {
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
    }

    /**
     * Add a book to the cart
     */
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestHeader(value = "userName", required = false) String username,
                                       @RequestBody CartRequestDTO cartRequestDTO,
                                       HttpServletRequest request) {
        try {
            validateUser(username);
            validateCartRequest(cartRequestDTO);
            CartResponseDTO cartResponseDTO = cartService.addToCart(username, cartRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(cartResponseDTO);
        } catch ( UnauthorizedException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, request);
        } catch (BadRequestException e) {
            System.out.println("Bad request: " + e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, request);
        } catch (ResourceNotFoundException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND, request);
        } catch (Exception e) {
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
    }

    /**
     * Update quantity of a cart item
     */
    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@RequestHeader(value = "userName", required = false) String username,
                                            @PathVariable Long cartItemId,
                                            @RequestBody CartRequestDTO cartRequestDTO,
                                            HttpServletRequest request) {
        try {
            validateUser(username);
            validateCartId(cartItemId);
            validateCartRequest(cartRequestDTO);
            CartResponseDTO cartResponseDTO = cartService.updateCartItem(username, cartItemId, cartRequestDTO);
            return ResponseEntity.ok(cartResponseDTO);
        } catch (UnauthorizedException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, request);
        } catch (BadRequestException e) {
            System.out.println(e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, request);
        } catch (ResourceNotFoundException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND, request);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
    }

    /**
     * Remove an item from the cart
     */
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@RequestHeader(value = "userName", required = false) String username,
                                            @PathVariable Long cartItemId,
                                            HttpServletRequest request) {
        try {
            validateUser(username);
            validateCartId(cartItemId);
            CartResponseDTO cartResponseDTO = cartService.removeFromCart(username, cartItemId);
            return ResponseEntity.ok(cartResponseDTO);
        } catch (UnauthorizedException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, request);
        } catch (BadRequestException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, request);
        } catch (ResourceNotFoundException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND, request);
        } catch (Exception e) {
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
    }

    /**
     * Clear the entire cart
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader(value = "userName", required = false) String username,
                                       HttpServletRequest request) {
        try {
            validateUser(username);
            CartResponseDTO cartResponseDTO = cartService.clearCart(username);
            return ResponseEntity.ok(cartResponseDTO);
        } catch (UnauthorizedException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, request);
        } catch (BadRequestException e) {
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, request);
        } catch (Exception e) {
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
    }

    /**
     * Helper method to validate user
     */
    private void validateUser(String username) {
        if (username == null || username.isEmpty()) {
            throw new UnauthorizedException("Authentication required. User not found in request.");
        }
    }

    /**
     * Helper method to validate cart request
     */
    private void validateCartRequest(CartRequestDTO cartRequestDTO) {
        if (cartRequestDTO == null) {
            throw new BadRequestException("request", "Request body cannot be null");
        }

        if (cartRequestDTO.getBookId() == null) {
            throw new BadRequestException("bookId", "Book ID cannot be null");
        }

        if (cartRequestDTO.getQuantity() <= 0) {
            throw new BadRequestException("quantity", "Quantity must be greater than 0");
        }
    }

    /**
     * Helper method to validate cart ID
     */
    private void validateCartId(Long cartItemId) {
        if (cartItemId == null) {
            throw new BadRequestException("cartItemId", "Cart item ID cannot be null");
        }
    }

    /**
     * Helper method to create error responses
     */
    private ResponseEntity<ErrorResponse> createErrorResponse(String message, HttpStatus status,
                                                              HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage(message);
        return new ResponseEntity<>(errorResponse, status);
    }
}