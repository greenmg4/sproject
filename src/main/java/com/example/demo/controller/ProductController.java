package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ProductDTO;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/product")
//@RequiredArgsConstructor
public class ProductController {

    @Autowired
    private ProductService pservice;
    
    @GetMapping("/proList")
    public List<ProductDTO> proList(){
    	return pservice.proList();
    	
    }
    
    @GetMapping("/proDetail")
    public ProductDTO ProDetail(int prod_no) {
        return pservice.ProDetail(prod_no);
    }

    
}
