package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.StatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

//@Controller
//@RequestMapping("/statistics")
//@Log4j2
//@RequiredArgsConstructor
@RestController
@RequestMapping("/api/statistics")
@Log4j2
@RequiredArgsConstructor
public class StatisticsController {
	
	private final StatisticsService service;
	
//	@GetMapping("/yearsaleslist")
// 	public ResponseEntity<?> yearsaleslist(@RequestParam Map<String, Object> requestData) {
 	@PostMapping(value="/yearsaleslist", consumes=MediaType.APPLICATION_JSON_VALUE)
 	public ResponseEntity<?> yearsaleslist(@RequestBody Map<String, Object> requestData) {

 		String year =String.valueOf(requestData.get("year").toString());
 		List<Map<String,Object>> list = service.selectYearSaleList(year);
 		//if ( list !=null && list.size() > 0 ) {
    	if ( list !=null && list.size() >= 0 ) {  // 매출이 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			log.info("** selectYearSaleList NotFound **");
			return ResponseEntity
					.status(HttpStatus.BAD_GATEWAY) 
					.body("selectYearSaleList NotFound");
		}
 	} //yearsaleslist
 	
 	@PostMapping(value="/monthsaleslist", consumes=MediaType.APPLICATION_JSON_VALUE)
 	public ResponseEntity<?> monthsaleslist(@RequestBody Map<String, Object> requestData) {

 		String month =String.valueOf(requestData.get("month").toString());
 		List<Map<String,Object>> list = service.selectMonthSaleList(month);
 		//if ( list !=null && list.size() > 0 ) {
    	if ( list !=null && list.size() >= 0 ) {  // 매출이 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			log.info("** selectMonthSaleList NotFound **");
			return ResponseEntity
					.status(HttpStatus.BAD_GATEWAY) 
					.body("selectMonthSaleList NotFound");
		}
 	} //monthsaleslist
 	
 	
 	@PostMapping(value="/salesbyproductlist", consumes=MediaType.APPLICATION_JSON_VALUE)
 	public ResponseEntity<?> salesbyproductlist(@RequestBody Map<String, Object> requestData) {

 		String searchDate =String.valueOf(requestData.get("searchDate").toString());
 		int limit = Integer.parseInt(String.valueOf(requestData.get("limit")));
 		int offset = Integer.parseInt(String.valueOf(requestData.get("offset")));
 		List<Map<String,Object>> list = service.selectSalesByProductList(searchDate, limit, offset);
 		//if ( list !=null && list.size() > 0 ) {
    	if ( list !=null && list.size() >= 0 ) {  // 매출이 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			log.info("** selectMonthSaleList NotFound **");
			return ResponseEntity
					.status(HttpStatus.BAD_GATEWAY) 
					.body("selectMonthSaleList NotFound");
		}
 	} //monthsaleslist
}
