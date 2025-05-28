package com.example.demo.service;

import com.example.demo.model.CustDTO;

public interface CustService {

	String login(CustDTO cdto);

	String search_name(String cust_id);
	
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기
}
