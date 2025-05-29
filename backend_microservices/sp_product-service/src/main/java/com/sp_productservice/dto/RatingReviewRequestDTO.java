package com.sp_productservice.dto;

import java.io.Serializable;

public class RatingReviewRequestDTO implements Serializable {
    private Float rating;
    private String review;

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}