package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapperInterface.UserInfoMapper;
import com.example.demo.model.UserInfoDTO;

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
}