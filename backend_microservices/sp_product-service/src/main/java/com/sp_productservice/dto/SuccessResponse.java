package com.sp_productservice.dto;



public class SuccessResponse {
    private String message;

    public SuccessResponse(String message) {
        this.message = message;
    }
    public SuccessResponse() {
    }


    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }



}