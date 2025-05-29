package com.example.apigatewayauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayAuthApplication.class, args);
    }

}
