package com.sp_productservice.controller;

import com.sp_productservice.dto.*;
import com.sp_productservice.services.BookCacheService;
import com.sp_productservice.services.BookService;
import com.sp_productservice.services.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/books")
public class BookController {

    private final BookCacheService bookCacheService;
    private final BookService bookService;

    @Autowired
    public BookController(BookCacheService bookCacheService, BookService bookService) {
        this.bookCacheService = bookCacheService;
        this.bookService = bookService;
    }

    @PostMapping
    public ResponseEntity<?> createBook(
            @RequestBody BookDTO bookDTO
    ) {

        try {
            BookDTO createdBook = bookCacheService.createBookWithCacheEviction(bookDTO);
            return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to create book: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<?> updateBook(
            @PathVariable String bookId,
            @RequestBody BookDTO bookDTO
    ) {
        System.out.println("this is the object we have"+bookDTO.toString());

        try {
            BookDTO updatedBook = bookCacheService.updateBookWithCacheEviction(bookId, bookDTO);
            return new ResponseEntity<>(updatedBook, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to update book: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @DeleteMapping("/{title}")
    public ResponseEntity<?> deleteBook(
            @PathVariable String title
    ) {

        try {
            bookCacheService.deleteBookWithCacheEviction(title);
            return new ResponseEntity<>(
                    new SuccessResponse("Book deleted successfully"),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(

                    new ErrorResponse("Failed to delete book: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/{title}/images")
    public ResponseEntity<?> uploadBookImages(
            @PathVariable String title,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "mainImageIndex", defaultValue = "0") int mainImageIndex,
            @RequestParam(value = "altTexts", required = false) List<String> altTexts
//            @RequestHeader("roles") List<String> roles
    ) {

//        if (!hasAdminRole(roles)) {
//            throw new UnauthorizedException("Only admins can upload book images");
//        }
        System.out.println("In the uploadBookImages method");
        try {
            bookCacheService.uploadBookImagesWithCacheEviction(title, files, mainImageIndex, altTexts);
            return new ResponseEntity<>(
                    new SuccessResponse("Images uploaded successfully"),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to upload images: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/{title}/faq")
    public ResponseEntity<?> addFAQ(
            @PathVariable String title,
            @RequestBody FAQDTO faqDTO
//            @RequestHeader("roles") List<String> roles
    ) {

//        if (!hasAdminRole(roles)) {
//            throw new UnauthorizedException("Only admins can add FAQs");
//        }

        try {
            FAQDTO addedFAQ = bookCacheService.addFAQWithCacheEviction(title, faqDTO);
            return new ResponseEntity<>(addedFAQ, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to add FAQ: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    /*
    Admin Endpoints Over
     */

    @GetMapping
    public ResponseEntity<?> getAllBooks(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Float minRating,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer yearPublished) {
        try {
            List<BookDTO> books = bookCacheService.getAllBooksWithCache(genre, minPrice, maxPrice, minRating, author, language, yearPublished);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving books: " + e.getMessage());
        }
    }

    @GetMapping("/categories/count")
    public ResponseEntity<?> getCategoriesCount() {
        try{
              return ResponseEntity.ok(bookService.getBookgenres());
        }
        catch(Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving categories: " + e.getMessage());
        }
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<?> getBookById(@PathVariable Long bookId) {
        try {
            BookDTO book = bookCacheService.getBookByIdWithCache(bookId);
            if (book != null) {
                return ResponseEntity.ok(book);
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Book not found with ID: " + bookId);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving book: " + e.getMessage());
        }
    }

    @GetMapping("/{bookId}/images")
    public ResponseEntity<?> getBookImages(@PathVariable Long bookId) {
        try {
            List<ImageDTO> images = bookCacheService.getBookImagesWithCache(bookId);
            if (!images.isEmpty()) {
                return ResponseEntity.ok(images);
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No images found for book with ID: " + bookId);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving book images: " + e.getMessage());
        }
    }

    @GetMapping("/{bookId}/faq")
    public ResponseEntity<?> getBookFAQs(@PathVariable Long bookId) {
        try {
            List<FAQDTO> faqs = bookCacheService.getBookFAQsWithCache(bookId);
            if (!faqs.isEmpty()) {
                return ResponseEntity.ok(faqs);
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No FAQs found for book with ID: " + bookId);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving book FAQs: " + e.getMessage());
        }
    }

    @GetMapping("/{bookId}/ratings-reviews")
    public ResponseEntity<?> getBookRatingsAndReviews(@PathVariable Long bookId) {
        try {
            List<RatingReviewDTO> ratingsReviews = bookCacheService.getBookRatingsAndReviewsWithCache(bookId);
            if (!ratingsReviews.isEmpty()) {
                return ResponseEntity.ok(ratingsReviews);
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No ratings or reviews found for book with ID: " + bookId);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving book ratings and reviews: " + e.getMessage());
        }
    }

    private boolean hasAdminRole(List<String> roles) {
        if (roles == null) {
            return false;
        }

        for (String role : roles) {
            if ("ROLE_ADMIN".equals(role)) {
                return true;
            }
        }
        return false;
    }
}