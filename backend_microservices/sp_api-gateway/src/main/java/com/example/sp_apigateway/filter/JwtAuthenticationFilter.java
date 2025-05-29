package com.example.sp_apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final WebClient.Builder webClientBuilder;

    public JwtAuthenticationFilter(WebClient.Builder webClientBuilder) {
        super(Config.class);
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public GatewayFilter apply(Config config) {

        WebClient webClient = WebClient.builder()
                .baseUrl("http://localhost:9000")
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create()
                                .responseTimeout(Duration.ofSeconds(100)) // Adjust the timeout as needed
                ))
                .build();

        return (exchange, chain) -> {
            // Extract Authorization header
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                System.out.println("Nothing Is there bro");
                return this.onError(exchange, "Missing Authorization Header", 401);
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (!authHeader.startsWith("Bearer ")) {
                System.out.println("Invalid Authorization Header");
                return this.onError(exchange, "Invalid Authorization Header", 401);
            }

            // Forward the JWT to the Auth Service via Header
            return webClientBuilder.build()
                    .get()
                    .uri("http://localhost:9000/auth/home") // Endpoint to validate the token and get roles
                    .header(HttpHeaders.AUTHORIZATION, authHeader) // Pass the Authorization header
                    .retrieve()
                    .bodyToMono(AuthResponse.class) // Assuming the Auth Service returns a response with roles
                    .flatMap(authResponse -> {
                        if (authResponse.isValid()) {
                            // Add roles to the request headers for the downstream service
                            List<String> roles = authResponse.getRoles();
                            String username = authResponse.getUsername();

                            if (roles != null && !roles.isEmpty()) {
                                System.out.println("roles frombeta for the body failure: " + roles);

                                // Create a new request with mutated headers
                                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                        .header("Roles", String.join(",", roles)) // Set the Roles header
                                        .header("Username", username) // Set the Username header
                                        .build();

                                // Create a new exchange object with the mutated request (DO NOT REASSIGN `exchange`)
                                ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

                                // Proceed with the new mutated exchange
                                return chain.filter(mutatedExchange); // Use the new mutated exchange
                            }
                        }

                        return this.onError(exchange, "Unauthorized", 401);
                    });
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, int httpStatus) {
        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.valueOf(httpStatus));
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Config properties if needed
    }

    // Inner class to map the Auth Service response
    public static class AuthResponse {
        private boolean valid;
        private List<String> roles;
        private String username;

        public String getUsername() {
            return username;
        }

        public boolean isValid() {
            return valid;
        }

        public void setValid(boolean valid) {
            this.valid = valid;
        }

        public List<String> getRoles() {
            return roles;
        }

        public void setRoles(List<String> roles) {
            this.roles = roles;
        }
    }
}
