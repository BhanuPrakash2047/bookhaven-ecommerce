package com.sp_adminservice.Controller;


import com.sp_adminservice.client.OrderClient;
import com.sp_adminservice.dto.UpdateOrderStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Admin Controller for Order Management
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderClient orderClient;

    @Autowired
    public AdminOrderController(OrderClient orderClient) {
        this.orderClient = orderClient;
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestBody UpdateOrderStatusRequest request,
                                               @RequestHeader("roles") List<String> roles) {
        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        try {
            return orderClient.updateOrderStatus(orderId, request);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Bad Request");
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status,
                                               @RequestHeader("roles") List<String> roles) {
        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        try {
            return orderClient.getOrdersByStatus(status);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Bad Request");        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getOrderStatistics(@RequestHeader("roles") List<String> roles) {
        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        try {
            return orderClient.getOrderStatistics();
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Bad Request");        }
    }
}

