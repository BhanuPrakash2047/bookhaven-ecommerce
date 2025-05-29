package com.sp_productservice.services;

import com.sp_productservice.dto.RatingReviewDTO;
import com.sp_productservice.dto.RatingReviewDTO1;
import com.sp_productservice.dto.RatingReviewRequestDTO;

import java.util.List;

public interface RatingReviewService {
    /**
     * Submit a rating or review for a book
     * @param userId User identifier
     * @param bookId Book identifier
     * @param requestDTO Rating/review details
     * @return Created RatingReviewDTO
     */
    RatingReviewDTO1 submitRatingReview(String userId, Long bookId, RatingReviewRequestDTO requestDTO);

    /**
     * Update an existing rating or review
     * @param userId User identifier
     * @param reviewId Review identifier
     * @param requestDTO Updated rating/review details
     * @return Updated RatingReviewDTO
     */
    RatingReviewDTO1 updateRatingReview(String userId, Long reviewId, RatingReviewRequestDTO requestDTO);

    /**
     * Delete a rating or review
     * @param userId User identifier
     * @param reviewId Review identifier
     */
    void deleteRatingReview(String userId, Long reviewId);

    /**
     * Get all ratings and reviews for a book
     * @param bookId Book identifier
     * @return List of RatingReviewDTO
     */
    List<RatingReviewDTO1> getBookRatingsReviews(Long bookId);

    /**
     * Get all ratings and reviews by a user
     * @param userId User identifier
     * @return List of RatingReviewDTO
     */
    List<RatingReviewDTO1> getUserRatingsReviews(String userId);
}