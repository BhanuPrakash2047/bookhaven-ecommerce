package com.sp_productservice.services;

import com.sp_productservice.dto.AddressDTO;
import com.sp_productservice.modal.Address;
import com.sp_productservice.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getAllAddressesByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }
        return addressRepository.findByUserIdAndIsDeletedFalse(userId);
    }

    public Address getAddressById(Long id, String userId) {
        if (id == null) {
            throw new BadRequestException("id", "Address ID cannot be null");
        }
        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        return addressRepository.findByIdAndUserIdAndIsDeletedFalse(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
    }

    @Transactional
    public Address createAddress(AddressDTO addressDTO, String userId) {
        validateAddress(addressDTO);

        if (userId == null || userId.isEmpty()) {
            throw new BadRequestException("userId", "User ID cannot be empty");
        }

        Address address = new Address();
        copyFromDTO(address, addressDTO);
        address.setUserId(userId);
        address.setDeleted(false);

        // If this is set as default address, unset any existing default address
        if (Boolean.TRUE.equals(addressDTO.getDefaultAddress())) {
            unsetCurrentDefaultAddress(userId);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long id, AddressDTO addressDTO, String userId) {
        if (id == null) {
            throw new BadRequestException("id", "Address ID cannot be null");
        }
        validateAddress(addressDTO);

        Address existingAddress = getAddressById(id, userId);

        copyFromDTO(existingAddress, addressDTO);

        // If this is set as default address, unset any existing default address
        if (Boolean.TRUE.equals(addressDTO.getDefaultAddress()) && !Boolean.TRUE.equals(existingAddress.getDefaultAddress())) {
            unsetCurrentDefaultAddress(userId);
        }

        return addressRepository.save(existingAddress);
    }

    @Transactional
    public void deleteAddress(Long id, String userId) {
        Address address = getAddressById(id, userId);
        address.setDeleted(true);
        addressRepository.save(address);
    }

    @Transactional
    public Address setDefaultAddress(Long id, String userId) {
        Address address = getAddressById(id, userId);

        // Unset current default address
        unsetCurrentDefaultAddress(userId);

        // Set this address as default
        address.setDefaultAddress(true);
        return addressRepository.save(address);
    }

    private void unsetCurrentDefaultAddress(String userId) {
        Optional<Address> currentDefault = addressRepository.findByUserIdAndDefaultAddressTrueAndIsDeletedFalse(userId);
        if (currentDefault.isPresent()) {
            Address defaultAddress = currentDefault.get();
            defaultAddress.setDefaultAddress(false);
            addressRepository.save(defaultAddress);
        }
    }

    private void validateAddress(AddressDTO addressDTO) {
        if (addressDTO.getFullName() == null || addressDTO.getFullName().trim().isEmpty()) {
            throw new BadRequestException("fullName", "Full name cannot be empty");
        }

        if (addressDTO.getPhoneNumber() == null || addressDTO.getPhoneNumber().trim().isEmpty()) {
            throw new BadRequestException("phoneNumber", "Phone number cannot be empty");
        }

        if (addressDTO.getStreetAddress() == null || addressDTO.getStreetAddress().trim().isEmpty()) {
            throw new BadRequestException("streetAddress", "Street address cannot be empty");
        }

        if (addressDTO.getCity() == null || addressDTO.getCity().trim().isEmpty()) {
            throw new BadRequestException("city", "City cannot be empty");
        }

        if (addressDTO.getState() == null || addressDTO.getState().trim().isEmpty()) {
            throw new BadRequestException("state", "State cannot be empty");
        }

        if (addressDTO.getCountry() == null || addressDTO.getCountry().trim().isEmpty()) {
            throw new BadRequestException("country", "Country cannot be empty");
        }

        if (addressDTO.getPostalCode() == null || addressDTO.getPostalCode().trim().isEmpty()) {
            throw new BadRequestException("postalCode", "Postal code cannot be empty");
        }
    }

    private void copyFromDTO(Address address, AddressDTO dto) {
        address.setFullName(dto.getFullName());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setStreetAddress(dto.getStreetAddress());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());
        address.setPostalCode(dto.getPostalCode());
        address.setAddressType(dto.getAddressType());
        address.setDefaultAddress(dto.getDefaultAddress() != null ? dto.getDefaultAddress() : false);
    }
}