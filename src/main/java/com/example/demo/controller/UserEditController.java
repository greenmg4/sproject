package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserInfoDTO;
import com.example.demo.service.UserInfoService;

@RestController
@RequestMapping("/api/user")
public class UserEditController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/update")
    public String updateUserInfo(@RequestBody UserInfoDTO dto) {
        int result = userInfoService.updateUserInfo(dto);
     // 🔥 주소도 같이 업데이트
        userInfoService.updateOrInsertAddress(dto);        
        return result > 0 ? "success" : "fail";
    }
}
