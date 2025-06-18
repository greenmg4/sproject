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
	
	//탈퇴
	
	 boolean withdrawUser(String cust_id);
	 
	 //비밀번호 암호화 및 평문
	 //🔸➕ 현재 비밀번호 가져오기
	 String getPasswordById(String cust_id);
	 // 비밀번호 수정 및 확인
	 boolean checkCurrentPassword(String cust_id, String rawPassword);
	 // 암호화 후 새 비밀번호 저장 
	 void changePassword(String cust_id, String newRawPassword);	 
	 

}
