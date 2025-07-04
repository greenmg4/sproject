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
    public List<AddressDTO> getAddresses(String cust_id) {
        return addressMapper.findByCustId(cust_id);
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
    public void setDefaultAddress(String cust_id, Long seq) {
        addressMapper.resetDefaultAddress(cust_id);
        addressMapper.setDefaultAddress(cust_id, seq);
    }
    
    @Override
    public void updateAddress(AddressDTO dto) {
    	addressMapper.updateAddress(dto);    	
    }

    
    // 기본 주소 호출[박민혁]
    @Override
    public AddressDTO DefaultAddress(String custId) {
        return addressMapper.DefaultAddress(custId);
    }


    //회원가입 시 입력 배송지 주소 추
    
    
    
}
