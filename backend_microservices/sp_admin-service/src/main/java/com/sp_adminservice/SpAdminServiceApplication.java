package com.sp_adminservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.sp_adminservice")
public class SpAdminServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpAdminServiceApplication.class, args);
    }

}
