package com.sp_adminservice.dto;


import lombok.Builder;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public class BookDTO implements Serializable {
    private Long id;
    private String title;
    private String author;
    private String genre;
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private Integer yearPublished;
    private String language;
    private String publisher;
    private String isbn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private byte[] imageBlob;
    private List<ImageDTO> images;
    private List<FAQDTO> faqs;
    private Integer discountedPrice;
    private String tag;

    private Integer totalRatings;

    private Integer averageRating;

    public void setAverageRating(Integer averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }

    public Integer getAverageRating() {
        return averageRating;
    }

    public Integer getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(Integer discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
//need to add add the bestseller,discount,original price


    public BookDTO(Long id, String title, String author, String genre, BigDecimal price, int quantity, String description, int yearPublished, String language, String publisher, String isbn, LocalDateTime createdAt, LocalDateTime updatedAt, byte[] imageBlob, List<ImageDTO> images, List<FAQDTO> faqs) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.yearPublished = yearPublished;
        this.language = language;
        this.publisher = publisher;
        this.isbn = isbn;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageBlob = imageBlob;
        this.images = images;
        this.faqs = faqs;
    }

    public BookDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getYearPublished() {
        return yearPublished;
    }

    public void setYearPublished(int yearPublished) {
        this.yearPublished = yearPublished;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public byte[] getImageBlob() {
        return imageBlob;
    }

    public void setImageBlob(byte[] imageBlob) {
        this.imageBlob = imageBlob;
    }

    public List<ImageDTO> getImages() {
        return images;
    }

    public void setImages(List<ImageDTO> images) {
        this.images = images;
    }

    public List<FAQDTO> getFaqs() {
        return faqs;
    }

    public void setFaqs(List<FAQDTO> faqs) {
        this.faqs = faqs;
    }

    @Override
    public String toString() {
        return "BookDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", genre='" + genre + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", description='" + description + '\'' +
                ", yearPublished=" + yearPublished +
                ", language='" + language + '\'' +
                ", publisher='" + publisher + '\'' +
                ", isbn='" + isbn + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", imageBlob=" + Arrays.toString(imageBlob) +
                ", images=" + images +
                ", faqs=" + faqs +
                ", discountedPrice=" + discountedPrice +
                ", tag='" + tag + '\'' +
                ", totalRatings=" + totalRatings +
                ", averageRating=" + averageRating +
                '}';
    }
}