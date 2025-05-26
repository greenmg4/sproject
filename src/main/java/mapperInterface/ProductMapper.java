package mapperInterface;

import java.util.List;
import com.example.demo.domain.ProductDTO;
import com.example.demo.domain.ProductImageDTO;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper {
    List<ProductDTO> getAllProducts();
    void insertProduct(ProductDTO product);
    ProductDTO getProductById(int prodNo);
    void updateProduct(ProductDTO product);
    int deleteProduct(int prodNo);
}
