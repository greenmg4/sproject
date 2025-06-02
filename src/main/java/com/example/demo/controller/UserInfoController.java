package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.UserInfoDTO;
import com.example.demo.service.UserInfoService;

@RestController
@RequestMapping("/api/user")
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/info")
    public UserInfoDTO getUserInfo(@RequestBody String cust_id) {
        return userInfoService.getUserInfoById(cust_id);
    }
}