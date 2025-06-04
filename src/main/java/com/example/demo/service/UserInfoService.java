package com.example.demo.service;

import com.example.demo.model.UserInfoDTO;

public interface UserInfoService {
    UserInfoDTO getUserInfoById(String cust_id);
    
    int updateUserInfo(UserInfoDTO dto); // 수정 기능 추가
}