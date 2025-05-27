package mapperInterface;
	
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.ProductDTO;

@Mapper
public interface ProductMapper {
	
	
    List<ProductDTO> getAllProducts();
	
    int insertProduct(ProductDTO product);
    
    ProductDTO getProductById(int prodNo);
    
    void updateProduct(ProductDTO product);
    
    int deleteProduct(int prodNo);
}
