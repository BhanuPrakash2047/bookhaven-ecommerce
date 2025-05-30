package com.sp_productservice.dto;


import lombok.*;


public class CartRequestDTO {

    public CartRequestDTO() {}

    private Long bookId;
    private int quantity;


    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}