package com.sp_productservice.services;

import com.sp_productservice.dto.WishlistDTO;
import com.sp_productservice.dto.WishlistResponseDTO;
import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.Wishlist;
import com.sp_productservice.repositories.BookRepository;
import com.sp_productservice.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    @Autowired
    public WishlistServiceImpl(WishlistRepository wishlistRepository, BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public WishlistResponseDTO getUserWishlist(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
        return buildWishlistResponse(wishlistItems);
    }

    @Override
    @Transactional
    public WishlistResponseDTO addToWishlist(String userId, Long bookId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        if (bookId == null) {
            throw new BadRequestException("bookId", "Book ID cannot be null");
        }

        // Check if book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found id"+bookId));

        // Check if book already exists in wishlist
        Optional<Wishlist> existingWishlistItem = wishlistRepository.findByUserIdAndBookId(userId, bookId);

        if (existingWishlistItem.isPresent()) {
            // Book already in wishlist, no need to add again
            return getUserWishlist(userId);
        }

        // Add book to wishlist
        Wishlist wishlistItem = new Wishlist();
        wishlistItem.setUserId(userId);
        wishlistItem.setBook(book);
        wishlistItem.setAddedAt(LocalDateTime.now());


        wishlistRepository.save(wishlistItem);
        return getUserWishlist(userId);
    }

    @Override
    @Transactional
    public WishlistResponseDTO removeFromWishlist(String userId, Long bookId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        if (bookId == null) {
            throw new BadRequestException("bookId", "Book ID cannot be null");
        }

        // Check if book exists in wishlist
        Optional<Wishlist> wishlistItem = wishlistRepository.findByUserIdAndBookId(userId, bookId);

        if (!wishlistItem.isPresent()) {
            throw new ResourceNotFoundException("Wishlist item id"+bookId+"not found");
        }

        // Remove from wishlist
        wishlistRepository.delete(wishlistItem.get());
        return getUserWishlist(userId);
    }

    private WishlistResponseDTO buildWishlistResponse(List<Wishlist> wishlistItems) {
        List<WishlistDTO> items = new ArrayList<>();

        for (Wishlist wishlistItem : wishlistItems) {
            Book book = wishlistItem.getBook();

            WishlistDTO wishlistDTO = new WishlistDTO();
            wishlistDTO.setId(wishlistItem.getId());
            wishlistDTO.setUserId(wishlistItem.getUserId());
            wishlistDTO.setBookId(book.getId());
            wishlistDTO.setBookTitle(book.getTitle());
            wishlistDTO.setAuthor(book.getAuthor());
            wishlistDTO.setImage(book.getImageBlob()); // Using helper method for image URL
            wishlistDTO.setPrice(book.getDiscountedPrice().doubleValue());
            wishlistDTO.setAddedAt(wishlistItem.getAddedAt());


            items.add(wishlistDTO);
        }

        WishlistResponseDTO wishlistResponseDTO = new WishlistResponseDTO();
        wishlistResponseDTO.setItems(items);
        wishlistResponseDTO.setTotalItems(items.size());
        return wishlistResponseDTO;

    }

    /**
     * Helper method to convert image blob to a URL or Base64 string
     * This is a placeholder - implement based on your image storage strategy
     */
    private String convertBlobToImageUrl(Book book) {
        // If there's a main image in the images collection, use that
        if (book.getImages() != null && !book.getImages().isEmpty()) {
            for (int i = 0; i < book.getImages().size(); i++) {
                if (book.getImages().get(i).isMain()) {
                    return "/api/books/images/" + book.getId() + "/" + book.getImages().get(i).getId();
                }
            }
        }

        // Otherwise, use the main imageBlob if available
        if (book.getImageBlob() != null && book.getImageBlob().length > 0) {
            return "/api/books/image/" + book.getId();
        }

        // Default placeholder
        return "/api/books/placeholder";
    }
}