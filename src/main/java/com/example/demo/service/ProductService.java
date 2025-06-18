package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.model.ProductDTO;
import com.example.demo.model.SearchCondDTO;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    int insertProduct(ProductDTO product);
    ProductDTO getProductById(int prodNo);
    void updateProduct(ProductDTO product);
    int deleteProduct(int prodNo);
	
    List<Map<String,Object>> getSuggestProductList(); // 추천상품조회
    List<Map<String,Object>> getRecentProductList(); // 최신상품조회
    
    void updateSuggestFlag(int prodNo, String suggestYn);
    
    // 회원 상품 리스트 출력[박민혁]
    List<ProductDTO> ProList(SearchCondDTO searchCond);
	
    // 회원 상품 디테일 출력[박민혁]
    ProductDTO ProDetail(int prod_no);
}