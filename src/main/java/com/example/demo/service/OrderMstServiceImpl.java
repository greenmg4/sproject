package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CustDTO;
import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;

import mapperInterface.CustMapper;
import mapperInterface.OrderMstMapper;
import mapperInterface.TestMapper;

@Service
public class OrderMstServiceImpl implements OrderMstService {
	@Autowired
	private OrderMstMapper OMMapper;
	
	@Override
	public void saveOrder(OrderMstDTO orderMst, List<OrderDetailDTO> details) {
		// 1) 주문 마스터 저장
        OMMapper.insertOrderMst(orderMst);

        // 2) 주문 상세 저장
        for (OrderDetailDTO detail : details) {
            detail.setOrd_no(orderMst.getOrd_no()); // 마스터에서 생성된 주문번호 세팅
            OMMapper.insertOrderDetail(detail);
        }
	}
	

}
