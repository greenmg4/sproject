package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderMstDTO {
	private int ord_no, tot_amount, prod_cnt;
    private String cust_id, pay_method, rcv_nm, rcv_phone, address1, address2, zip;
    private LocalDateTime ord_dtm, reg_dtm, upd_dtm;
}
