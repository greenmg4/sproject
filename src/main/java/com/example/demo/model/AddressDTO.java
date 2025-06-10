package com.example.demo.model;

import lombok.Data;

@Data
public class AddressDTO {
    private Long seq;
    private String cust_id;        
    private String addr_class;     
    private String address1;
    private String address2;
    private String zip;
    private String rcv_nm;          
    private String rcv_phone;      
}
