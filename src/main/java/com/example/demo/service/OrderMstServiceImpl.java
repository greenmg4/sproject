package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;
import com.example.demo.model.OrderRequestDTO;

import mapperInterface.CartMapper;
import mapperInterface.CustMapper;
import mapperInterface.OrderMstMapper;
import mapperInterface.ProductMapper;

@Service
public class OrderMstServiceImpl implements OrderMstService {

    @Autowired
    private OrderMstMapper OMMapper;

    @Autowired
    private CustMapper custMapper;
    
    @Autowired
    private CartMapper cartMapper;
    
    @Autowired
    private ProductMapper productMapper; 
    
    
    //[박민혁]
    @Transactional
    @Override
    public int saveOrder(OrderRequestDTO dto) throws Exception {
        String cust_id = dto.getCust_id();

        // 고객 현재 등급 조회
        String currentGrade = custMapper.selectGradeByCustId(cust_id);

        // 해당 등급의 할인율과 최대 할인 금액 조회
        double discRate = custMapper.DiscRate(currentGrade);// 할인율 조회
        int maxDiscAmt = custMapper.DiscMaxAmt(currentGrade);// 할인 최대 금액 조회

        // 원래 결제금액과 할인 적용
        int originalTotal = dto.getTot_amount(); // 원래 결제 금액
        int discountAmt = (int) Math.floor(originalTotal * (discRate / 100.0));
        if (discountAmt > maxDiscAmt) discountAmt = maxDiscAmt;
        int discountedTotal = originalTotal - discountAmt;

        // 주문 마스터 구성
        OrderMstDTO orderMst = new OrderMstDTO();
        orderMst.setCust_id(cust_id);
        orderMst.setPay_method(dto.getPay_method());

        OffsetDateTime odt = OffsetDateTime.parse(dto.getOrd_dtm());
        LocalDateTime localOrdDtm = odt.atZoneSameInstant(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        orderMst.setOrd_dtm(localOrdDtm);

        orderMst.setTot_amount(discountedTotal); // 할인 적용된 금액
        orderMst.setProd_cnt(dto.getProd_cnt());
        orderMst.setRcv_nm(dto.getRcv_nm());
        orderMst.setRcv_phone(dto.getRcv_phone());
        orderMst.setAddress1(dto.getAddress1());
        orderMst.setAddress2(dto.getAddress2());
        orderMst.setZip(dto.getZip());
        orderMst.setReg_dtm(LocalDateTime.now());
        orderMst.setUpd_dtm(LocalDateTime.now());

        // 주문 저장
        OMMapper.insertOrderMst(orderMst);
        int ord_no = orderMst.getOrd_no();

        // 주문 상세 저장
        List<OrderDetailDTO> details = dto.getOrder_items().stream()
            .map(item -> {
                OrderDetailDTO detail = new OrderDetailDTO();
                detail.setOrd_no(ord_no);
                detail.setProd_no(item.getProd_no());
                detail.setBuy_price(item.getBuy_price());
                detail.setCnt(item.getCnt());
                
                productMapper.decreaseProdCnt(Integer.parseInt(item.getProd_no()), item.getCnt());
                
                return detail;
            }).collect(Collectors.toList());
        OMMapper.insertOrderDetails(details);
        
        // 장바구니에서 주문한 상품 삭제
        List<Integer> prod_no = dto.getOrder_items().stream()
					        	    .map(item -> Integer.parseInt(item.getProd_no()))
					        	    .collect(Collectors.toList());

        cartMapper.deletePro(cust_id, prod_no);

        // 고객 총 구매 금액 누적 반영 (할인 적용된 금액만 반영)
        custMapper.updateTotBuyAmt(cust_id, discountedTotal);

        int newTotBuyAmt = custMapper.TotBuyAmt(cust_id); //총 누적 금액 조회
        String newGrade = custMapper.GradeTotBuyAmt(newTotBuyAmt);// 누적 금액에 맞는 등급 조회

        // 현재 등급보다 높은 등급으로만 업데이트
        if (!newGrade.equals(currentGrade)) {
            custMapper.updateGrade(cust_id, newGrade);
        }

        return ord_no;
    }

    // 상품 수령[박민혁]
	@Override
	public boolean ord_st2(int ord_no) {
		int update = OMMapper.ord_st2(ord_no, 2); // 2: 수령확인 상태
        return update > 0;
	}

	// 주문 취소[박민혁]
	@Override
	public boolean ord_st3(int ord_no) {
		int update = OMMapper.ord_st3(ord_no, 3); // 3: 주문 취소
        return update > 0;
	}

	// 반품[박민혁]
	@Override
	public boolean ord_st4(int ord_no) {
		int update = OMMapper.ord_st4(ord_no, 4); // 4: 반품
        return update > 0;
	}


}