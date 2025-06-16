package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderListDTO {
	//[박민혁]
	private String cust_id, product_summary, cust_nm, rcv_nm, ord_dtm;
	private int ord_no, tot_amount;
}
