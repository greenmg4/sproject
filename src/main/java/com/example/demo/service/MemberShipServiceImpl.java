package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapperInterface.MemberShipMapper;

@Service
public class MemberShipServiceImpl implements MemberShipService {
	@Autowired
	MemberShipMapper mapper;
	
	@Override
	public List<Map<String, Object>> selectGradeList() {
		return mapper.selectGradeList();
	}
}
