package com.sp_productservice.services;

import com.sp_productservice.dto.CartRequestDTO;
import com.sp_productservice.dto.CartResponseDTO;

public interface CartService {
    /**
     * Get all items in the user's cart
     * @param userId User identifier
     * @return CartResponseDTO containing cart items, total price and total items
     */
    CartResponseDTO getUserCart(String userId);

    /**
     * Add a book to user's cart
     * @param userId User identifier
     * @param cartRequestDTO Request containing bookId and quantity
     * @return CartResponseDTO with updated cart information
     */
    CartResponseDTO addToCart(String userId, CartRequestDTO cartRequestDTO);

    /**
     * Update quantity of an item in the cart
     * @param userId User identifier
     * @param cartItemId Cart item identifier
     * @param cartRequestDTO Request containing updated quantity
     * @return CartResponseDTO with updated cart information
     */
    CartResponseDTO updateCartItem(String userId, Long cartItemId, CartRequestDTO cartRequestDTO);

    /**
     * Remove a specific item from the cart
     * @param userId User identifier
     * @param cartItemId Cart item identifier
     * @return CartResponseDTO with updated cart information
     */
    CartResponseDTO removeFromCart(String userId, Long cartItemId);

    /**
     * Clear all items from the user's cart
     * @param userId User identifier
     * @return Empty CartResponseDTO
     */
    CartResponseDTO clearCart(String userId);
}