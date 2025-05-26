package com.example.demo.domain;

import lombok.Data;

@Data
public class ProductDTO {
    private int prodNo;
    private String prodNm;
    private int prodPrice;
    private String category;
    private String status;
    private int prodCnt;
    private String publisher;
    private String authorNm;
    private String regDtm;
    private String updDtm;
    private String bookDesc;
}
