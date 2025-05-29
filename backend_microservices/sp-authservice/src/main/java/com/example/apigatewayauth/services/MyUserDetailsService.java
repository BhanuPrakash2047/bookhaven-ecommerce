package com.example.apigatewayauth.services;


import com.example.apigatewayauth.repository.PersonDetailsRepo;

import com.example.apigatewayauth.modal.PersonDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private PersonDetailsRepo repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<PersonDetails> user = repository.findByIdno(username);
        if (user.isPresent()) {
            var userObj = user.get();
            System.out.println("-----------------------------------------------------------------"+username);
            System.out.println(userObj.getIdno());
            return User.builder()
                    .username(userObj.getIdno())
                    .password(userObj.getPassword())
                    .roles(getRoles(userObj))
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }

    private String[] getRoles(PersonDetails user) {
        if (user.getRole()== null) {
            return new String[]{"USER"};
        }
        return user.getRole().split(",");
    }
}
