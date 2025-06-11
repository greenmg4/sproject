package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CustDTO {
	//[박민혁]
	private String cust_id, password, cust_nm, phone, address1, address2, zip, gender
	, birthday, status, grade, reg_dtm, upd_dtm;
	private int tot_buy_amt;
}
