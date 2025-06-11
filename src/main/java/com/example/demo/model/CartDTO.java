package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CartDTO {
	//[박민혁]
	private String cust_id, prod_no;
	private int cnt = 1;
	private LocalDateTime reg_dtm, upd_dtm;
	
	private String prod_nm, img_path;
	private int prod_price;
	
	
	
}
