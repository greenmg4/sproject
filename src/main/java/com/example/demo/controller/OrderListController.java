package com.example.demo.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.OrderListDTO;
import com.example.demo.service.OrderListService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class OrderListController {
	private final OrderListService OLService;

	//결제 내역 출력[박민혁]
	@GetMapping("/List")
	public List<OrderListDTO> OrderList(HttpSession session) {
		String cust_id = (String) session.getAttribute("loginID");
	    	if (cust_id == null) {
	            throw new RuntimeException("로그인 정보가 없습니다.");
	        }
	        return OLService.OrderList(cust_id);
	    }
    
}