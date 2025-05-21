package com.example.demo.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.service.TestService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@RequestMapping("/test")
@Log4j2
@RequiredArgsConstructor
public class TestController {
	private final TestService service;
	
	@GetMapping("/check-server")
	public ResponseEntity<?> checkLogin() {
		log.info("** React SpringBoot Connection 확인중 **");
		return  ResponseEntity.ok()
				.body(Map.of("checkData","** Port:8080 **"
							,"checkLogin","** 로그인확인안됨 **"));
		
		// => Map.of()
        //	- java 9 버전 부터 추가, 간편하게 초기화 가능
        //	  map.put(1, "sangwoo kang"); map.put(2, "james kang"); put(3, "stef you");
        //	  -> Map.of(key_1, "Value_sangwoo kang",
        //        		2, "james kang",
        //        		3, "stef you" )
        //	- 그러나 10개 까지만 초기화 가능 (10개 이상은 ofEntries() 사용)
        //	- unmodifiable(수정불가능) map을 리턴하므로 초기화후 수정불가능 (Immutable 객체)
        //	- 초기화 이후에 조회만 하는경우 주로사용함.(Key 관리 등)
		//  hg 1차 테스트
	}//checkLogin
	
	
 	@GetMapping("/memberlist")
 	public ResponseEntity<?> memberlist() {
 		List<Map<String,Object>> list = service.selectList();
    	if ( list !=null && list.size() > 0 ) {	
			return ResponseEntity.ok().body(list);
		} else {
			log.info("** memberlist NotFound **");
			return ResponseEntity
					.status(HttpStatus.BAD_GATEWAY) 
					.body("memberlist NotFound");
		}
 	} //memberlist
 	
}
