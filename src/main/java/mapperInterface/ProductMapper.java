package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.demo.model.ProductDTO;

@Mapper
public interface ProductMapper {

	@Select("select * from product")
	List<ProductDTO> proList();

	@Select("select * from product where prod_no = ?")
	ProductDTO ProDetail(@Param("prod_no")int prod_no);




	
}
