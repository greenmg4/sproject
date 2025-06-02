package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfoDTO {
    private String cust_id;
    private String cust_nm;
    private String phone;
    private String address1;
    private String address2;
    private String zip;
    private String gender;
    private String birthday;
    private String grade;
    private int tot_buy_amt;



}
