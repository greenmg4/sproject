package com.example.demo.service;


import org.springframework.stereotype.Service;
import com.example.demo.model.OrderRequestDTO;

@Service
public interface OrderMstService {
	
	int saveOrder(OrderRequestDTO dto) throws Exception;
}

