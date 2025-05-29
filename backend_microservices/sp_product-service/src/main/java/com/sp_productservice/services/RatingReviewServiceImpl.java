package com.sp_productservice.services;

import com.sp_productservice.dto.RatingReviewDTO;
import com.sp_productservice.dto.RatingReviewDTO1;
import com.sp_productservice.dto.RatingReviewRequestDTO;
import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.RatingReview;
import com.sp_productservice.repositories.BookRepository;
import com.sp_productservice.repositories.RatingReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RatingReviewServiceImpl implements RatingReviewService {

    private final RatingReviewRepository ratingReviewRepository;
    private final BookRepository bookRepository;

    @Autowired
    public RatingReviewServiceImpl(RatingReviewRepository ratingReviewRepository, BookRepository bookRepository) {
        this.ratingReviewRepository = ratingReviewRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public RatingReviewDTO1 submitRatingReview(String userId, Long bookId, RatingReviewRequestDTO requestDTO) {
        validateUserId(userId);
        validateBookId(bookId);
        validateRatingReviewRequest(requestDTO);

        // Check if book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book id"+ bookId+"not found"));
        System.out.println("This is the book "+book.getDescription());

        // Check if user already submitted a review for this book
        Optional<RatingReview> existingReview = ratingReviewRepository.findByUserIdAndBook(userId, book);

        if (existingReview.isPresent()) {
            throw new BadRequestException("review", "You have already submitted a review for this book. Please update your existing review.");
        }

        // Create new rating/review
        RatingReview ratingReview = new RatingReview();
        ratingReview.setUserId(userId);
        ratingReview.setBook(book);
        ratingReview.setRating(requestDTO.getRating());
        ratingReview.setReview(requestDTO.getReview());
        ratingReview.setCreatedAt(LocalDateTime.now());
        ratingReview.setUpdatedAt(LocalDateTime.now());

        RatingReview savedReview = ratingReviewRepository.save(ratingReview);

        // Update book rating statistics
        updateBookRatingStatistics(book);

        return convertToDTO(savedReview);
    }

    @Override
    @Transactional
    public RatingReviewDTO1 updateRatingReview(String userId, Long reviewId, RatingReviewRequestDTO requestDTO) {
        validateUserId(userId);
        validateRatingReviewRequest(requestDTO);

        // Find the existing review
        RatingReview ratingReview = ratingReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating/Review id "+reviewId+" does not exist. Please update your existing review."));

        // Verify that this review belongs to the user
        if (!ratingReview.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Rating/Review id"+reviewId+" does not exist. Please update your existing review.");
        }

        // Update the review
        ratingReview.setRating(requestDTO.getRating());
        ratingReview.setReview(requestDTO.getReview());
        ratingReview.setUpdatedAt(LocalDateTime.now());

        RatingReview updatedReview = ratingReviewRepository.save(ratingReview);

        // Update book rating statistics
        updateBookRatingStatistics(ratingReview.getBook());

        return convertToDTO(updatedReview);
    }

    @Override
    @Transactional
    public void deleteRatingReview(String userId, Long reviewId) {
        validateUserId(userId);

        // Find the existing review
        RatingReview ratingReview = ratingReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating/Review id not found"+ reviewId));

        // Verify that this review belongs to the user
        if (!ratingReview.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Rating/Review not found"+reviewId);
        }

        // Get the book before deleting the review
        Book book = ratingReview.getBook();

        // Delete the review
        ratingReviewRepository.delete(ratingReview);

        // Update book rating statistics
        updateBookRatingStatistics(book);
    }

    @Override
    public List<RatingReviewDTO1> getBookRatingsReviews(Long bookId) {
        validateBookId(bookId);

        // Check if book exists
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book id not-found"+bookId);
        }

        List<RatingReview> ratingReviews = ratingReviewRepository.findByBookId(bookId);
        return convertToDTOList(ratingReviews);
    }

    @Override
    public List<RatingReviewDTO1> getUserRatingsReviews(String userId) {
        validateUserId(userId);

        List<RatingReview> ratingReviews = ratingReviewRepository.findByUserId(userId);
        return convertToDTOList(ratingReviews);
    }

    /**
     * Updates the total ratings count and average rating for a book
     * @param book The book to update
     */
    private void updateBookRatingStatistics(Book book) {
        List<RatingReview> allRatings = ratingReviewRepository.findByBookId(book.getId());

        if (allRatings.isEmpty()) {
            // No ratings exist
            book.setTotalRatings(0);
            book.setAverageRating(0);
        } else {
            // Calculate statistics
            int totalRatings = allRatings.size();
            double totalRatingSum = allRatings.stream()
                    .filter(rating -> rating.getRating() != null)
                    .mapToDouble(RatingReview::getRating)
                    .sum();

            // Calculate average rating rounded to nearest integer
            int averageRating = (int) Math.round(totalRatingSum / totalRatings);

            book.setTotalRatings(totalRatings);
            book.setAverageRating(averageRating);
        }

        // Save the updated book
        bookRepository.save(book);
    }

    private void validateUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }
    }

    private void validateBookId(Long bookId) {
        if (bookId == null) {
            throw new BadRequestException("bookId", "Book ID cannot be null");
        }
    }

    private void validateRatingReviewRequest(RatingReviewRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new BadRequestException("request", "Request body cannot be null");
        }

        // Either rating or review (or both) must be provided
        if (requestDTO.getRating() == null && (requestDTO.getReview() == null || requestDTO.getReview().trim().isEmpty())) {
            throw new BadRequestException("request", "Either rating or review must be provided");
        }

        // If rating is provided, validate it's between 1 and 5
        if (requestDTO.getRating() != null) {
            float rating = requestDTO.getRating();
            if (rating < 1 || rating > 5) {
                throw new BadRequestException("rating", "Rating must be between 1 and 5");
            }
        }
    }

    private RatingReviewDTO1 convertToDTO(RatingReview ratingReview) {
        Book book = ratingReview.getBook();

        RatingReviewDTO1 ratingReviewDTO1 = new RatingReviewDTO1();
        ratingReviewDTO1.setId(ratingReview.getId());
        ratingReviewDTO1.setBookId(book.getId());
        ratingReviewDTO1.setBookTitle(book.getTitle());
        ratingReviewDTO1.setUserId(ratingReview.getUserId());
        ratingReviewDTO1.setUsername(ratingReview.getUserId()); // Ideally fetched from user service
        ratingReviewDTO1.setRating(ratingReview.getRating());
        ratingReviewDTO1.setReview(ratingReview.getReview());
        ratingReviewDTO1.setCreatedAt(ratingReview.getCreatedAt());
        ratingReviewDTO1.setUpdatedAt(ratingReview.getUpdatedAt());
        return ratingReviewDTO1;
    }

    private List<RatingReviewDTO1> convertToDTOList(List<RatingReview> ratingReviews) {
        List<RatingReviewDTO1> dtoList = new ArrayList<>();

        for (RatingReview ratingReview : ratingReviews) {
            dtoList.add(convertToDTO(ratingReview));
        }

        return dtoList;
    }
}