package com.sp_productservice.controller;


import com.sp_productservice.dto.WishlistResponseDTO;
import com.sp_productservice.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    /**
     * Get the authenticated user's wishlist
     *
     * @param username Injected by gateway after authentication
     * @return User's wishlist
     */
    @GetMapping
    public ResponseEntity<WishlistResponseDTO> getUserWishlist(@RequestHeader("userName") String username) {
        try {
            WishlistResponseDTO wishlist = wishlistService.getUserWishlist(username);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve wishlist: " + e.getMessage(), e);
        }
    }

    /**
     * Add a book to the authenticated user's wishlist
     *
     * @param username Injected by gateway after authentication
     * @param bookId Book identifier
     * @return Updated wishlist
     */
    @PostMapping("/{bookId}")
    public ResponseEntity<WishlistResponseDTO> addToWishlist(
            @RequestHeader("userName") String username,
            @PathVariable Long bookId) {
        try {
            WishlistResponseDTO updatedWishlist = wishlistService.addToWishlist(username, bookId);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedWishlist);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to add book to wishlist: " + e.getMessage(), e);
        }
    }

    /**
     * Remove a book from the authenticated user's wishlist
     *
     * @param username Injected by gateway after authentication
     * @param bookId Book identifier
     * @return Updated wishlist
     */
    @DeleteMapping("/{bookId}")
    public ResponseEntity<WishlistResponseDTO> removeFromWishlist(
            @RequestHeader("userName") String username,
            @PathVariable Long bookId) {
        try {
            WishlistResponseDTO updatedWishlist = wishlistService.removeFromWishlist(username, bookId);
            return ResponseEntity.ok(updatedWishlist);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to remove book from wishlist: " + e.getMessage(), e);
        }
    }
}