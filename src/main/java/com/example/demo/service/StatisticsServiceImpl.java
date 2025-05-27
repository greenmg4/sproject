package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapperInterface.StatisticsMapper;

@Service
public class StatisticsServiceImpl implements StatisticsService {
	@Autowired
	StatisticsMapper mapper;
	
	@Override
	public List<Map<String, Object>> selectYearSaleList(String year) {
//		List<Map<String, Object>> list = mapper.selectYearSaleList(year);
//		return list;
		return mapper.selectYearSaleList(year);
	}
	
	@Override
	public List<Map<String, Object>> selectMonthSaleList(String year) {
//		List<Map<String, Object>> list = mapper.selectYearSaleList(year);
//		return list;
		return mapper.selectMonthSaleList(year);
	}
}
