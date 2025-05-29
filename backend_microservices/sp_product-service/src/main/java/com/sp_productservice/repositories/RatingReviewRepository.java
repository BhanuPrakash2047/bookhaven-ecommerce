package com.sp_productservice.repositories;

import com.sp_productservice.modal.Book;
import com.sp_productservice.modal.RatingReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingReviewRepository extends JpaRepository<RatingReview, Long> {
    List<RatingReview> findByBook(Book book);

    List<RatingReview> findByBookId(Long bookId);
    List<RatingReview> findByUserId(String userId);
    Optional<RatingReview> findByUserIdAndBookId(String userId, Long bookId);

    Optional<RatingReview> findByUserIdAndBook(String userId, Book book);
}
