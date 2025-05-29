package com.sp_orderpaymentservice.service;

import com.sp_orderpaymentservice.dto.OrderDTO;
import com.sp_orderpaymentservice.dto.OrderStatisticsDTO;
import com.sp_orderpaymentservice.dto.OrderStatusDTO;

import java.util.List;


public interface OrderService {

    /**
     * Get order status by order ID
     * @param orderId the order ID
     * @param username the username of the current user
     * @return the order status
     */
    OrderStatusDTO getOrderStatus(Long orderId, String username);

    /**
     * Get all orders for a specific user
     * @param username the username
     * @return list of orders
     */
    List<OrderDTO> getOrdersByUser(String username);

    /**
     * Get detailed information about a single order
     * @param orderId the order ID
     * @param username the username of the current user
     * @return the order details
     */
    OrderDTO getOrderDetails(Long orderId, String username);

    /**
     * Cancel an order
     * @param orderId the order ID
     * @param username the username of the current user
     * @return true if the order was successfully canceled
     */
    boolean cancelOrder(Long orderId, String username);

    /**
     * Update order status (for admin only)
     * @param orderId the order ID
     * @param status the new status
     * @return true if the order status was successfully updated
     */
    boolean updateOrderStatus(Long orderId, String status);

    /**
     * Get orders by status (for admin only)
     * @param status the order status
     * @return list of orders with the given status
     */
    List<OrderDTO> getOrdersByStatus(String status);

    /**
     * Get order statistics (for admin only)
     * @return statistics of orders by status
     */
    OrderStatisticsDTO getOrderStatistics();
}