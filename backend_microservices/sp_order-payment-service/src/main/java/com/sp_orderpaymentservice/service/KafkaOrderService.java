package com.sp_orderpaymentservice.service;

import com.sp_orderpaymentservice.modal.Address;
import com.sp_orderpaymentservice.dto.CheckoutDTO;
import com.sp_orderpaymentservice.modal.Order;
import com.sp_orderpaymentservice.modal.OrderItem;
import com.sp_orderpaymentservice.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class KafkaOrderService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaOrderService.class);

    private final OrderRepository orderRepository;

    public KafkaOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    @KafkaListener(topics = "${spring.kafka.topic.checkout}", groupId = "${spring.kafka.consumer.group-id}")
    public void processCheckoutEvent(CheckoutDTO checkoutDTO) {
        logger.info("Received checkout event for user: {}", checkoutDTO.getUsername());

        try {
            // Create a new order
            Order order = new Order();
            order.setUsername(checkoutDTO.getUsername());
            order.setOrderNumber(generateOrderNumber());
            order.setTotalAmount(checkoutDTO.getTotalAmount());
            order.setOrderDate(checkoutDTO.getCheckoutTime());
            order.setStatus(Order.OrderStatus.CREATED);

            // Copy shipping address
            Address shippingAddress = copyAddress(checkoutDTO.getShippingAddress());
            shippingAddress.setUserId(checkoutDTO.getUsername());
            order.setShippingAddress(shippingAddress);

            // Add order items
            for (CheckoutDTO.BookDTO bookDTO : checkoutDTO.getBooks()) {
                OrderItem orderItem = new OrderItem(
                        bookDTO.getId(),
                        bookDTO.getTitle(),
                        bookDTO.getAuthor(),
                        bookDTO.getIsbn(),
                        bookDTO.getQuantity(),
                        bookDTO.getPrice()
                );
                order.addOrderItem(orderItem);
            }

            // Save the order
            Order savedOrder = orderRepository.save(order);
            logger.info("Order created successfully: {}", savedOrder.getOrderNumber());

            // Here you would typically have additional business logic:
            // - Notify inventory service to update stock
            // - Generate invoice
            // - Send order confirmation email to customer
            // - etc.

        } catch (Exception e) {
            logger.error("Error processing checkout event for user: {}", checkoutDTO.getUsername(), e);
            // In a production environment, you would implement a retry mechanism or dead letter queue
        }
    }

    private String generateOrderNumber() {
        // Simple order number generation using current timestamp and random UUID
        return "ORD-" + System.currentTimeMillis() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private Address copyAddress(Address sourceAddress) {
        Address address = new Address();
        address.setFullName(sourceAddress.getFullName());
        address.setPhoneNumber(sourceAddress.getPhoneNumber());
        address.setStreetAddress(sourceAddress.getStreetAddress());
        address.setCity(sourceAddress.getCity());
        address.setState(sourceAddress.getState());
        address.setCountry(sourceAddress.getCountry());
        address.setPostalCode(sourceAddress.getPostalCode());
        address.setAddressType(sourceAddress.getAddressType());
        return address;
    }
}