package com.sp_orderpaymentservice.repository;


import com.sp_orderpaymentservice.modal.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUsername(Long id, String username);

    @Query("SELECT o.status as status, COUNT(o) as count FROM Order o GROUP BY o.status")
    List<Map<String, Object>> getOrderStatistics();


    List<Order> findByStatus(Order.OrderStatus orderStatus);
}
