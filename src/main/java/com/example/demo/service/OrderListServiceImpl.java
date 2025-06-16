package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.OrderListDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.OrderListMapper;

@Service
@RequiredArgsConstructor
public class OrderListServiceImpl implements OrderListService{
	
	private final OrderListMapper olMapper;

	@Override
	public List<OrderListDTO> OrderList(String cust_id) {
		return olMapper.OrderList(cust_id);
	}
	 
	 
	 
	 
	 
}
