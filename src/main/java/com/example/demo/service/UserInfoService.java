package com.example.demo.service;

import com.example.demo.model.UserInfoDTO;

public interface UserInfoService {
    UserInfoDTO getUserInfoById(String cust_id);
}