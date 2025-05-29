package com.sp_productservice.services;


import com.sp_productservice.dto.CartDTO;
import com.sp_productservice.dto.CartRequestDTO;
import com.sp_productservice.dto.CartResponseDTO;
import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.Cart;
import com.sp_productservice.repositories.BookRepository;
import com.sp_productservice.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public CartResponseDTO getUserCart(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        return buildCartResponse(cartItems);
    }

    @Override
    @Transactional
    public CartResponseDTO addToCart(String userId, CartRequestDTO cartRequestDTO) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        if (cartRequestDTO == null) {
            throw new BadRequestException("request", "Request body cannot be null");
        }

        Long bookId = cartRequestDTO.getBookId();
        if (bookId == null) {
            throw new BadRequestException("bookId", "Book ID cannot be null");
        }

        int quantity = cartRequestDTO.getQuantity();
        if (quantity <= 0) {
            throw new BadRequestException("quantity", "Quantity must be greater than 0");
        }

        // Check if book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book With Id "+bookId+" not found"));

        // Check if book is in stock
        if (book.getQuantity() < quantity) {
            throw new BadRequestException("quantity", "Requested quantity exceeds available stock");
        }

        // Check if item already exists in cart
        Optional<Cart> existingCartItem = cartRepository.findByUserIdAndBookId(userId, bookId);

        if (existingCartItem.isPresent()) {
            Cart cartItem = existingCartItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;

            // Validate again with new quantity
            if (book.getQuantity() < newQuantity) {
                throw new BadRequestException("quantity", "Total quantity exceeds available stock");
            }

            cartItem.setQuantity(newQuantity);
            cartItem.setAddedAt(LocalDateTime.now());
            cartRepository.save(cartItem);
        } else {
            Cart newCartItem = new Cart();
            newCartItem.setUserId(userId);
            newCartItem.setBook(book);
            newCartItem.setQuantity(quantity);
            newCartItem.setAddedAt(LocalDateTime.now());

            cartRepository.save(newCartItem);
        }

        return getUserCart(userId);
    }

    @Override
    @Transactional
    public CartResponseDTO updateCartItem(String userId, Long cartItemId, CartRequestDTO cartRequestDTO) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        if (cartItemId == null) {
            throw new BadRequestException("cartItemId", "Cart item ID cannot be null");
        }

        if (cartRequestDTO == null) {
            throw new BadRequestException("request", "Request body cannot be null");
        }

        int quantity = cartRequestDTO.getQuantity();
        if (quantity <= 0) {
            throw new BadRequestException("quantity", "Quantity must be greater than 0");
        }

        // Find the cart item
        Cart cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item With Id "+cartItemId+" not found"));

        // Validate ownership
        if (!cartItem.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Cart Item With Id "+cartItemId+" not found");
        }

        // Check if book has enough stock
        Book book = cartItem.getBook();
        if (book.getQuantity() < quantity) {
            throw new BadRequestException("quantity", "Requested quantity exceeds available stock");
        }

        // Update quantity
        cartItem.setQuantity(quantity);
        cartItem.setAddedAt(LocalDateTime.now());
        cartRepository.save(cartItem);

        return getUserCart(userId);
    }

    @Override
    @Transactional
    public CartResponseDTO removeFromCart(String userId, Long cartItemId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        if (cartItemId == null) {
            throw new BadRequestException("cartItemId", "Cart item ID cannot be null");
        }

        // Find the cart item
        Cart cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item With Id "+cartItemId+" not found"));

        // Validate ownership
        if (!cartItem.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Cart Item With Id "+cartItemId+" not found");
        }

        // Remove item
        cartRepository.delete(cartItem);

        return getUserCart(userId);
    }

    @Override
    @Transactional
    public CartResponseDTO clearCart(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        for (Cart item : cartItems) {
            cartRepository.delete(item);
        }

        CartResponseDTO cartResponseDTO = new CartResponseDTO();
        cartResponseDTO.setItems(new ArrayList<>());
        cartResponseDTO.setTotalItems(0);
        cartResponseDTO.setTotalPrice(0.0);
        return cartResponseDTO;

    }

    private CartResponseDTO buildCartResponse(List<Cart> cartItems) {
        List<CartDTO> items = new ArrayList<>();
        double totalPrice = 0.0;
        int totalItems = 0;

        for (Cart cartItem : cartItems) {
            Book book = cartItem.getBook();
            int quantity = cartItem.getQuantity();

            CartDTO cartDTO = new CartDTO();
            cartDTO.setId(cartItem.getId());
            cartDTO.setUserId(cartItem.getUserId());
            cartDTO.setBookId(book.getId());
            cartDTO.setBookTitle(book.getTitle());
            cartDTO.setAuthor(book.getAuthor());
            cartDTO.setImage(book.getImageBlob()); // Using a helper method for image URL
            cartDTO.setQuantity(quantity);
            cartDTO.setPrice(book.getDiscountedPrice().doubleValue());
            cartDTO.setAddedAt(cartItem.getAddedAt());


            items.add(cartDTO);
            totalPrice += book.getDiscountedPrice().doubleValue() * quantity;
            totalItems += quantity;
        }

        CartResponseDTO cartResponseDTO = new CartResponseDTO();
        cartResponseDTO.setItems(items);
        cartResponseDTO.setTotalPrice(totalPrice);
        cartResponseDTO.setTotalItems(totalItems);
        return cartResponseDTO;

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