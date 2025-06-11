package com.example.demo.service;

import java.util.List;

import com.example.demo.model.CartDTO;

public interface CartService {

	// 장바구니 저장[박민혁]
	public void addCart(CartDTO cart);

	// 장비구니 호출[박민혁]
	public List<CartDTO> CartDetail(String cust_id);

	// 결제시 장바구니 비우기[박민혁]
	public void ClearCart(String cust_id);

	// 장바구니 상품 수량 변경[박민혁]
	public int updateCnt(String cust_id, String prod_no, int cnt);

	// 장바구니 선택 상품 삭제[박민혁]
	public void deletePro(String cust_id, List<Integer> prod_no);

	
}
