package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AddressDTO {
    private Long seq;
    private String cust_id;        
    private String addr_class;     
    private String address1;
    private String address2;
    @JsonProperty("postcode") // 프론트엔드에서 들어오는 JSON 필드명과 매핑
    private String zip;
    private String rcv_nm;          
    private String rcv_phone;  
    private String default_yn;
}
