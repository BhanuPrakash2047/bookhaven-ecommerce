package com.example.spnotificationservice.dto;

import com.example.spnotificationservice.modal.Notification;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String userId;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private LocalDateTime createdAt;
    private Boolean isRead;
    private String orderId;
    private Integer totalAmount;
    private Integer bookCount;

    // Default constructor
    public NotificationDTO() {
    }

    // Constructor with all fields
    public NotificationDTO(Long id, String userId, String title, String message,
                           Notification.NotificationType type, LocalDateTime createdAt, Boolean isRead,
                           String orderId, Integer totalAmount, Integer bookCount) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.bookCount = bookCount;
    }

    // Constructor for simple notifications
    public NotificationDTO(String userId, String title, String message, Notification.NotificationType type) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getBookCount() {
        return bookCount;
    }

    public void setBookCount(Integer bookCount) {
        this.bookCount = bookCount;
    }
}