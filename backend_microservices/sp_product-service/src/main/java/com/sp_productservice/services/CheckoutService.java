package com.sp_productservice.services;

import com.sp_productservice.dto.CheckoutDTO;
import com.sp_productservice.modal.Address;
import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.Cart;
import com.sp_productservice.repositories.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckoutService {

    private static final Logger logger = LoggerFactory.getLogger(CheckoutService.class);

    private final CartRepository cartRepository;
    private final KafkaProducerService kafkaProducerService;

    public CheckoutService(CartRepository cartRepository, KafkaProducerService kafkaProducerService) {
        this.cartRepository = cartRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Transactional
    public CheckoutDTO processCheckout(String username, Address shippingAddress) {
        logger.info("Processing checkout for user: {}", username);

        // 1. Get all cart items for the user
        List<Cart> cartItems = cartRepository.findByUserId(username);

        if (cartItems.isEmpty()) {
            throw CheckoutException.emptyCart();
        }

        // 2. Create book DTOs and calculate total amount
        List<CheckoutDTO.BookDTO> bookDTOs = new ArrayList<>();
        Integer totalAmount = 0;

        for (Cart cartItem : cartItems) {
            Book book = cartItem.getBook();
            int quantity = cartItem.getQuantity();

            // Validate if book has enough stock
            if (book.getQuantity() < quantity) {
                throw CheckoutException.insufficientStock(book.getTitle());
            }

            // Create book DTO
            CheckoutDTO.BookDTO bookDTO = CheckoutDTO.BookDTO.fromBook(book, quantity);
            bookDTOs.add(bookDTO);

            // Calculate price for this book
            Integer bookPrice = book.getDiscountedPrice()*quantity;
            totalAmount = totalAmount+bookPrice;
        }

        // 3. Create the checkout DTO
        CheckoutDTO checkoutDTO = new CheckoutDTO(
                username,
                bookDTOs,
                shippingAddress,
                totalAmount,
                LocalDateTime.now()
        );

        // 4. Send to Kafka
        kafkaProducerService.sendCheckoutEvent(checkoutDTO);

        // 5. Clear the user's cart (actual inventory will be updated by the order service)
        cartRepository.deleteByUserId(username);

        return checkoutDTO;
    }
}