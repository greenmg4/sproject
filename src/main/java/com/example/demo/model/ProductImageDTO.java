package com.example.demo.model;

import lombok.Data;

@Data
public class ProductImageDTO {
	private int seq;
	private int prod_no;
	private String img_class;
	private String img_path;
	private int order_seq;
}
