package com.example.demo.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.OrderListDTO;

@Service
public interface OrderListService {
	// 결재 내역 출력[박민혁]
	List<OrderListDTO> OrderList(String cust_id);
	
    List<OrderListDTO> adminOrderList();   // ← 이름 통일
	    
    void updateOrderStatus(int ordNo, int status);

}

