package com.example.apigatewayauth.controller;

import com.example.apigatewayauth.LoginForm;
import com.example.apigatewayauth.repository.PersonDetailsRepo;

import com.example.apigatewayauth.modal.PersonDetails;
import com.example.apigatewayauth.modal.TokenResponseDto;
import com.example.apigatewayauth.services.JwtService;
import com.example.apigatewayauth.services.MyUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth/account")
public class ContentController {

    @Autowired
    private PersonDetailsRepo personRepo;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private MyUserDetailsService myUserDetailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/home")
    public String handleWelcome() {

        return "Welcome to home!";
    }

    @GetMapping("/csrf")
    public String getCsrfToken(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("XSRF-TOKEN".equals(cookie.getName())) {
                    return cookie.getValue(); // Return the CSRF token
                }
            }
        }
        return "No CSRF token found";
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> authenticateAndGetToken(@RequestBody LoginForm loginForm) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password())
            );
            System.out.println("authenticated user: " + authentication.isAuthenticated());

            // Proceed with your logic


        System.out.println("authenticated user: " + authentication.isAuthenticated());
        if (authentication.isAuthenticated()) {
            // Generate the JWT token
            String token = jwtService.generateToken(
                    myUserDetailService.loadUserByUsername(loginForm.username())
            );

            // Extract roles from the authenticated user
            List<String> roles = authentication.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .toList(); // Convert roles to a List<String>
            String userName=loginForm.username();
            String email=jwtService.extractEmail(token);
            String name=jwtService.extractName(token);
            // Create the response object with token and roles
            TokenResponseDto response = new TokenResponseDto(token, roles,userName,name,email);
          

            // Return response as JSON
            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("Invalid credentials");
        }
    } catch (Exception e) {
        System.out.println("Authentication failed: " + e.getMessage());
        e.printStackTrace();
        throw new UsernameNotFoundException("Invalid credentials");
    }}

    @GetMapping("/profile")
    public PersonDetails handleProfile(@RequestAttribute("Username")  String username) {
        Optional<PersonDetails> user=personRepo.findByIdno(username);
        PersonDetails userObj=user.get();
        return userObj;
    }

    @PostMapping("/update_profile")
    public ResponseEntity<?> updateProfile(@RequestBody PersonDetails personDetails) {
        personDetails.setPassword(passwordEncoder.encode(personDetails.getPassword()));
        System.out.println("updated password: "+personDetails.getPassword());
        personRepo.updatePersonDetails(personDetails.getIdno(), personDetails.getFname(),personDetails.getLname(),personDetails.getEmail(),personDetails.getPhone(),personDetails.getDepartment());
        return ResponseEntity.ok(personDetails);
    }

    @GetMapping("/admin/get_users")
    public ResponseEntity<List<PersonDetails>> getStudents() {
        System.out.println("Student List");
        List<PersonDetails> students=personRepo.findAll();
        return ResponseEntity.ok(students);
    }
}