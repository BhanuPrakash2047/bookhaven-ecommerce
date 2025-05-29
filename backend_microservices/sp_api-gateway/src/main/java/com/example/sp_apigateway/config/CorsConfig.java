package com.example.sp_apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        // Create a CorsConfigurationSource instance
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Set CORS configurations
        config.setAllowCredentials(true); // Allow credentials
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Your frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Allowed headers
        config.setExposedHeaders(List.of("Authorization")); // Expose Authorization header

        // Register CORS configuration for all endpoints
        source.registerCorsConfiguration("/**", config);

        // Return a new CorsWebFilter with the CorsConfigurationSource
        return new CorsWebFilter(source);
    }
}
