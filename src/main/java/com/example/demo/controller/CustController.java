package com.example.demo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.model.CustDTO;
import com.example.demo.service.CustService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@RequestMapping("/test")
@Log4j2
@RequiredArgsConstructor
public class CustController {
	@Autowired
	private CustService cservice;
	
	/**로그인 기능*/
	@PostMapping("login")
	public String login(CustDTO cdto, Model model, HttpServletRequest request) {
		String cust_pw = cservice.login(cdto);
		String cust_id = (String)cdto.getCust_id();	
		String cust_nm = cservice.search_name(cust_id);
		if(cust_pw == null) {//id가 존재하지 않는경우
			model.addAttribute("msg","아이디가 존재하지않습니다.");
			model.addAttribute("url","/");
			return "api/alert_api";
		}else if(cust_pw.equals(cdto.getPassword())) {//로그인 성공
			HttpSession session = request.getSession();
			model.addAttribute("user_id",cdto.getCust_id());
			model.addAttribute("user_name", cust_nm);
			session.setAttribute("user_id",cdto.getCust_id());
			return "redirect:/index";
		}else {// 비밀번호 틀렸을시
			model.addAttribute("msg","비밀번호가 틀렸습니다.");
			model.addAttribute("url","/");
			return "api/alert_api";
		}
	}
 	
}
