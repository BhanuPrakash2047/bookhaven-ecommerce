package com.example.sp_notificationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpNotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpNotificationServiceApplication.class, args);
    }

}
