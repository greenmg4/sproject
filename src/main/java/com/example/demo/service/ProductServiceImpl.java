package com.example.demo.service;

import java.util.List;

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

    
    // 상품 리스트 출력
	@Override
	public List<ProductDTO> ProList(SearchCondDTO searchCond) {
		return productMapper.ProList(searchCond);
	}

	//회원 상품 디테일 출력
	@Override
	public ProductDTO ProDetail(int prod_no) {
		return productMapper.ProDetail(prod_no);
	}

}