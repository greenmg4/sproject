package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderDetailDTO {
	//[박민혁]
	 private int ord_no, buy_price, cnt;   
	 private String prod_no;
}
