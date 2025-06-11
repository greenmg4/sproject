package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductDTO {
	//[박민혁]
	private int prod_no, prod_price, prod_cnt;

	private String prod_nm, category, status, publisher, author_nm, book_desc, suggest_yn; 

	private LocalDateTime reg_dtm, upd_dtm;
	
    private String img_path; // 추가: 메인 이미지 경로
	
}
