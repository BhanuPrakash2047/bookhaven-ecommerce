package com.sp_orderpaymentservice.service;

import com.sp_orderpaymentservice.dto.*;
import com.sp_orderpaymentservice.modal.Address;
import com.sp_orderpaymentservice.modal.Order;
import com.sp_orderpaymentservice.modal.OrderItem;
import com.sp_orderpaymentservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderStatusDTO getOrderStatus(Long orderId, String username) {
        Order order = findOrderByIdAndUsername(orderId, username);
        return new OrderStatusDTO(order.getId(), order.getStatus().name());
    }

    @Override
    public List<OrderDTO> getOrdersByUser(String username) {
        List<Order> orders = orderRepository.findByUsername(username);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            orderDTOs.add(convertToOrderDTO(order, false));
        }

        return orderDTOs;
    }

    @Override
    public OrderDTO getOrderDetails(Long orderId, String username) {
        Order order = findOrderByIdAndUsername(orderId, username);
        return convertToOrderDTO(order, true);
    }

    @Override
    @Transactional
    public boolean cancelOrder(Long orderId, String username) {
        Order order = findOrderByIdAndUsername(orderId, username);

        // Check if the order can be canceled
        if (order.getStatus() == Order.OrderStatus.SHIPPED ||
                order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new AppExceptions.InvalidOperationException("Cannot cancel order that is already shipped or delivered");
        }

        order.setStatus(Order.OrderStatus.CANCELED);
        orderRepository.save(order);
        return true;
    }

    @Override
    @Transactional
    public boolean updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppExceptions.ResourceNotFoundException("Order not found with id: " + orderId));

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderRepository.save(order);
            return true;
        } catch (IllegalArgumentException e) {
            throw new AppExceptions.InvalidOrderStatusException("Invalid order status: " + status);
        }
    }

    @Override
    public List<OrderDTO> getOrdersByStatus(String status) {
        Order.OrderStatus orderStatus;
        try {
            orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppExceptions.InvalidOrderStatusException("Invalid order status: " + status);
        }

        List<Order> orders = orderRepository.findByStatus(orderStatus);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            orderDTOs.add(convertToOrderDTO(order, false));
        }

        return orderDTOs;
    }

    @Override
    public OrderStatisticsDTO getOrderStatistics() {
        List<Map<String, Object>> statisticsData = orderRepository.getOrderStatistics();
        OrderStatisticsDTO statistics = new OrderStatisticsDTO();

        for (Map<String, Object> data : statisticsData) {
            String status = ((Order.OrderStatus) data.get("status")).name();
            Long count = ((Number) data.get("count")).longValue();
            statistics.addStatusCount(status, count);
        }

        return statistics;
    }

    private Order findOrderByIdAndUsername(Long orderId, String username) {
        return orderRepository.findByIdAndUsername(orderId, username)
                .orElseThrow(() -> new AppExceptions.ResourceNotFoundException("Order not found with id: " + orderId));
    }

    private OrderDTO convertToOrderDTO(Order order, boolean includeDetails) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderNumber(order.getOrderNumber());
        orderDTO.setUsername(order.getUsername());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setStatus(order.getStatus().name());

        if (includeDetails) {
            // Add shipping address if exists
            if (order.getShippingAddress() != null) {
                AddressDTO addressDTO = convertToAddressDTO(order.getShippingAddress());
                orderDTO.setShippingAddress(addressDTO);
            }

            // Add order items
            List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                orderItemDTOs.add(convertToOrderItemDTO(item));
            }
            orderDTO.setOrderItems(orderItemDTOs);
        }

        return orderDTO;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setBookId(orderItem.getBookId());
        dto.setBookTitle(orderItem.getBookTitle());
        dto.setBookAuthor(orderItem.getBookAuthor());
        dto.setIsbn(orderItem.getIsbn());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());
        return dto;
    }

    private AddressDTO convertToAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        return dto;
    }
}