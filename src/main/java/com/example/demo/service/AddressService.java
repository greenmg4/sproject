package com.example.demo.service;

import java.util.List;

import com.example.demo.model.AddressDTO;

public interface AddressService {
    List<AddressDTO> getAddresses(String cust_id);
    void addAddress(AddressDTO dto);
    void deleteAddress(Long seq);
    void setDefaultAddress(String cust_id, Long seq);
    void updateAddress(AddressDTO dto);

    
   
}
