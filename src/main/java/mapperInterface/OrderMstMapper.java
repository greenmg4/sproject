package mapperInterface;


import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;


@Mapper
public interface OrderMstMapper {

	@Insert("INSERT INTO order_mst (cust_id, pay_method, ord_dtm, tot_amount, prod_cnt, "
			+ " rcv_nm, rcv_phone, address1, address2, zip)"
			+ " VALUES (#{cust_id}, #{pay_method}, #{ord_dtm}, #{tot_amount}, #{prod_cnt},"
			+ " #{rcv_nm}, #{rcv_phone}, #{address1}, #{address2}, #{zip})")
	@Options(useGeneratedKeys = true, keyProperty = "ord_no")
	int insertOrderMst(OrderMstDTO orderMst);
	
	@Insert("INSERT INTO order_detail VALUES (#{ord_no}, #{prod_no}, #{buy_price}, #{cnt})")
	int insertOrderDetail(OrderDetailDTO detail);

	


}
