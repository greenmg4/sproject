package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.ProductDTO;
import com.example.demo.model.ProductImageDTO;
import com.example.demo.model.SearchCondDTO;
import com.example.demo.service.ProductImageService;
import com.example.demo.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;
    
    //상품 리스트 출력[박민혁]
    @PostMapping("/proList")
    public ResponseEntity<List<ProductDTO>> proList(@RequestBody SearchCondDTO searchCond) {
        List<ProductDTO> product = productService.ProList(searchCond);
        return ResponseEntity.ok(product);
    }
    
    //회원 상품 디테일 출력[박민혁]
    @GetMapping("/{prod_no}")
    public ProductDTO ProDetail(@PathVariable int prod_no) {
        return productService.ProDetail(prod_no);
    }

    

    @GetMapping("/page")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/productimage")
    public List<ProductImageDTO> getAllProductImgs() {
    	return productImageService.getAllProductImgs();
    }
    
    @PostMapping("/upload")
    public ResponseEntity<String> registerProduct(
        @RequestParam("product") String productJson,
        @RequestParam("image") MultipartFile image,
        @RequestParam("imgClass") String imgClass
    ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ProductDTO product = mapper.readValue(productJson, ProductDTO.class);

        int prodNo = productService.insertProduct(product);

        String fileName = image.getOriginalFilename();

        //  저장 경로 구성
        String uploadDir = System.getProperty("user.dir") + "/front/react/public/images/uploadimages/";
        System.out.println("실제 업로드 경로: " + uploadDir);
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();  //  경로가 없으면 생성
        }

        //  파일 저장
        String savePath = uploadDir + fileName;
        image.transferTo(new File(savePath));

        ProductImageDTO img = new ProductImageDTO();
        img.setProd_no(prodNo);
        img.setImg_path("images/uploadimages/" + fileName); //  DB에는 상대 경로만 저장
        img.setImg_class(imgClass);

        productImageService.insertImage(img);
        return ResponseEntity.ok("등록 완료");
    }

    
    @GetMapping("/detail")
    public ProductDTO getProductById(@RequestParam("prodNo") int prodNo) {
        return productService.getProductById(prodNo);
    }
    
    @GetMapping("/productimage/one")
    public ProductImageDTO getImageByProdNo(@RequestParam("prodNo") int prodNo) {
        return productImageService.getImageByProdNo(prodNo);
    }
    
    @PostMapping("/productimage/update")
    public ResponseEntity<String> updateProductImage(
        @RequestParam("prodNo") int prodNo,
        @RequestParam("image") MultipartFile image,
        @RequestParam("imgClass") String imgClass
    ) throws IOException {
        String fileName = image.getOriginalFilename();

        String uploadDir = System.getProperty("user.dir") + "/front/react/public/images/uploadimages/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String savePath = uploadDir + fileName;
        image.transferTo(new File(savePath));

        ProductImageDTO img = new ProductImageDTO();
        img.setProd_no(prodNo);
        img.setImg_path("images/uploadimages/" + fileName);
        img.setImg_class(imgClass);

        productImageService.updateImage(img);
        return ResponseEntity.ok("이미지 수정 완료");
    }

    
    @PutMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestBody ProductDTO product) {
        productService.updateProduct(product);
        return ResponseEntity.ok("상품 수정 완료");
    }
    
    
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProduct(@RequestParam int prodNo) {
        try {
            ProductImageDTO image = productImageService.getImageByProdNo(prodNo);
            String relativePath = image != null ? image.getImg_path() : null;
            String fullPath = relativePath != null
                    ? System.getProperty("user.dir") + "/front/react/public/" + relativePath
                    : null;

            // DB 삭제 먼저
            int deletedProduct = productService.deleteProduct(prodNo);
            int deletedImage = productImageService.deleteImageProduct(prodNo);

            if (deletedProduct > 0 && deletedImage > 0) {
                if (relativePath != null) {
                    int refCount = productImageService.countProductsUsingImage(relativePath);
                    if (refCount == 0 && fullPath != null) {
                        File file = new File(fullPath);
                        if (file.exists()) {
                            if (file.delete()) {
                                System.out.println("이미지 파일 삭제 성공: " + fullPath);
                            } else {
                                System.err.println("이미지 파일 삭제 실패: " + fullPath);
                            }
                        } else {
                            System.out.println("파일이 존재하지 않음: " + fullPath);
                        }
                    }
                }

                return ResponseEntity.ok("상품 삭제 완료");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("DB 삭제 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예외 발생: " + e.getMessage());
        }
    }
    

    // 추천상품(suggest_yn = 'Y') 조회
    @GetMapping("/getSuggestProductList")
    public ResponseEntity<?> getSuggestProductList() {
    	
 		List<Map<String,Object>> list = productService.getSuggestProductList();
    	if ( list !=null && list.size() >= 0 ) {  // 추천상품이 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			return ResponseEntity
				  .status(HttpStatus.BAD_GATEWAY) 
				  .body("getSuggestProductList Error");
		}
    }
    
    // 최신상품 조회
    @GetMapping("/getRecentProductList")
    public ResponseEntity<?> getRecentProductList() {
    	
 		List<Map<String,Object>> list = productService.getRecentProductList();
    	if ( list !=null && list.size() >= 0 ) {  // 추천상품이 없을 수도 있으므로 0도 포함.	
			return ResponseEntity.ok().body(list);
		} else {
			return ResponseEntity
				  .status(HttpStatus.BAD_GATEWAY) 
				  .body("getRecentProductList Error");
		}
    }
    
    
    // 추천(Y/N) 토글
    @PutMapping("/toggleSuggest")
    public ResponseEntity<String> toggleSuggest(@RequestBody Map<String, String> body) {
        int    prodNo    = Integer.parseInt(body.get("prodNo"));
        String suggestYn = body.get("suggestYn");         // "Y" 또는 "N"
        productService.updateSuggestFlag(prodNo, suggestYn);
        return ResponseEntity.ok("추천 여부 변경 완료");
    }
    
    
    @PostMapping("/searchDetail")
    public ResponseEntity<List<ProductDTO>> searchProductDetail(
            @RequestBody SearchCondDTO cond){
        return ResponseEntity.ok(productService.searchProductDetail(cond));
    }

    
    
}//class