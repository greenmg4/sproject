package com.example.demo.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CustDTO;

import mapperInterface.CustMapper;
import mapperInterface.TestMapper;

@Service
public class CustServiceImpl implements CustService {
	@Autowired
	private CustMapper CustMapper;
	
	@Override
	public String login(CustDTO cdto) {
		return CustMapper.login(cdto);
	}

	@Override
	public String search_name(String cust_id) {
		return CustMapper.search_name(cust_id);
	}
	
	@Override
	public String selectGradeByCustId(String cust_id) {
		return CustMapper.selectGradeByCustId(cust_id);
	}

}
