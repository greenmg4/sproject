package com.example.demo.service;


import org.springframework.stereotype.Service;
import com.example.demo.model.OrderRequestDTO;

@Service
public interface OrderMstService {
	// 주문 저장[박민혁]
	int saveOrder(OrderRequestDTO dto) throws Exception;

	// 상품수령[박민혁]
	boolean ord_st2(int ord_no);

	// 주문 취소[박민혁]
	boolean ord_st3(int ord_no);

	// 반품[박민혁]
	boolean ord_st4(int ord_no);

}

