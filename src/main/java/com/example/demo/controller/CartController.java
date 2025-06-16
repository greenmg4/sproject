package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CartDTO;
import com.example.demo.service.CartService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
	
	@Autowired
	private CartService cservice;
	
	// 장바구니 저장[박민혁]
	@PostMapping("/addCart")
	public ResponseEntity<String> addCart(@RequestBody CartDTO cart, HttpSession session) {
	    String cust_id = (String) session.getAttribute("loginID");
	    if (cust_id == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용해주세요.");
	    }
	    try {
	        cart.setCust_id(cust_id);
	        cart.setReg_dtm(LocalDateTime.now());
	        cservice.addCart(cart);  // 장바구니 저장 서비스 호출
	        return ResponseEntity.ok("장바구니에 추가되었습니다.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("장바구니 추가에 실패했습니다.");
	    }
	}
	
	// 장바구니 호출 [박민혁]
	@PostMapping("/CartDetail")
	public ResponseEntity<List<CartDTO>> CartDetail(@RequestBody Map<String, String> request) {
	    String cust_id = request.get("cust_id");
	    List<CartDTO> CartDetail = cservice.CartDetail(cust_id);
	    return ResponseEntity.ok(CartDetail);
	}

	//장바구니 상품 수량 변경 [박민혁]
    @PostMapping("/updateCnt")
    public ResponseEntity<String> updateCnt(@RequestBody CartDTO cart) {
        try {
            cservice.updateCnt(cart.getCust_id(), cart.getProd_no(), cart.getCnt());
            return ResponseEntity.ok("수량이 변경되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("수량 변경에 실패했습니다.");
        }
    }

	// 장바구니 선택 상품 삭제
    @PostMapping("/deletePro")
    public ResponseEntity<String> deletePro(@RequestBody Map<String, Object> request) {
        try {
            String cust_id = (String) request.get("cust_id");
            @SuppressWarnings("unchecked")
            List<Integer> prod_no = (List<Integer>) request.get("prod_no");
            cservice.deletePro(cust_id, prod_no);
            return ResponseEntity.ok("선택된 상품이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("선택 상품 삭제에 실패했습니다.");
        }
    }
	
}
