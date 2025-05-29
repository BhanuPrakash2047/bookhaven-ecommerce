package com.example.spnotificationservice.service;


import com.example.spnotificationservice.dto.CheckoutDTO;
import com.example.spnotificationservice.dto.NotificationDTO;
import com.example.spnotificationservice.modal.Notification;
import com.example.spnotificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Process checkout event and create notification
     */
    @Transactional
    public void processCheckoutNotification(CheckoutDTO checkoutDTO) {
        // Generate order ID (you might get this from external system)
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create notification message
        String title = "Order Confirmed!";
        String message = String.format(
                "Your order has been confirmed! Order ID: %s. Total: ₹%d for %d book(s). " +
                        "Shipping to: %s, %s, %s %s",
                orderId,
                checkoutDTO.getTotalAmount(),
                checkoutDTO.getBooks().size(),
                checkoutDTO.getShippingAddress().getStreetAddress(),
                checkoutDTO.getShippingAddress().getCity(),
                checkoutDTO.getShippingAddress().getState(),
                checkoutDTO.getShippingAddress().getPostalCode()
        );

        // Save notification to database
        Notification notification = new Notification(
                checkoutDTO.getUsername(),
                title,
                message,
                Notification.NotificationType.ORDER_CONFIRMATION,
                orderId,
                checkoutDTO.getTotalAmount(),
                checkoutDTO.getBooks().size()
        );

        Notification savedNotification = notificationRepository.save(notification);

        // Send real-time notification via WebSocket
        sendRealTimeNotification(checkoutDTO.getUsername(), convertToDTO(savedNotification));
    }

    /**
     * Send real-time notification to specific user
     */
    public void sendRealTimeNotification(String userId, NotificationDTO notificationDTO) {
        try {
            // Send to specific user using /user/{userId}/queue/notifications
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notificationDTO
            );

            System.out.println("Sent real-time notification to user: " + userId);
        } catch (Exception e) {
            System.err.println("Failed to send real-time notification: " + e.getMessage());
        }
    }

    /**
     * Get paginated notifications for a user
     */
    public Page<NotificationDTO> getUserNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return notifications.map(this::convertToDTO);
    }

    /**
     * Get unread notifications count
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Get unread notifications
     */
    public List<NotificationDTO> getUnreadNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public boolean markAsRead(Long notificationId, String userId) {
        int updated = notificationRepository.markAsRead(notificationId, userId);
        return updated > 0;
    }

    /**
     * Mark all notifications as read for user
     */
    @Transactional
    public int markAllAsRead(String userId) {
        return notificationRepository.markAllAsRead(userId);
    }

    /**
     * Create manual notification (for testing or admin purposes)
     */
    @Transactional
    public NotificationDTO createNotification(String userId, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(userId, title, message, type);
        Notification saved = notificationRepository.save(notification);

        NotificationDTO dto = convertToDTO(saved);

        // Send real-time notification
        sendRealTimeNotification(userId, dto);

        return dto;
    }

    /**
     * Convert Notification entity to DTO
     */
    private NotificationDTO convertToDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getUserId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getCreatedAt(),
                notification.getIsRead(),
                notification.getOrderId(),
                notification.getTotalAmount(),
                notification.getBookCount()
        );
    }

    /**
     * Cleanup old notifications (can be scheduled)
     */
    @Transactional
    public int cleanupOldNotifications(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        return notificationRepository.deleteOldNotifications(cutoffDate);
    }
}