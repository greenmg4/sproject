package com.example.demo.controller;

import com.example.demo.model.OrderRequestDTO;
import com.example.demo.service.OrderMstService;

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
}