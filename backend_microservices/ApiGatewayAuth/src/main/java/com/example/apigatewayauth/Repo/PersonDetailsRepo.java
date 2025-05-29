package com.example.apigatewayauth.Repo;

import com.example.apigatewayauth.modal.PersonDetails;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.parameters.P;

import java.util.Optional;

public interface PersonDetailsRepo extends JpaRepository<PersonDetails, Integer> {
    Optional<PersonDetails> findByIdno(String idno);
    
    @Modifying
    @Transactional
    @Query("UPDATE PersonDetails p SET p.fname = :fname, p.lname = :lname, p.email = :email, p.phone = :phone, p.department = :department WHERE p.idno = :idno")
    int updatePersonDetails(String idno, String fname, String lname, String email, String phone, String department);


}
