package com.sp_productservice.controller;

import com.sp_productservice.dto.AddressDTO;
import com.sp_productservice.dto.UpdateDefaultAddressResponse;
import com.sp_productservice.modal.Address;
import com.sp_productservice.services.AddressService;
import com.sp_productservice.services.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    /**
     * Create a new address
     * @param addressDTO address data
     * @param username user identifier (injected by gateway)
     * @return created address
     */
    @PostMapping
    public ResponseEntity<Address> createAddress(
            @RequestBody AddressDTO addressDTO,
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        Address createdAddress = addressService.createAddress(addressDTO, username);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    /**
     * Get all addresses for the current user
     * @param username user identifier (injected by gateway)
     * @return list of addresses
     */
    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses(
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        List<Address> addresses = addressService.getAllAddressesByUserId(username);
        for(Address address : addresses) {
            System.out.println(address.toString());
            System.out.println("Hello");
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    /**
     * Get a specific address by id
     * @param id address identifier
     * @param username user identifier (injected by gateway)
     * @return address details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(
            @PathVariable Long id,
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        Address address = addressService.getAddressById(id, username);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    /**
     * Update an existing address
     * @param id address identifier
     * @param addressDTO updated address data
     * @param username user identifier (injected by gateway)
     * @return updated address
     */
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long id,
            @RequestBody AddressDTO addressDTO,
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        Address updatedAddress = addressService.updateAddress(id, addressDTO, username);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    /**
     * Delete an address (soft delete)
     * @param id address identifier
     * @param username user identifier (injected by gateway)
     * @return success response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        addressService.deleteAddress(id, username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Set an address as default
     * @param id address identifier
     * @param username user identifier (injected by gateway)
     * @return success response
     */
    @PutMapping("/{id}/default")
    public ResponseEntity<UpdateDefaultAddressResponse> setDefaultAddress(
            @PathVariable Long id,
            @RequestHeader("userName") String username) {

        if (username == null || username.isEmpty()) {
            throw new BadRequestException("Authorization header is missing or invalid");
        }

        Address address = addressService.setDefaultAddress(id, username);
        UpdateDefaultAddressResponse response = new UpdateDefaultAddressResponse(
                true,
                "Address with ID " + id + " has been set as the default address"
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
