package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CartDTO;

import mapperInterface.CartMapper;

@Service
public class CartServiceImpl implements CartService {
	@Autowired
	private CartMapper CartMapper;

	// 장바구니 저장[박민혁]
	@Override
	public void addCart(CartDTO cart) {
		CartMapper.addCart(cart);
	}

	// 장바구니 호출[박민혁]
	@Override
	public List<CartDTO> CartDetail(String cust_id) {
		return CartMapper.CartDetail(cust_id);
	}

	// 결제시 장바구니 비우기[박민혁]
	@Override
	public void ClearCart(String cust_id) {
		CartMapper.ClearCart(cust_id);
	}
	
	// 장바구니 상품 수량 변경[박민혁]
	@Override
	public int updateCnt(String cust_id, String prod_no, int cnt) {
		return CartMapper.updateCnt(cust_id, prod_no, cnt);
	}

	// 장바구니 선택 상품 삭제[박민혁]
	@Override
	public void deletePro(String cust_id, List<Integer> prod_no) {
		CartMapper.deletePro(cust_id, prod_no);
	}
	
	

}
