package com.sp_orderpaymentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpOrderPaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpOrderPaymentServiceApplication.class, args);
    }

}
