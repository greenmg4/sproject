package com.example.demo.service;

import com.example.demo.model.UserInfoDTO;

public interface UserInfoService {
    UserInfoDTO getUserInfoById(String cust_id);
    
    int updateUserInfo(UserInfoDTO dto); // 수정 기능 추가
    void updateOrInsertAddress(UserInfoDTO dto);
    void updateUserAddress(String cust_id, String address1, String address2, String zip);
    //img 추가
    void updateProfileImg(String custId, String imgUrl);
    void deleteProfileImg(String custId);

    
}