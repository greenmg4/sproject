package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CustDTO;
import com.example.demo.service.StatisticsService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import mapperInterface.MemberShipMapper;

@RestController
@RequestMapping("/membership")
@Log4j2
@RequiredArgsConstructor
public class MemberShipController {
	private final MemberShipMapper service;
	
    @GetMapping("/gradelist")
    public ResponseEntity<?> gradelist(){

 		List<Map<String,Object>> list = service.selectGradeList();
 		//if ( list !=null && list.size() > 0 ) {
    	if ( list !=null && list.size() >= 0 ) {  // DB에 등급 정보가 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			log.info("** selectYearSaleList NotFound **");
			return ResponseEntity
					.status(HttpStatus.BAD_GATEWAY) 
					.body("selectYearSaleList NotFound");
		}
    }
	
}
