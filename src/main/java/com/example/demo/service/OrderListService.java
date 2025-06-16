package com.example.demo.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.OrderListDTO;

@Service
public interface OrderListService {

	List<OrderListDTO> OrderList(String cust_id);

}

