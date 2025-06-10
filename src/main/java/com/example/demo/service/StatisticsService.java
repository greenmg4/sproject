package com.example.demo.service;

import java.util.List;
import java.util.Map;

public interface StatisticsService {
	List<Map<String, Object>> selectYearSaleList(String year);
	List<Map<String, Object>> selectMonthSaleList(String month);
	List<Map<String, Object>> selectSalesByProductList(String searchDate, int limit, int offset);
	
}
