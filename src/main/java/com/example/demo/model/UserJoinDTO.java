package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserJoinDTO {
	
    private String cust_id;
    private String password;
    private String cust_nm;
    private String phone;
    private String email;
    private String address1;
    private String address2;
    private String zip;
    private String gender; // 1 or 2
    private String birthday; // yyyy-MM-dd 문자열로 받음
    private String status="1"; // 1=유효고객 (가입시 기본값)
    private String grade = "N"; // 가입시 기본값
    private int tot_buy_amt = 0; // 가입시 기본값
    private LocalDateTime reg_dtm;
    private LocalDateTime upd_dtm;
}
