package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserJoinDTO;
import com.example.demo.service.UserJoinService;

@RestController
@RequestMapping("/api/user")
public class UserJoinController {

    private final UserJoinService userJoinService;

    public UserJoinController(UserJoinService userJoinService) {
        this.userJoinService = userJoinService;
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserJoinDTO userDto) {
        if (userJoinService.isCustIdExists(userDto.getCust_id())) {
            return ResponseEntity.ok(Map.of("success", false, "message", "이미 존재하는 아이디입니다."));
        }

        userJoinService.joinUser(userDto);
        return ResponseEntity.ok(Map.of("success", true, "message", "회원가입이 완료되었습니다."));
    }

    
    @PostMapping("/check-id") //id 중복확인
    public ResponseEntity<?> checkId(@RequestBody UserJoinDTO userDto) {
        boolean exists = userJoinService.isCustIdExists(userDto.getCust_id());
        return ResponseEntity.ok().body(Map.of("available", !exists));
    }
    
}