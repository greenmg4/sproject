package com.example.demo.controller;

import com.example.demo.model.OrderRequestDTO;
import com.example.demo.service.OrderMstService;

import mapperInterface.CustMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderMstController {

    @Autowired
    private OrderMstService OMService;
    
    @Autowired
    private CustMapper custMapper;
    
    // 주문 저장 [박민혁]
    @PostMapping("/save")
    public ResponseEntity<?> saveOrder(@RequestBody OrderRequestDTO dto) {
        try {
            int order_no = OMService.saveOrder(dto);
            return ResponseEntity.ok(Map.of("orderId", order_no, "message", "주문 저장 성공"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("주문 저장 실패: " + e.getMessage());
        }
    }
    
    // 할인율 [박민혁]
    @GetMapping("/discount/{cust_id}")
    public ResponseEntity<?> getDiscountInfo(@PathVariable("cust_id") String custId) {
        String grade = custMapper.selectGradeByCustId(custId);
        if (grade == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("고객 등급을 찾을 수 없습니다.");
        }

        Double rate = custMapper.DiscRate(grade);
        Integer maxAmt = custMapper.DiscMaxAmt(grade);
        if (rate == null || maxAmt == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("할인 정보를 불러올 수 없습니다.");
        }

        return ResponseEntity.ok(Map.of(
            "disc_rate", rate,
            "disc_max_amt", maxAmt
        ));
    }
    
    // 상품 수령[박민혁]
    @PutMapping("/{ord_no}/2")
    public ResponseEntity<String> ord_st2(@PathVariable int ord_no) {
        boolean success = OMService.ord_st2(ord_no);
        if (success) {
            return ResponseEntity.ok("수령 확인 완료");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수령 확인 실패");
        }
    }
    // 주문 취소[박민혁]
    @PutMapping("/{ord_no}/3")
    public ResponseEntity<String> ord_st3(@PathVariable int ord_no) {
        boolean success = OMService.ord_st3(ord_no);
        if (success) {
            return ResponseEntity.ok("수령 확인 완료");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수령 확인 실패");
        }
    }
    
    // 반품 [박민혁]
    @PutMapping("/{ord_no}/4")
    public ResponseEntity<String> ord_st4(@PathVariable int ord_no) {
        boolean success = OMService.ord_st4(ord_no);
        if (success) {
            return ResponseEntity.ok("수령 확인 완료");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수령 확인 실패");
        }
    }
    
}