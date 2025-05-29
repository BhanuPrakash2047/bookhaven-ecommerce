package com.sp_productservice.dto;

import java.util.List;

public class WishlistResponseDTO {
    private List<WishlistDTO> items;
    private int totalItems;

    public List<WishlistDTO> getItems() {
        return items;
    }

    public void setItems(List<WishlistDTO> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }
}