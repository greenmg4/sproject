package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserInfoDTO;
import com.example.demo.service.UserInfoService;

@RestController
@RequestMapping("/api/user")
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/info")
    public UserInfoDTO getUserInfo(@RequestBody Map<String, String> map) {
        String cust_Id = map.get("cust_id");
        return userInfoService.getUserInfoById(cust_Id);
    }
}