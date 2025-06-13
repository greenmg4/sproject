package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CustDTO;

import mapperInterface.CustMapper;

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
	
	
    /* === 관리자 회원관리 === */
    @Override
    public List<CustDTO> findAllWithoutPassword() {
        return CustMapper.findAllWithoutPassword();
    }

    @Override
    public void updateStatus(String cust_id, int status) {
        CustMapper.updateStatusSimple(cust_id, status);
    }

    @Override
    public void updateGrade(String cust_id, String grade) {
        CustMapper.updateGradeSimple(cust_id, grade);
    }
    
    @Override
    public int selectStatusByCustId(String cust_id) {
        return CustMapper.selectStatusByCustId(cust_id);
    }
    
    @Override
    public List<CustDTO> searchMember(String type, String keyword) {
        return CustMapper.searchMember(type, "%" + keyword + "%");
    }


}
