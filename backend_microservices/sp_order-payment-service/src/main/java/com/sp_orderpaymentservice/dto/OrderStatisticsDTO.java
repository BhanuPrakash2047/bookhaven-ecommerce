package com.sp_orderpaymentservice.dto;

import java.util.HashMap;
import java.util.Map;

public class OrderStatisticsDTO {
    private Map<String, Long> orderCounts;

    public OrderStatisticsDTO() {
        this.orderCounts = new HashMap<>();
    }

    public Map<String, Long> getOrderCounts() {
        return orderCounts;
    }

    public void setOrderCounts(Map<String, Long> orderCounts) {
        this.orderCounts = orderCounts;
    }

    public void addStatusCount(String status, Long count) {
        this.orderCounts.put(status, count);
    }
}
