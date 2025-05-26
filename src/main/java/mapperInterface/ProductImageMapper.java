package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.ProductDTO;
import com.example.demo.domain.ProductImageDTO;

@Mapper
public interface ProductImageMapper {
	List<ProductImageDTO> getAllProductImgs();
	void insertImage(ProductImageDTO img);
	ProductImageDTO getImageByProdNo(int prodNo);
	void updateImage(ProductImageDTO image);
}
