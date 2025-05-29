package com.sp_productservice.repositories;

import com.sp_productservice.modal.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(String userId);
    Optional<Wishlist> findByUserIdAndBookId(String userId, Long bookId);
    void deleteByUserIdAndBookId(String userId, Long bookId);
}