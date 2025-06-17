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

	@Override
	public List<OrderListDTO> OrderList(String cust_id) {
		return OLMapper.OrderList(cust_id);
	}
	 
	 
	 
	 
	 
}
