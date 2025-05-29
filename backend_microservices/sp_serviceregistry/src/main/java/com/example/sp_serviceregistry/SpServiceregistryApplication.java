package com.example.sp_serviceregistry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class SpServiceregistryApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpServiceregistryApplication.class, args);
    }

}
