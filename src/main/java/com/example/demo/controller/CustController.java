package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    //로그인 [박민혁] / 등급 가져오기 [김정민]
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustDTO cdto, HttpSession session) {
        String cust_pw = cservice.login(cdto);
        String cust_id = cdto.getCust_id();
        String cust_nm = cservice.search_name(cust_id);
    	String grade = cservice.selectGradeByCustId(cust_id); //등급 가져오기
    	int    status  = cservice.selectStatusByCustId(cust_id);

        if (cust_pw == null) {
            // 아이디 없음
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("msg", "아이디가 존재하지 않습니다."));
        } else if (cust_pw.equals(cdto.getPassword())) {
        	
        	// Status 가 3 상태면 로그인 불가
        	if (status == 3) {           // 3 = 정지고객
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                     .body(Map.of("msg", "정지된 계정입니다. 관리자에게 문의하세요."));
            }
        	
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
    
    
    @GetMapping("/session-check")
    public ResponseEntity<?> sessionCheck(HttpSession session) {
        String cust_id = (String) session.getAttribute("loginID");
        String grade = (String) session.getAttribute("grade");

        if (cust_id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("msg", "로그인 상태 아님"));
        }

        String cust_nm = cservice.search_name(cust_id);

        return ResponseEntity.ok(Map.of(
            "cust_id", cust_id,
            "cust_nm", cust_nm,
            "grade", grade
        ));
    }
    
    //어드민 체크 [김정민]
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
    
    
    // [김정민] 회원목록
    @GetMapping("/list")
    public ResponseEntity<?> list(HttpSession session) {
        if (!"A".equals(session.getAttribute("grade"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다");
        }
        List<CustDTO> data = cservice.findAllWithoutPassword();
        return ResponseEntity.ok(data);
    }

    // [김정민] 관리자전용 등급변경
    @PutMapping("/grade")
    public ResponseEntity<?> changeGrade(@RequestBody Map<String, String> body,
                                         HttpSession session) {
        if (!"A".equals(session.getAttribute("grade"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다");
        }
        String cust_id = body.get("cust_id");
        String grade   = body.get("grade");            // N, S, G, V
        cservice.updateGrade(cust_id, grade);
        return ResponseEntity.ok("등급이 변경되었습니다");
    }

    // [김정민] 회원정지
    @PutMapping("/suspend")
    public ResponseEntity<?> adminSuspend(@RequestBody Map<String,String> body,
                                          HttpSession session) {
        if (!"A".equals(session.getAttribute("grade"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("관리자 권한이 필요합니다");
        }
        cservice.updateStatus(body.get("cust_id"), 3);
        return ResponseEntity.ok("해당 회원을 정지했습니다");  // grade 변경 안 함
    }
    
    // [김정민] 회원정지해제 (status 3 -> 1)
    @PutMapping("/unsuspend")
    public ResponseEntity<?> adminUnsuspend(@RequestBody Map<String,String> body,
                                            HttpSession session) {
        if (!"A".equals(session.getAttribute("grade"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("관리자 권한이 필요합니다");
        }
        cservice.updateStatus(body.get("cust_id"), 1);
        return ResponseEntity.ok("정지를 해제했습니다");
    }
    
 // [김정민] 회원 검색 (id / name)
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String type,     // id | name
            @RequestParam String keyword,
            HttpSession session) {

        if (!"A".equals(session.getAttribute("grade"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 필요합니다");
        }
        return ResponseEntity.ok(cservice.searchMember(type, keyword));
    }

    
    
}