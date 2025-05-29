package com.sp_productservice.repositories;

import com.sp_productservice.modal.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(String userId);
    Optional<Cart> findByUserIdAndBookId(String userId, Long bookId);
    void deleteByUserId(String userId);
}