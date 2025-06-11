package com.example.demo.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderRequestDTO {
	//[박민혁]
	private String cust_id, pay_method, ord_dtm, rcv_nm, rcv_phone, address1, address2, zip;
    private int tot_amount, prod_cnt;
    private List<OrderItemDTO> order_items;

}
