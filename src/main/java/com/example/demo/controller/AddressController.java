package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AddressDTO;
import com.example.demo.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/list/{custId}")
    public List<AddressDTO> list(@PathVariable String custId) {
        List<AddressDTO> list = addressService.getAddresses(custId);
        return list;
    }


    @PostMapping("/add")
    public void add(@RequestBody AddressDTO dto) {    	
        System.out.println("=== add 메소드 진입 ==="); // ✅ 들어오는지 확인
        System.out.println("받은 주소 데이터 : " + dto); // DTO 값 확인
        addressService.addAddress(dto);

    }

    @DeleteMapping("/delete/{seq}")
    public void delete(@PathVariable Long seq) {
        addressService.deleteAddress(seq);
    }

    @PostMapping("/default")
    public void setDefault(@RequestBody Map<String, Object> data) {
        String custId = (String) data.get("custId");
        Long seq = Long.valueOf(data.get("seq").toString());
        addressService.setDefaultAddress(custId, seq);
    }
    
    @PutMapping("/update")  // 수정 기능 추가
    public void update(@RequestBody AddressDTO dto) {
        addressService.updateAddress(dto);
    }

    // 기본 주소 호출[박민혁]
    @GetMapping("/default/{custId}")
    public ResponseEntity<AddressDTO> DefaultAddress(@PathVariable String custId) {
        AddressDTO dto = addressService.DefaultAddress(custId);  // 수정됨
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
    
}