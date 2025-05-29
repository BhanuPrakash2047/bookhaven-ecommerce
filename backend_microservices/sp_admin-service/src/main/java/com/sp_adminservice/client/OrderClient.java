package com.sp_adminservice.client;

import com.sp_adminservice.dto.ApiResponse;
import com.sp_adminservice.dto.UpdateOrderStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Feign Client Interface to Order-Payment Service
@FeignClient(name = "SP-ORDER-PAYMENT-SERVICE")
public interface OrderClient {

    @PutMapping("/api/orders/{orderId}/status")
    ResponseEntity<ApiResponse> updateOrderStatus(@PathVariable("orderId") Long orderId,
                                                  @RequestBody UpdateOrderStatusRequest request);

    @GetMapping("/api/orders/status/{status}")
    ResponseEntity<ApiResponse> getOrdersByStatus(@PathVariable("status") String status);

    @GetMapping("/api/orders/statistics")
    ResponseEntity<ApiResponse> getOrderStatistics();
}