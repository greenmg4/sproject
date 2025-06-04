package mapperInterface;
	
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.demo.model.ProductDTO;

@Mapper
public interface ProductMapper {
	
	

	List<ProductDTO> getAllProducts();
	
    int insertProduct(ProductDTO product);
    
    ProductDTO getProductById(int prodNo);
    
    void updateProduct(ProductDTO product);
    
    int deleteProduct(int prodNo);

    
    // 회원 상품 리스트 출력
    @Select("SELECT * FROM product WHERE #{category} = 'A' OR category = #{category}")
	List<ProductDTO> ProList(String category);
	
	
	// 회원 상품 디테일
    @Select("SELECT * FROM product WHERE prod_no = #{prod_no}")
	ProductDTO ProDetail(int prod_no);
}
