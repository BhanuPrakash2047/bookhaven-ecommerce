package com.sp_productservice.services;

import com.sp_productservice.dto.WishlistResponseDTO;

public interface WishlistService {
    /**
     * Get user's wishlist
     * @param userId User identifier
     * @return WishlistResponseDTO containing wishlist items
     */
    WishlistResponseDTO getUserWishlist(String userId);

    /**
     * Add a book to user's wishlist
     * @param userId User identifier
     * @param bookId Book identifier
     * @return WishlistResponseDTO with updated wishlist
     */
    WishlistResponseDTO addToWishlist(String userId, Long bookId);

    /**
     * Remove a book from user's wishlist
     * @param userId User identifier
     * @param bookId Book identifier
     * @return WishlistResponseDTO with updated wishlist
     */
    WishlistResponseDTO removeFromWishlist(String userId, Long bookId);
}