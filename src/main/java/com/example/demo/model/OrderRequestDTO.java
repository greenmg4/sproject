package com.example.demo.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderRequestDTO {
	private String cust_id, merchant_uid, imp_uid, pay_method, buyer_name, buyer_tel, buyer_addr, buyer_postcode, ord_dtm;
    private int amount;
    private List<OrderItemDTO> order_items;

}
