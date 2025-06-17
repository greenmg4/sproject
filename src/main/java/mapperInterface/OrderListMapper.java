package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.CustDTO;
import com.example.demo.model.OrderListDTO;

@Mapper
public interface OrderListMapper {

	//결제 내역 출력[박민혁]
	@Select("SELECT o.ord_no, o.ord_st, CONCAT(MIN(p.prod_nm), ' 등 ', COUNT(*), '개') AS product_summary,"
			+" o.tot_amount, o.ord_dtm, c.cust_nm, o.rcv_nm FROM order_mst o"
		    +" JOIN order_detail od ON o.ord_no = od.ord_no"
			+" JOIN product p ON od.prod_no = p.prod_no "
			+" JOIN custom c ON o.cust_id = c.cust_id"
			+" WHERE o.cust_id = #{cust_id}"
			+" GROUP BY o.ord_no, o.ord_st, o.tot_amount, o.ord_dtm, c.cust_nm, o.rcv_nm"
			+" ORDER BY o.ord_dtm DESC")
	List<OrderListDTO> OrderList(String cust_id);
	
}
