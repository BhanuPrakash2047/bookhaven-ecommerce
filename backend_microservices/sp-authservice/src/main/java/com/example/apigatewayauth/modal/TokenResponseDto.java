package com.example.apigatewayauth.modal;

import java.util.List;

public class TokenResponseDto {
    private String token;
    private List<String> roles;
    private String userName;
    private String email;
    private String name;

    public TokenResponseDto(String token, List<String> roles, String userName, String name,String email) {
        this.token = token;
        this.roles = roles;
        this.userName = userName;
        this.name=name;
        this.email=email;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }
    public String getUserName(){
        return userName;
    }
    public void setUserName(){
        this.userName = userName;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "TokenResponseDto{" +
                "token='" + token + '\'' +
                ", roles=" + roles +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
