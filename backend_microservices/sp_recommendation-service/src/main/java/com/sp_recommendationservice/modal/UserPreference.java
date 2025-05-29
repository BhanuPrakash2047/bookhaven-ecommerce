package com.sp_recommendationservice.modal;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preference")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String preferenceType; // "GENRE", "AUTHOR", "PUBLISHER"
    private String preferenceValue; // actual genre/author/publisher name
    private Double score; // weighted score
    private LocalDateTime lastUpdated;

    // Constructors
    public UserPreference() {}

    public UserPreference(String username, String preferenceType, String preferenceValue, Double score) {
        this.username = username;
        this.preferenceType = preferenceType;
        this.preferenceValue = preferenceValue;
        this.score = score;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPreferenceType() {
        return preferenceType;
    }

    public void setPreferenceType(String preferenceType) {
        this.preferenceType = preferenceType;
    }

    public String getPreferenceValue() {
        return preferenceValue;
    }

    public void setPreferenceValue(String preferenceValue) {
        this.preferenceValue = preferenceValue;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}