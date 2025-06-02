package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserInfoDTO;

import mapperInterface.UserInfoMapper;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;


	@Override
	public UserInfoDTO getUserInfoById(String cust_id) {
	return userInfoMapper.getUserInfoById(cust_id);
}
}
