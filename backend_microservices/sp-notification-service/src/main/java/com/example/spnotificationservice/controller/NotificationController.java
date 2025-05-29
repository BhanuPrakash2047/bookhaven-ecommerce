package com.example.spnotificationservice.controller;

import com.example.spnotificationservice.dto.NotificationDTO;
import com.example.spnotificationservice.modal.Notification;
import com.example.spnotificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get paginated notifications for a user
     */
    @GetMapping("/user/me")
    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
            @RequestHeader("userName") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NotificationDTO> notifications = notificationService.getUserNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for a user
     */
    @GetMapping("/user/me/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@RequestHeader("userName") String userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications count
     */
    @GetMapping("/user/me/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@RequestHeader("userName") String userId) {
        System.out.println("In Search of the count");
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("userName") String userId) {

        boolean updated = notificationService.markAsRead(notificationId, userId);

        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to mark notification as read"));
        }
    }

    /**
     * Mark all notifications as read for user
     */
    @PutMapping("/user/me/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestHeader("userName") String userId) {
        int updatedCount = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of(
                "message", "All notifications marked as read",
                "updatedCount", updatedCount
        ));
    }

    /**
     * Create a manual notification (for testing purposes)
     */
    @PostMapping("/create")
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody CreateNotificationRequest request) {
        NotificationDTO notification = notificationService.createNotification(
                request.getUserId(),
                request.getTitle(),
                request.getMessage(),
                request.getType()
        );
        return ResponseEntity.ok(notification);
    }

    // Inner class for create notification request
    public static class CreateNotificationRequest {
        private String userId;
        private String title;
        private String message;
        private Notification.NotificationType type;

        // Getters and setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Notification.NotificationType getType() {
            return type;
        }

        public void setType(Notification.NotificationType type) {
            this.type = type;
        }
    }
}