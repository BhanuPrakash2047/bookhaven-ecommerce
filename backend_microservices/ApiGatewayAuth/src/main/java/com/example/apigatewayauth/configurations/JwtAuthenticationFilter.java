package com.example.apigatewayauth.configurations;

import com.example.apigatewayauth.services.JwtService;
import com.example.apigatewayauth.services.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("JwtAuthenticationFilter");
        String authHeader = request.getHeader("Authorization");
        boolean isAuthenticated = false; // Track authentication status
        List<String> userRoles = null; // Variable to hold user roles
        // If there's no Authorization header, just proceed with the request
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("First Chaining");
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7); // Extract the token
        String username = jwtService.extractUsername(jwt);

        // Validate the token and load user details if valid
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
            if (userDetails != null && jwtService.isTokenValid(jwt)) {
                // If the token is valid, authenticate the user
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Extract all roles from UserDetails
                userRoles = userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority) // Get the authority (role)
                        .collect(Collectors.toList()); // Collect roles into a list

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                isAuthenticated = true; // Set authentication status to true
            }
        }

        // Add user roles as a request header for downstream services
        if (userRoles != null) {
            request.setAttribute("UserRoles", userRoles);
        }
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();
        System.out.println("-------------++++++++++++>Given HttpServletRequest: " + requestURI);

        // Write the response indicating the authentication status and user roles
        if (requestURI.contains("/admin/get_users")) {
            assert userRoles != null;
            if (userRoles.contains("ROLE_Admin")) {
                filterChain.doFilter(request, response);
            }
        }
        else if (requestURI.contains("register") || requestURI.contains("profile") || requestURI.contains("update_profile")) {
            request.setAttribute("Username", username);
            filterChain.doFilter(request, response);

        } else {
//            request.setAttribute("Username",username);
            writeResponse(response, isAuthenticated, userRoles, username);
        }
        return;
        // Continue with the filter chain for protected routes
//        filterChain.doFilter(request, response);
    }

    // Helper method to write JSON response
    private void writeResponse(HttpServletResponse response, boolean isAuthenticated, List<String> userRoles, String username) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_OK); // Set response status
        PrintWriter out = response.getWriter();

        // Create JSON response
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("{");
        jsonResponse.append("\"valid\":").append(isAuthenticated).append(", ");
        jsonResponse.append("\"username\":\"").append(username).append("\", ");
        jsonResponse.append("\"roles\":[");

        // Add roles to JSON response
        if (userRoles != null && !userRoles.isEmpty()) {
            for (int i = 0; i < userRoles.size(); i++) {
                jsonResponse.append("\"").append(userRoles.get(i)).append("\""); // Enclose each role in quotes
                if (i < userRoles.size() - 1) {
                    jsonResponse.append(", "); // Add comma if not the last element
                }
            }
        }

        jsonResponse.append("]}"); // Close JSON array and object

        out.print(jsonResponse.toString());
        out.flush();
    }
}