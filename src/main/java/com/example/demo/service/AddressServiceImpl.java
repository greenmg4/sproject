package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.AddressDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.AddressMapper;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressMapper addressMapper;

    @Override
    public List<AddressDTO> getAddresses(String custId) {
        return addressMapper.findByCustId(custId);
    }

    @Override
    public void addAddress(AddressDTO dto) {
        addressMapper.insertAddress(dto);
    }

    @Override
    public void deleteAddress(Long seq) {
        addressMapper.deleteAddress(seq);
    }

    @Override
    public void setDefaultAddress(String custId, Long seq) {
        addressMapper.resetDefaultAddress(custId);
        addressMapper.setDefaultAddress(custId, seq);
    }
}
