package com.example.demo.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.ProductDTO;

import mapperInterface.ProductMapper;



@Service
public class ProductServiceImpl implements ProductService {
	@Autowired
	private ProductMapper ProductMapper;

	@Override
	public List<ProductDTO> proList() {
		return ProductMapper.proList();
	}
}
