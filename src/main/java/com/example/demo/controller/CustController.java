package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // ✅ 추가된 암호화 비교용
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
@RequestMapping("api/cust")
@RequiredArgsConstructor
public class CustController { 

    @Autowired
    private CustService cservice;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // ✅ 암호화 비교용 인스턴스

    //로그인 [박민혁] / 등급 가져오기 [김정민]
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustDTO cdto, HttpSession session) {
        String cust_id = cdto.getCust_id();
        String input_pw = cdto.getPassword(); // 사용자가 입력한 비밀번호
        
        String cust_pw = cservice.login(cdto); // DB에서 가져온 저장된 비밀번호 (암호화 또는 평문)
        String cust_nm = cservice.search_name(cust_id);
        String grade = cservice.selectGradeByCustId(cust_id);
        int status  = cservice.selectStatusByCustId(cust_id);

        if (cust_pw == null) {
            // 아이디 없음
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("msg", "아이디가 존재하지 않습니다."));
        }

        // ✅ 암호화 여부 체크: bcrypt인지 확인 후 matches(), 아니면 평문 비교
        boolean matches;
        if (cust_pw.startsWith("$2a$") || cust_pw.startsWith("$2b$") || cust_pw.startsWith("$2y$")) {
            matches = passwordEncoder.matches(input_pw, cust_pw);
        } else {
            matches = cust_pw.equals(input_pw);
        }

        if (matches) {
            // Status 가 3 상태면 로그인 불가
            if (status == 3) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("msg", "정지된 계정입니다. 관리자에게 문의하세요."));
            }
            // 로그인 성공
            session.setAttribute("loginID", cust_id);
            session.setAttribute("grade", grade); //등급 저장
            return ResponseEntity.ok(Map.of(
                "cust_id", cust_id,
                "cust_nm", cust_nm,
                "status", status,
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

    // 탈퇴 
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdrawUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        // 세션에서 cust_id(loginID) 꺼내기
        String cust_id = (String) session.getAttribute("loginID");

        if (cust_id == null) {
            // 로그인 안 한 경우
            response.put("success", false);
            response.put("message", "로그인 상태가 아닙니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 탈퇴 로직 실행
        boolean success = cservice.withdrawUser(cust_id);

        response.put("success", success);

        if (success) {
            // 성공 시 세션 무효화
            session.invalidate();
        } else {
            response.put("message", "탈퇴 처리 중 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
    }
    
    
    //비밀번호 확인 및 수정 
  
 // ➕ 1) 현재 비밀번호 확인
    @PostMapping("/password/check")
    public ResponseEntity<?> checkPwd(@RequestBody Map<String, String> body, HttpSession session) {
        String cust_id = (String) session.getAttribute("loginID");
        if (cust_id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인 상태 아님"));
        }
        String current = body.get("currentPassword");
        boolean ok = cservice.checkCurrentPassword(cust_id, current);
        if (ok) return ResponseEntity.ok(Map.of("msg", "비밀번호 일치"));
        else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "비밀번호 불일치"));
    }

    // ➕ 2) 새 비밀번호 변경
    @PutMapping("/password/change")
    public ResponseEntity<?> changePwd(@RequestBody Map<String, String> body, HttpSession session) {
        String cust_id = (String) session.getAttribute("loginID");
        if (cust_id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인 상태 아님"));
        }
        String newPwd = body.get("newPassword");
        // 백엔드에서 비밀번호 정책도 한 번 더 체크 (8자+영숫특)
        if (newPwd.length() < 8
            || !newPwd.matches(".*[A-Za-z].*")
            || !newPwd.matches(".*\\d.*")
            || !newPwd.matches(".*[^A-Za-z0-9].*")) {
            return ResponseEntity.badRequest().body(Map.of("msg", "비밀번호 정책 위반"));
        }
        cservice.changePassword(cust_id, newPwd);
        return ResponseEntity.ok(Map.of("msg", "비밀번호 변경 완료"));
    }
    
    
} 