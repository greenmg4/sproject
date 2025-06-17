package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.OrderListDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.OrderListMapper;

@Service
@RequiredArgsConstructor
public class OrderListServiceImpl implements OrderListService{
	
	private final OrderListMapper OLMapper;

	// 결재내역 출력[박민혁]
	@Override
	public List<OrderListDTO> OrderList(String cust_id) {
		return OLMapper.OrderList(cust_id);
	}

	 
	 
	 
	 
	 
}
