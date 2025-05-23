package mapperInterface;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.CartDTO;


@Mapper
public interface CartMapper {

	@Insert("INSERT INTO cart (cust_id, prod_no, cnt, reg_dtm) VALUES (#{cust_id}, #{prod_no}, #{cnt}, Now())")
	void addCart(CartDTO cart);


}
