package mapperInterface;


import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

import com.example.demo.model.OrderDetailDTO;
import com.example.demo.model.OrderMstDTO;


@Mapper
public interface OrderMstMapper {

	//주문 저장[박민혁]
	@Insert("INSERT INTO order_mst"
	        +" (cust_id, pay_method, ord_dtm, tot_amount, prod_cnt, rcv_nm, rcv_phone, address1, address2, zip, reg_dtm, upd_dtm)"
	        +" VALUES"
	        +" (#{cust_id}, #{pay_method}, #{ord_dtm}, #{tot_amount}, #{prod_cnt}, #{rcv_nm}, #{rcv_phone}, #{address1}, #{address2}, #{zip}, #{reg_dtm}, #{upd_dtm})")
	    @Options(useGeneratedKeys = true, keyProperty = "ord_no", keyColumn = "ord_no")
	int insertOrderMst(OrderMstDTO orderMst);

	// 주문 디테일 저장 [박민혁]
	@Insert({"<script> INSERT INTO order_detail (ord_no, prod_no, buy_price, cnt) VALUES "
	       	+" <foreach collection='list' item='item' separator=','>"
	        +" (#{item.ord_no}, #{item.prod_no}, #{item.buy_price}, #{item.cnt})"
	       	+"</foreach> </script>"})
	void insertOrderDetails(List<OrderDetailDTO> details);

	


}
