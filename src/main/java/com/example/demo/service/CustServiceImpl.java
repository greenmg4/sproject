package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.CustDTO;

import mapperInterface.CustMapper;

@Service
public class CustServiceImpl implements CustService {
	@Autowired
	private CustMapper CustMapper;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
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
    
    
    // 탈퇴    
    @Override
    public boolean withdrawUser(String cust_id) {
        int result = CustMapper.withdrawUserStatus(cust_id);
        return result > 0;
	}

   
    //비밀번호 수정 및 확인
   
    
    @Override
    public boolean checkCurrentPassword(String cust_id, String rawPassword) {
        String encPwd = CustMapper.getEncryptedPassword(cust_id);
        
        System.out.println("🔐 확인용 로그:");
        System.out.println("- 입력된 사용자 ID: " + cust_id);
        System.out.println("- 사용자가 입력한 비밀번호: " + rawPassword);
        System.out.println("- DB에서 가져온 암호화된 비밀번호: " + encPwd);
        System.out.println("🔍 encPwd.equals(rawPassword): " + encPwd.equals(rawPassword));
        System.out.println("encPwd.length(): " + encPwd.length());
        System.out.println("rawPassword.length(): " + rawPassword.length());


        
        if (encPwd == null) return false;

        // ✅ 암호화 여부 판단
        if (encPwd.startsWith("$2a$") || encPwd.startsWith("$2b$") || encPwd.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, encPwd);
        } else {
            return encPwd.equals(rawPassword);
        }
    }

    @Override
    public void changePassword(String cust_id, String newRawPassword) {
        String newEnc = passwordEncoder.encode(newRawPassword);
        CustMapper.updatePassword(cust_id, newEnc);
    }
    

    
}
