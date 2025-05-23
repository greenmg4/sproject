package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CartDTO;

import mapperInterface.CartMapper;

@Service
public class CartServiceImpl implements CartService {
	@Autowired
	private CartMapper CartMapper;

	@Override
	public void addCart(CartDTO cart) {
		CartMapper.addCart(cart);
	}
	
	

}
