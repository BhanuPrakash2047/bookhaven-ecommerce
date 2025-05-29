package com.example.spnotificationservice.service;


import com.example.spnotificationservice.dto.CheckoutDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CheckoutEventListener {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "checkout-topic", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(CheckoutDTO checkoutDTO) {
        try {
            System.out.println("Received checkout event for user: " + checkoutDTO.getUsername());
            System.out.println("Total amount: " + checkoutDTO.getTotalAmount());
            System.out.println("Books count: " + checkoutDTO.getBooks().size());

            // Process the checkout and create notification
            notificationService.processCheckoutNotification(checkoutDTO);

            System.out.println("Notification processed successfully for user: " + checkoutDTO.getUsername());

        } catch (Exception e) {
            System.err.println("Error processing checkout notification: " + e.getMessage());
            e.printStackTrace();
        }
    }
}