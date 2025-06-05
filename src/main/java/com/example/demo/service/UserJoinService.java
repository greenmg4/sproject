package com.example.demo.service;

import com.example.demo.model.UserJoinDTO;

public interface UserJoinService {

    boolean isCustIdExists(String cust_id);
    int joinUser(UserJoinDTO user);
	
}
