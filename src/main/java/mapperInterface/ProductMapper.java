package mapperInterface;
	
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.ProductDTO;
import com.example.demo.model.SearchCondDTO;

@Mapper
public interface ProductMapper {
	
	

	List<ProductDTO> getAllProducts();
	
    int insertProduct(ProductDTO product);
    
    ProductDTO getProductById(int prodNo);
    
    void updateProduct(ProductDTO product);
    
    int deleteProduct(int prodNo);

    
    // 상품 리스트 출력[박민혁]
	List<ProductDTO> ProList(SearchCondDTO searchCond);
	
	
	// 회원 상품 디테일[박민혁]
    @Select("SELECT * FROM product WHERE prod_no = #{prod_no}")
	ProductDTO ProDetail(int prod_no);
    
    // 결제시 상품 갯수 삭제[박민혁]
    @Update("UPDATE product SET prod_cnt = prod_cnt - #{cnt} WHERE prod_no = #{prod_no} AND prod_cnt >= #{cnt}")
    void decreaseProdCnt(@Param("prod_no") int prod_no, @Param("cnt") int cnt);
    
    List<Map<String, Object>> getSuggestProductList(); // 추천상품리스트 조회.
}