package com.example.demo.service;

import java.util.List;

import com.example.demo.model.CartDTO;

public interface CartService {

	public void addCart(CartDTO cart);

	public List<CartDTO> CartDetail(String cust_id);

	public void ClearCart(String cust_id);

	
}
