package com.sp_recommendationservice.dto;

import java.util.List;

public class RecommendationDTO {

    private List<String> recommendedGenres;
    private List<String> recommendedAuthors;
    private List<String> recommendedPublishers;
    private String message;

    // Constructors
    public RecommendationDTO() {}

    public RecommendationDTO(List<String> recommendedGenres, List<String> recommendedAuthors,
                             List<String> recommendedPublishers, String message) {
        this.recommendedGenres = recommendedGenres;
        this.recommendedAuthors = recommendedAuthors;
        this.recommendedPublishers = recommendedPublishers;
        this.message = message;
    }

    // Getters and Setters
    public List<String> getRecommendedGenres() {
        return recommendedGenres;
    }

    public void setRecommendedGenres(List<String> recommendedGenres) {
        this.recommendedGenres = recommendedGenres;
    }

    public List<String> getRecommendedAuthors() {
        return recommendedAuthors;
    }

    public void setRecommendedAuthors(List<String> recommendedAuthors) {
        this.recommendedAuthors = recommendedAuthors;
    }

    public List<String> getRecommendedPublishers() {
        return recommendedPublishers;
    }

    public void setRecommendedPublishers(List<String> recommendedPublishers) {
        this.recommendedPublishers = recommendedPublishers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}