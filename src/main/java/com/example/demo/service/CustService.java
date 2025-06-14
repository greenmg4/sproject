package com.example.demo.service;

import com.example.demo.model.CustDTO;

public interface CustService {

	String login(CustDTO cdto);

	String search_name(String cust_id);
	
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기
	
	java.util.List<CustDTO> findAllWithoutPassword();
	void updateGrade(String cust_id, String grade);

	void updateStatus(String cust_id, int status);
	int selectStatusByCustId(String cust_id);
	java.util.List<CustDTO> searchMember(String type, String keyword);
 

}
