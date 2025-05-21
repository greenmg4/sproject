package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapperInterface.TestMapper;

@Service
public class TestServiceImpl implements TestService {
	//** 전역변수 정의 
	@Autowired
	TestMapper mapper;
	
	@Override
	public List<Map<String, Object>> selectList() {
		// TODO Auto-generated method stub
		return mapper.selectList();
	}

}
