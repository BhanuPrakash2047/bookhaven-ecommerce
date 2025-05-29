package com.sp_productservice.services;

import com.sp_productservice.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookCacheService {

    private final BookService bookService;

    @Autowired
    public BookCacheService(BookService bookService) {
        this.bookService = bookService;
    }

    // Cached Read Operations
    @Cacheable(value = "booksList",
            key = "T(java.util.Objects).hash(#genre, #minPrice, #maxPrice, #minRating, #author, #language, #yearPublished)")
    public List<BookDTO> getAllBooksWithCache(String genre, BigDecimal minPrice, BigDecimal maxPrice,
                                              Float minRating, String author, String language, Integer yearPublished) {
        return bookService.getAllBooks(genre, minPrice, maxPrice, minRating, author, language, yearPublished);
    }

    @Cacheable(value = "books", key = "#bookId")
    public BookDTO getBookByIdWithCache(Long bookId) {
        return bookService.getBookById(bookId);
    }

    @Cacheable(value = "bookImages", key = "#bookId")
    public List<ImageDTO> getBookImagesWithCache(Long bookId) {
        return bookService.getBookImages(bookId);
    }

    @Cacheable(value = "bookFAQs", key = "#bookId")
    public List<FAQDTO> getBookFAQsWithCache(Long bookId) {
        return bookService.getBookFAQs(bookId);
    }

    @Cacheable(value = "bookRatings", key = "#bookId")
    public List<RatingReviewDTO> getBookRatingsAndReviewsWithCache(Long bookId) {
        return bookService.getBookRatingsAndReviews(bookId);
    }

    // Write Operations with Cache Eviction
    @CacheEvict(value = {"books", "booksList"}, allEntries = true)
    public BookDTO createBookWithCacheEviction(BookDTO bookDTO) {
        return bookService.createBook(bookDTO);
    }

    @Caching(evict = {
            @CacheEvict(value = "books", key = "#bookId"),
            @CacheEvict(value = "booksList", allEntries = true),
            @CacheEvict(value = "bookImages", key = "#bookId"),
            @CacheEvict(value = "bookFAQs", key = "#bookId"),
            @CacheEvict(value = "bookRatings", key = "#bookId")
    })
    public BookDTO updateBookWithCacheEviction(String bookId, BookDTO bookDTO) {
        return bookService.updateBook(bookId, bookDTO);
    }

    @Caching(evict = {
            @CacheEvict(value = "books", key = "#bookId"),
            @CacheEvict(value = "booksList", allEntries = true),
            @CacheEvict(value = "bookImages", key = "#bookId"),
            @CacheEvict(value = "bookFAQs", key = "#bookId"),
            @CacheEvict(value = "bookRatings", key = "#bookId")
    })
    public void deleteBookWithCacheEviction(String bookId) {
        bookService.deleteBook(bookId);
    }

    @CacheEvict(value = "bookImages", key = "#bookId")
    public void uploadBookImagesWithCacheEviction(String bookId, List<MultipartFile> files,
                                                  int mainImageIndex, List<String> altTexts) {
        bookService.uploadBookImages(bookId, files, mainImageIndex, altTexts);
    }

    @CacheEvict(value = "bookFAQs", key = "#bookId")
    public FAQDTO addFAQWithCacheEviction(String bookId, FAQDTO faqDTO) {
        return bookService.addFAQ(bookId, faqDTO);
    }
}