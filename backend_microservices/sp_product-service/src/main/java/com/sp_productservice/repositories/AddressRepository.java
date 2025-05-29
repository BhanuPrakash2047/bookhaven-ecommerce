package com.sp_productservice.repositories;

import com.sp_productservice.modal.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserIdAndIsDeletedFalse(String userId);

    Optional<Address> findByIdAndUserIdAndIsDeletedFalse(Long id, String userId);

    Optional<Address> findByUserIdAndDefaultAddressTrueAndIsDeletedFalse(String userId);
}