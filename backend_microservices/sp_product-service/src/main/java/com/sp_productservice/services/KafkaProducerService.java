package com.sp_productservice.services;

import com.sp_productservice.dto.CheckoutDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String checkoutTopic;

    public KafkaProducerService(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${spring.kafka.topic.checkout}") String checkoutTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.checkoutTopic = checkoutTopic;
    }

    public void sendCheckoutEvent(CheckoutDTO checkoutDTO) {
        String key = checkoutDTO.getUsername();
        logger.info("Sending checkout event to Kafka for user: {}", key);

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(checkoutTopic, key, checkoutDTO);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                logger.info("Checkout event sent successfully for user: {}", key);
                logger.debug("Offset: {}", result.getRecordMetadata().offset());
            } else {
                logger.error("Failed to send checkout event for user: {}", key, ex);
            }
        });
    }
}