package com.example.demo.controller;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;
import com.example.demo.model.OrderRequestDTO;
import com.example.demo.service.CartService;
import com.example.demo.service.OrderMstService;

@RestController
@RequestMapping("/api/order")
public class OrderMstController {

    @Autowired
    private OrderMstService orderService;
    @Autowired
    private CartService cservice;

    @PostMapping("/save")
    public ResponseEntity<?> saveOrder(@RequestBody OrderRequestDTO orderRequest) {
        try {
            OrderMstDTO orderMst = new OrderMstDTO();
            orderMst.setCust_id(orderRequest.getCust_id());
            
            // pay_method 매핑 (아임포트 pay_method 문자열 -> DB에 맞는 숫자코드 변환 필요)
            String payMethod = switch (orderRequest.getPay_method()) {
                case "card" -> "2";
                case "phone" -> "4";
                case "vbank" -> "5";
                default -> "3"; // 간편결제 등 기본값
            };
            orderMst.setPay_method(payMethod);

            orderMst.setOrd_dtm(LocalDateTime.parse(orderRequest.getOrd_dtm().replace("Z","")));
            orderMst.setTot_amount(orderRequest.getAmount());
            orderMst.setProd_cnt(orderRequest.getOrder_items().size());
            orderMst.setRcv_nm(orderRequest.getBuyer_name());
            orderMst.setRcv_phone(orderRequest.getBuyer_tel());

            // 주소 나누기 예 (단순히 address1에 다 넣고 address2 빈칸)
            orderMst.setAddress1(orderRequest.getBuyer_addr());
            orderMst.setAddress2("");
            orderMst.setZip(orderRequest.getBuyer_postcode());

            List<OrderDetailDTO> details = orderRequest.getOrder_items().stream()
                .map(item -> {
                    OrderDetailDTO detail = new OrderDetailDTO();
                    detail.setProd_no(item.getProd_no());
                    detail.setBuy_price(item.getProd_price());
                    detail.setCnt(item.getCnt());
                    return detail;
                })
                .toList();

            orderService.saveOrder(orderMst, details);
            // 결제 성공 시 장바구니 비우기
            cservice.ClearCart(orderRequest.getCust_id());

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}