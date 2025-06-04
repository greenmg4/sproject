package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductDTO {
	private int prod_no, prod_price;
	private String prod_nm, category, status, publisher, author_nm, prod_cnt, book_desc, suggest_yn; 
	private LocalDateTime reg_dtm, upd_dtm;
	
	
	
}
