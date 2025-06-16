package com.example.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserJoinDTO;

import mapperInterface.UserJoinMapper;

@Service
public class UserJoinServiceImpl implements UserJoinService{

    private final UserJoinMapper userJoinMapper;
    
    //비밀번호 암호화 
    private final PasswordEncoder passwordEncoder;

    public UserJoinServiceImpl(UserJoinMapper userJoinMapper, PasswordEncoder passwordEncoder) {
        this.userJoinMapper = userJoinMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean isCustIdExists(String cust_id) {
        int count = userJoinMapper.countByCustId(cust_id);
        return count > 0;
    }

    @Override
    public int joinUser(UserJoinDTO user) {
    	 // 💡 비밀번호 암호화
        String rawPassword = user.getPassword();
        String encPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encPassword);  // 암호화된 비밀번호로 교체
        return userJoinMapper.insertUser(user);
    }
    
   
 
    
    
    

}