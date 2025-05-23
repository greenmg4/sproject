package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CartDTO;
import com.example.demo.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
	
	@Autowired
	private CartService cservice;
	
	@PostMapping("/cart")
	public ResponseEntity<String> addCart(@RequestBody CartDTO cart) {
		System.out.println("장바구니 요청 데이터"+cart);
	    cservice.addCart(cart);
	    return ResponseEntity.ok("장바구니에 추가되었습니다.");
	}

}
