package com.sp_recommendationservice.service;


import com.sp_recommendationservice.dto.CheckoutDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
    public class CheckoutEventListener {


    @Autowired
    private RecommendationService recommendationService;


    @KafkaListener(topics = "checkout-topic", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(CheckoutDTO checkoutDTO) {

            try {
                System.out.println("Received checkout event for user: " + checkoutDTO.getUsername());

                // Process the checkout event to update user preferences
                recommendationService.processCheckoutEvent(checkoutDTO);

                System.out.println("Successfully processed checkout event and updated preferences");

            } catch (Exception e) {
                System.err.println("Error processing checkout event: " + e.getMessage());
                e.printStackTrace();
            }
        }

    }
