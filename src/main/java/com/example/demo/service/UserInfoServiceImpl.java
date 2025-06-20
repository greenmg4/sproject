package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.AddressDTO;
import com.example.demo.model.UserInfoDTO;

import mapperInterface.AddressMapper;
import mapperInterface.UserInfoMapper;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    @Override
    public UserInfoDTO getUserInfoById(String cust_id) {
        return userInfoMapper.getUserInfoById(cust_id);
    }

    @Override
    public int updateUserInfo(UserInfoDTO dto) {
        return userInfoMapper.updateUserInfo(dto); // SQL 실행
    }
    
    @Autowired
    private AddressMapper addressMapper;

    @Override
    public void updateOrInsertAddress(UserInfoDTO dto) {
        // delivery_addr에 해당 고객의 주소가 이미 있는지 확인
        AddressDTO existing = addressMapper.findDefaultAddress(dto.getCust_id());

        AddressDTO address = new AddressDTO();
        address.setCust_id(dto.getCust_id());
        address.setRcv_nm(dto.getRcv_nm());
        address.setRcv_phone(dto.getRcv_phone());
        address.setAddr_class(dto.getAddr_class());
        address.setZip(dto.getZip());
        address.setAddress1(dto.getAddress1());
        address.setAddress2(dto.getAddress2());
        address.setDefault_yn("Y");

        if (existing == null) {
            // INSERT
            addressMapper.insertAddress(address);
        } else {
            // UPDATE
            address.setSeq(existing.getSeq()); // 시퀀스 필요
            addressMapper.updateAddress(address);
        }
    }
    
    @Override
    public void updateUserAddress(String cust_id, String address1, String address2, String zip) {
        System.out.println("📌 custom 주소 업데이트 시도: " + cust_id + ", " + address1); // ✅ 로그 확인
        userInfoMapper.updateUserAddress(cust_id, address1, address2, zip);
    }


}