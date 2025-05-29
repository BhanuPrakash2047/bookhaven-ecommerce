package com.sp_productservice.controller;

import com.sp_productservice.dto.RatingReviewDTO;
import com.sp_productservice.dto.RatingReviewDTO1;
import com.sp_productservice.dto.RatingReviewRequestDTO;
import com.sp_productservice.services.RatingReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
public class RatingReviewController {

    private final RatingReviewService ratingReviewService;

    @Autowired
    public RatingReviewController(RatingReviewService ratingReviewService) {
        this.ratingReviewService = ratingReviewService;
    }

    /**
     * Submit a rating or review for a book
     *
     * @param username Injected by gateway after authentication
     * @param bookId Book identifier
     * @param requestDTO Rating/review details
     * @return Created rating/review details
     */
    @PostMapping("/books/{bookId}/ratings-reviews")
    public ResponseEntity<RatingReviewDTO1> submitRatingReview(
            @RequestHeader("username") String username,
            @PathVariable Long bookId,
            @RequestBody RatingReviewRequestDTO requestDTO) {
        try {
            RatingReviewDTO1 createdReview = ratingReviewService.submitRatingReview(username, bookId, requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to submit rating/review: " + e.getMessage(), e);
        }
    }

    /**
     * Update an existing rating or review
     *
     * @param username Injected by gateway after authentication
     * @param reviewId Review identifier
     * @param requestDTO Updated rating/review details
     * @return Updated rating/review details
     */
    @PutMapping("/ratings-reviews/{reviewId}")
    public ResponseEntity<RatingReviewDTO1> updateRatingReview(
            @RequestHeader("username") String username,
            @PathVariable Long reviewId,
            @RequestBody RatingReviewRequestDTO requestDTO) {
        try {
            RatingReviewDTO1 updatedReview = ratingReviewService.updateRatingReview(username, reviewId, requestDTO);
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to update rating/review: " + e.getMessage(), e);
        }
    }

    /**
     * Delete a rating or review
     *
     * @param username Injected by gateway after authentication
     * @param reviewId Review identifier
     * @return No content response
     */
    @DeleteMapping("/ratings-reviews/{reviewId}")
    public ResponseEntity<Void> deleteRatingReview(
            @RequestHeader("username") String username,
            @PathVariable Long reviewId) {
        try {
            ratingReviewService.deleteRatingReview(username, reviewId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete rating/review: " + e.getMessage(), e);
        }
    }

    /**
     * Get all ratings and reviews for a book
     *
     * @param bookId Book identifier
     * @return List of ratings and reviews
     */
    @GetMapping("/books/{bookId}/ratings-reviews")
    public ResponseEntity<List<RatingReviewDTO1>> getBookRatingsReviews(@PathVariable Long bookId) {
        try {
            List<RatingReviewDTO1> reviews = ratingReviewService.getBookRatingsReviews(bookId);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve book ratings/reviews: " + e.getMessage(), e);
        }
    }

    /**
     * Get all ratings and reviews by the authenticated user
     *
     * @param username Injected by gateway after authentication
     * @return List of user's ratings and reviews
     */
    @GetMapping("/user/ratings-reviews")
    public ResponseEntity<List<RatingReviewDTO1>> getUserRatingsReviews(
            @RequestHeader("username") String username) {
        try {
            List<RatingReviewDTO1> reviews = ratingReviewService.getUserRatingsReviews(username);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve user ratings/reviews: " + e.getMessage(), e);
        }
    }


}