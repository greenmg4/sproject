package com.example.demo.service;

import java.util.List;
import com.example.demo.domain.ProductDTO;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    int insertProduct(ProductDTO product);
    ProductDTO getProductById(int prodNo);
    void updateProduct(ProductDTO product);
}
