package com.example.apigatewayauth.services;

import com.example.apigatewayauth.repository.PersonDetailsRepo;

import com.example.apigatewayauth.modal.PersonDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class JwtService {

    private final PersonDetailsRepo userRepo;

    private static final String SECRET = "638CBE3A90E0303BF3808F40F95A7F02A24B4B5D029C954CF553F79E9EF1DC0384BE681C249F1223F6B55AA21DC070914834CA22C8DD98E14A872CA010091ACC";
    private static final long VALIDITY = TimeUnit.MINUTES.toMillis(2000);

    public JwtService(PersonDetailsRepo userRepo) {
        this.userRepo = userRepo;
    }

    public String generateToken(UserDetails userDetails) {

        PersonDetails user = userRepo.findByIdno(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> claims = new HashMap<>();
        claims.put("iss", "https://secure.genuinecoder.com");
        claims.put("iss", "https://secure.genuinecoder.com");
        claims.put("email", user.getEmail());  // Add email to claims
        claims.put("name", user.getFname()+" "+user.getLname());
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(VALIDITY)))
                .signWith(generateKey())
                .compact();
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    // Method to extract email from the token
    public String extractEmail(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.get("email", String.class);  // Extract email from claims
    }

    // Method to extract name from the token
    public String extractName(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.get("name", String.class);   // Extract name from claims
    }
    public String extractUsername(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getSubject();
    }

    private Claims getClaims(String jwt) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public boolean isTokenValid(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getExpiration().after(Date.from(Instant.now()));
    }
}