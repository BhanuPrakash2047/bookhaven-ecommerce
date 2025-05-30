package com.sp_orderpaymentservice.controller;


import com.sp_orderpaymentservice.dto.OrderDTO;
import com.sp_orderpaymentservice.dto.OrderStatisticsDTO;
import com.sp_orderpaymentservice.dto.OrderStatusDTO;
import com.sp_orderpaymentservice.service.ApiResponse;
import com.sp_orderpaymentservice.service.AppExceptions;
import com.sp_orderpaymentservice.service.OrderService;
import com.sp_orderpaymentservice.service.UpdateOrderStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Get order status by order ID
     * @param orderId the order ID
     * @param username injected by gateway
     * @return order status
     */
    @GetMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse> getOrderStatus(
            @PathVariable Long orderId,
            @RequestHeader("userName") String username) {

        OrderStatusDTO status = orderService.getOrderStatus(orderId, username);
        ApiResponse response = new ApiResponse(true, "Order status retrieved successfully", status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get all orders for the current user
     * @param username injected by gateway
     * @return list of orders
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getOrdersByUser(
            @RequestHeader("userName") String username) {
        System.out.println("getOrdersByUser");
        List<OrderDTO> orders = orderService.getOrdersByUser(username);
        ApiResponse response = new ApiResponse(true, "User orders retrieved successfully", orders);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get detailed information about a single order
     * @param orderId the order ID
     * @param username injected by gateway
     * @return order details
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> getOrderDetails(
            @PathVariable Long orderId,
            @RequestHeader("userName") String username) {

        OrderDTO orderDetails = orderService.getOrderDetails(orderId, username);
        ApiResponse response = new ApiResponse(true, "Order details retrieved successfully", orderDetails);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Cancel an order
     * @param orderId the order ID
     * @param username injected by gateway
     * @return success/failure message
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("userName") String username) {

        boolean cancelled = orderService.cancelOrder(orderId, username);
        ApiResponse response = new ApiResponse(cancelled, "Order cancelled successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Update order status (for admin only)
     * @param orderId the order ID
     * @param request containing the new status
//     * @param username injected by gateway
//     * @param roles injected by gateway
     * @return success/failure message
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request,
            @RequestHeader("roles") List<String> roles

      ) {
        // Check if the user has admin role
 
        boolean updated = orderService.updateOrderStatus(orderId, request.getStatus());
        ApiResponse response = new ApiResponse(updated, "Order status updated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get orders by status (for admin only)
     * @param status the order status
//     * @param roles injected by gateway
     * @return list of orders with the given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getOrdersByStatus(
            @PathVariable String status
          ) {



        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        ApiResponse response = new ApiResponse(true, "Orders retrieved successfully", orders);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get order statistics (for admin only)
//     * @param roles injected by gateway
     * @return statistics of orders by status
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse> getOrderStatistics(
      ) {
        System.out.println("In Statistixs");


        OrderStatisticsDTO statistics = orderService.getOrderStatistics();
        ApiResponse response = new ApiResponse(true, "Order statistics retrieved successfully", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}