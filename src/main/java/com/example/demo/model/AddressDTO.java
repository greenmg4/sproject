package com.example.demo.model;

import lombok.Data;

@Data
public class AddressDTO {
    private int seq;
    private String custId;         // ★ 수정된 부분
    private String addrClass;      // ★ 수정된 부분
    private String address1;
    private String address2;
    private String zip;
    private String rcvNm;          // ★ 수정된 부분
    private String rcvPhone;       // ★ 수정된 부분
}
