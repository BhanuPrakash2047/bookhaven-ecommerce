package com.example.apigatewayauth.controller;

import com.example.apigatewayauth.repository.PersonDetailsRepo;

import com.example.apigatewayauth.modal.PersonDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    @Autowired
    private PersonDetailsRepo myUserRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register/user" ,consumes = "application/json")
    public ResponseEntity<PersonDetails> createUser(@RequestBody PersonDetails user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return new ResponseEntity<>(myUserRepository.save(user), HttpStatus.OK);
    }
}
