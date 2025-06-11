package mapperInterface;
	
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.demo.model.ProductDTO;
import com.example.demo.model.SearchCondDTO;

@Mapper
public interface ProductMapper {
	
	

	List<ProductDTO> getAllProducts();
	
    int insertProduct(ProductDTO product);
    
    ProductDTO getProductById(int prodNo);
    
    void updateProduct(ProductDTO product);
    
    int deleteProduct(int prodNo);

    
    // 상품 리스트 출력
	List<ProductDTO> ProList(SearchCondDTO searchCond);
	
	
	// 회원 상품 디테일
    @Select("SELECT * FROM product WHERE prod_no = #{prod_no}")
	ProductDTO ProDetail(int prod_no);

}