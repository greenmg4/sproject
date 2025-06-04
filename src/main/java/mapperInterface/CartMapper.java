package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.CartDTO;


@Mapper
public interface CartMapper {

	@Insert("INSERT INTO cart (cust_id, prod_no, cnt, reg_dtm, upd_dtm)"
			+ "  VALUES (#{cust_id}, #{prod_no}, #{cnt}, NOW(), NOW())"
			+ "  ON DUPLICATE KEY UPDATE cnt = cnt + VALUES(cnt),"
			+ "    upd_dtm = NOW()")
	void addCart(CartDTO cart);

	
	
	@Select("SELECT p.prod_no AS prod_no, p.prod_nm AS prod_nm, p.prod_price AS prod_price,"
			+ "    c.cnt AS cnt, pi.img_path AS img_Path FROM cart c"
			+ "    JOIN product p ON c.prod_no = p.prod_no"
			+ "    LEFT JOIN product_img pi ON p.prod_no = pi.prod_no AND pi.img_class = '01'"
			+ "    WHERE c.cust_id = #{custId}")
	List<CartDTO> CartDetail(String cust_id);


	@Delete("DELETE FROM cart WHERE cust_id = #{cust_id}")
	void ClearCart(String cust_id);


	@Update("UPDATE cart SET cnt = #{cnt} WHERE cust_id = #{cust_id} AND prod_no = #{prod_no}")
	int updateCnt(@Param("cust_id") String cust_id,@Param("prod_no") String prod_no,@Param("cnt") int cnt);

	
	int deletePro(@Param("cust_id") String cust_id, @Param("prod_no") List<Integer> prod_no);

	

}
