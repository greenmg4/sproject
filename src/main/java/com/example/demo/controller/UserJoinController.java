package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.UserJoinDTO;
import com.example.demo.model.AddressDTO;      // ✅ AddressDTO import 추가
import com.example.demo.service.UserJoinService;
import com.example.demo.service.AddressService; // ✅ AddressService import 추가

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor       // 생성자 주입 자동 설정
public class UserJoinController {

    private final UserJoinService userJoinService;
    private final AddressService addressService; // ✅ AddressService 주입

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserJoinDTO userDto) {
        // ✅ 기존 기능: 중복 ID 체크
        if (userJoinService.isCustIdExists(userDto.getCust_id())) {
            return ResponseEntity.ok(Map.of("success", false, "message", "이미 존재하는 아이디입니다."));
        }

        // ✅ 기존 기능: custom 테이블에 회원정보 저장
        userJoinService.joinUser(userDto);

        // ✅ 추가 기능: delivery_addr 테이블에도 동일 주소 저장
        AddressDTO address = new AddressDTO();
        address.setCust_id(userDto.getCust_id());       // 회원 ID 연결
        address.setAddr_class("01");               		// 주소 구분용 분류
        address.setAddress1(userDto.getAddress1());     // 입력된 기본주소
        address.setAddress2(userDto.getAddress2());     // 입력된 상세주소
        address.setZip(userDto.getZip());               // 우편번호
        address.setRcv_nm(userDto.getCust_nm());        // 수령자 명 (회원 이름)
        address.setRcv_phone(userDto.getPhone());       // 수령자 연락처
        address.setDefault_yn("Y");                     // 가입 시 기본 배송지로 설정

        addressService.addAddress(address);             // ✅ 배송지 저장 실행

        // ✅ 응답: 회원가입 + 주소 저장 모두 정상
        return ResponseEntity.ok(Map.of("success", true, "message", "회원가입이 완료되었습니다."));
    }

    @PostMapping("/check-id") // 아이디 중복확인 API
    public ResponseEntity<?> checkId(@RequestBody UserJoinDTO userDto) {
        boolean exists = userJoinService.isCustIdExists(userDto.getCust_id());
        return ResponseEntity.ok(Map.of("available", !exists));
    }
}
