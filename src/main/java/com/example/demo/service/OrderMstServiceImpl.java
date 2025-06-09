package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;
import com.example.demo.model.OrderRequestDTO;

import mapperInterface.OrderMstMapper;

@Service
public class OrderMstServiceImpl implements OrderMstService {
	@Autowired
	private OrderMstMapper OMMapper;

	 @Override
	 public int saveOrder(OrderRequestDTO dto) throws Exception {
	 OrderMstDTO orderMst = new OrderMstDTO();
	        
	 orderMst.setCust_id(dto.getCust_id());
	 orderMst.setPay_method(dto.getPay_method());  // 이미 1~5 숫자 코드로 받아온다고 가정
	        	 
	 OffsetDateTime odt = OffsetDateTime.parse(dto.getOrd_dtm());
	 LocalDateTime localOrdDtm = odt.atZoneSameInstant(ZoneId.of("Asia/Seoul")).toLocalDateTime();
	 orderMst.setOrd_dtm(localOrdDtm);
	        
	 orderMst.setTot_amount(dto.getTot_amount());
	 orderMst.setProd_cnt(dto.getProd_cnt());
	 orderMst.setRcv_nm(dto.getRcv_nm());
	 orderMst.setRcv_phone(dto.getRcv_phone());
	 orderMst.setAddress1(dto.getAddress1());
	 orderMst.setAddress2(dto.getAddress2());
	 orderMst.setZip(dto.getZip());
	 orderMst.setReg_dtm(LocalDateTime.now());
	 orderMst.setUpd_dtm(LocalDateTime.now());
	 
	 // 주문 저장 (자동생성된 ord_no 받아오기)
	 OMMapper.insertOrderMst(orderMst);
	 int ord_no = orderMst.getOrd_no();
	        
	 // 주문 상세 리스트 생성
	 List<OrderDetailDTO> details = dto.getOrder_items().stream()
			 		.map(item -> {
	                OrderDetailDTO detail = new OrderDetailDTO();
	                detail.setOrd_no(ord_no);
	                detail.setProd_no(item.getProd_no());
	                detail.setBuy_price(item.getBuy_price());
	                detail.setCnt(item.getCnt());
	                return detail;
	            }).collect(Collectors.toList());
	        
	 // 주문 상세 저장
	 OMMapper.insertOrderDetails(details);
	        
	 return ord_no;
	    }
	
	

}
