package com.sp_recommendationservice.controller;

import com.sp_recommendationservice.dto.RecommendationDTO;
import com.sp_recommendationservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")

public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Get recommendations for a specific user
     * Endpoint: GET /api/recommendations/{username}
     */
    @GetMapping
    public ResponseEntity<RecommendationDTO> getRecommendations(@RequestHeader("userName") String username) {
        try {
            RecommendationDTO recommendations = recommendationService.getRecommendationsForUser(username);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            System.err.println("Error getting recommendations for user " + username + ": " + e.getMessage());

            // Return error response with message
            RecommendationDTO errorResponse = new RecommendationDTO();
            errorResponse.setMessage("Error getting recommendations: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Manually trigger time decay (optional endpoint for maintenance)
     * Endpoint: POST /api/recommendations/decay
     */
    @PostMapping("/decay")
    public ResponseEntity<String> triggerTimeDecay() {
        try {
            recommendationService.applyTimeDecay();
            return ResponseEntity.ok("Time decay applied successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error applying time decay: " + e.getMessage());
        }
    }

    /**
     * Health check endpoint
     * Endpoint: GET /api/recommendations/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Recommendation service is running");
    }
}
