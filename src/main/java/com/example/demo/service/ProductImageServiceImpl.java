package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.ProductImageDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.ProductImageMapper;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService{
	
	private final ProductImageMapper productImageMapper;
	
    @Override
    public List<ProductImageDTO> getAllProductImgs() {
        return productImageMapper.getAllProductImgs();
    }
    
    @Override
    public void insertImage(ProductImageDTO img) {
        productImageMapper.insertImage(img);
    }
    
    @Override
    public ProductImageDTO getImageByProdNo(int prodNo) {
        return productImageMapper.getImageByProdNo(prodNo);
    }
    
    @Override
    public void updateImage(ProductImageDTO image) {
        productImageMapper.updateImage(image);
    }
    
    @Override
    public int deleteImageProduct(int prodNo) {
    	return productImageMapper.deleteImageProduct(prodNo);
    }
    
    @Override
    public int countProductsUsingImage(String img_path) {
        return productImageMapper.countByImagePath(img_path);
    }

}
