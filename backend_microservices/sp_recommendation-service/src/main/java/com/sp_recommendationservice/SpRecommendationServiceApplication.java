package com.sp_recommendationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpRecommendationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpRecommendationServiceApplication.class, args);
    }

}
