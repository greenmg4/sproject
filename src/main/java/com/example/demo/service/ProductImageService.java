package com.example.demo.service;

import java.util.List;

import com.example.demo.model.ProductImageDTO;

public interface ProductImageService {
	List<ProductImageDTO> getAllProductImgs();
	void insertImage(ProductImageDTO img);
	ProductImageDTO getImageByProdNo(int prodNo);
	void updateImage(ProductImageDTO image);
	int deleteImageProduct(int prodNo);
	int countProductsUsingImage(String img_path);
}
