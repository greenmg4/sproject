package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CustDTO;
import com.example.demo.service.CustService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cust")
@RequiredArgsConstructor
public class CustController {

    @Autowired
    private CustService cservice;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustDTO cdto, HttpSession session) {
        String cust_pw = cservice.login(cdto);
        String cust_id = cdto.getCust_id();
        String cust_nm = cservice.search_name(cust_id);
    	String grade = cservice.selectGradeByCustId(cust_id); //등급 가져오기

        if (cust_pw == null) {
            // 아이디 없음
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("msg", "아이디가 존재하지 않습니다."));
        } else if (cust_pw.equals(cdto.getPassword())) {
            // 로그인 성공
        	session.setAttribute("loginID", cust_id);
        	session.setAttribute("grade", grade); //등급 저장
            return ResponseEntity.ok(Map.of(
                "cust_id", cust_id,
                "cust_nm", cust_nm,
                "msg", "로그인 성공"
            ));
        } else {
            // 비밀번호 불일치
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("msg", "비밀번호가 틀렸습니다."));
        }
    }
    
    //어드민 체크
    @GetMapping("/admincheck")
    public ResponseEntity<?> admincheck(HttpSession session, CustDTO dto){
    	String grade = (String) session.getAttribute("grade");
    	
    	if (!"A".equals(grade)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한 없음");
        }
        return ResponseEntity.ok("관리자 페이지입니다");
    }
    
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false); // 기존 세션 가져옴
		System.out.printf("로그아웃 되나");
		
		 if (session != null) {
		        System.out.println("세션 존재: " + session.getId());  // 로그 추가
		        session.invalidate(); // 세션 무효화
		        System.out.println("세션 무효화 완료");
		    } else {
		        System.out.println("세션 없음");
		    }
		    return ResponseEntity.ok("Logout successful");
		}
    
}
