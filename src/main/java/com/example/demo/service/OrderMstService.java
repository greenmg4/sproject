package com.example.demo.service;


import org.springframework.stereotype.Service;
import com.example.demo.model.OrderRequestDTO;

@Service
public interface OrderMstService {
	// 주문 저장[박민혁]
	int saveOrder(OrderRequestDTO dto) throws Exception;
}

