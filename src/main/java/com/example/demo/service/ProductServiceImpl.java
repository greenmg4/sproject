package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.model.ProductDTO;
import com.example.demo.model.SearchCondDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.ProductMapper;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productMapper.getAllProducts();
    }
    
    @Override
    public int insertProduct(ProductDTO product) {
        productMapper.insertProduct(product);
        return product.getProd_no();
    }
    
    @Override
    public ProductDTO getProductById(int prodNo) {
        return productMapper.getProductById(prodNo);
    }
    
    @Override
    public void updateProduct(ProductDTO product) {
        productMapper.updateProduct(product);
    }
    
    @Override
    public int deleteProduct(int prodNo) {
    	return productMapper.deleteProduct(prodNo);
    }
    
    @Override
    public void updateSuggestFlag(int prodNo, String suggestYn) {
        productMapper.updateSuggestFlag(prodNo, suggestYn);
    }


    
    // 상품 리스트 출력[박민혁]
	@Override
	public List<ProductDTO> ProList(SearchCondDTO searchCond) {
		return productMapper.ProList(searchCond);
	}

	//회원 상품 디테일 출력[박민혁]
	@Override
	public ProductDTO ProDetail(int prod_no) {
		return productMapper.ProDetail(prod_no);
	}

	//추천 상품 리스트 출력
	@Override
	public List<Map<String, Object>> getSuggestProductList() {
		return productMapper.getSuggestProductList();
	}
	
	//최신 상품 리스트 출력
	@Override
	public List<Map<String, Object>> getRecentProductList() {
		return productMapper.getRecentProductList();
	}
	
}