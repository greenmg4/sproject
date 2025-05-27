package com.example.demo.model;

import lombok.Data;

@Data
public class ProductImageDTO {
	private int seq;
	private int prodno;
	private String imgclass;
	private String imgpath;
	private int orderseq;
}
