package com.sp_productservice.dto;

import lombok.*;
import java.util.List;


public class CartResponseDTO {
    public CartResponseDTO() {}
    private List<CartDTO> items;
    private double totalPrice;
    private int totalItems;

    public List<CartDTO> getItems() {
        return items;
    }

    public void setItems(List<CartDTO> items) {
        this.items = items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }
}