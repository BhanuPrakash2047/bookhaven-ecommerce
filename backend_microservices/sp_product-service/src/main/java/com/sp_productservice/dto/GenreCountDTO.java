package com.sp_productservice.dto;

public class GenreCountDTO {
    private String genre;
    private Long count;

    public GenreCountDTO(String genre, Long count) {
        this.genre = genre;
        this.count = count;
    }

    public String getGenre() {
        return genre;
    }

    public Long getCount() {
        return count;
    }
}
