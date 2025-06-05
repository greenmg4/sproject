package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.UserJoinDTO;

import mapperInterface.UserJoinMapper;
@Service
public class UserJoinServiceImpl implements UserJoinService{

    private final UserJoinMapper userJoinMapper;

    public UserJoinServiceImpl(UserJoinMapper userJoinMapper) {
        this.userJoinMapper = userJoinMapper;
    }

    @Override
    public boolean isCustIdExists(String cust_id) {
        int count = userJoinMapper.countByCustId(cust_id);
        return count > 0;
    }

    @Override
    public int joinUser(UserJoinDTO user) {
        // TODO: 비밀번호 암호화 추가 가능
        return userJoinMapper.insertUser(user);
    }
}