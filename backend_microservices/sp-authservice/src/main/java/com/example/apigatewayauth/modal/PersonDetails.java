package com.example.apigatewayauth.modal;

import jakarta.persistence.*;


@Entity
@Table(name = "person_details")
public class PersonDetails {

    @Id
    @Column(name = "username", nullable = false, length = 15)
    private String idno;

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    @Column
    private Integer credits;

    @Column(name = "fname", nullable = false, length = 50)
    private String fname;

    @Column(name = "lname", nullable = false, length = 50)
    private String lname;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "password", nullable = false, length = 255)
    private String password; // Store hashed passwords

    @Column(name="role")
    private String role;

    // Constructors
    public PersonDetails() {
    }

    public PersonDetails(String idno, String fname, String lname, String email, String phone, String department, String password,String role) {
        this.idno = idno;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.password = password;
        this.role=role;
    }

    // Getters and Setters
    public String getIdno() {
        return idno;
    }

    public void setIdno(String idno) {
        this.idno = idno;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Optionally override toString(), equals(), and hashCode() methods for better object representation
    @Override
    public String toString() {
        return "PersonDetails{" +
                "idno='" + idno + '\'' +
                ", fname='" + fname + '\'' +
                ", lname='" + lname + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", department='" + department + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
