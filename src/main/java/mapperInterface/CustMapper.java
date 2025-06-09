package mapperInterface;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.CustDTO;

@Mapper
public interface CustMapper {


	@Select("select password from custom where cust_id = #{mdto.cust_id}")
	String login(@Param("mdto")CustDTO cdto);
	
	@Select("select cust_nm from custom where cust_id = #{cust_id}")
	String search_name(@Param("cust_id")String cust_id);
	
	@Update("UPDATE custom SET tot_buy_amt = tot_buy_amt + #{amount}, upd_dtm = NOW() WHERE cust_id = #{cust_id}")
    void updateTotBuyAmt(@Param("cust_id") String cust_id, @Param("amount") int amount);
	
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기
}
