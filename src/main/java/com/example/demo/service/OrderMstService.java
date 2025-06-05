package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;

@Service
public interface OrderMstService {

	void saveOrder(OrderMstDTO orderMst, List<OrderDetailDTO> details);



	
}
