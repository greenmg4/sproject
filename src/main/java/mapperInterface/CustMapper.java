package mapperInterface;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.CustDTO;

@Mapper
public interface CustMapper {

	//로그인
	@Select("select password from custom where cust_id = #{mdto.cust_id}")
	String login(@Param("mdto")CustDTO cdto);
	
	// 로그인된 아이디 이름 찾기
	@Select("select cust_nm from custom where cust_id = #{cust_id}")
	String search_name(@Param("cust_id")String cust_id);
	
	// 총 구매 금액 업데이트
	@Update("UPDATE custom SET tot_buy_amt = tot_buy_amt + #{amount}, upd_dtm = NOW() WHERE cust_id = #{cust_id}")
    void updateTotBuyAmt(@Param("cust_id") String cust_id, @Param("amount") int amount);
	
	// 등급 업데이트
	@Update("UPDATE custom SET grade = #{grade} WHERE cust_id = #{cust_id}")
	void updateGrade(@Param("cust_id") String cust_id, @Param("grade") String grade);
	
	// 누적 금액 기준 등급 조회
	@Select("SELECT grade FROM grade_disc WHERE std_amt <= #{totBuyAmt} ORDER BY std_amt DESC LIMIT 1")
	String findGradeTotBuyAmt(@Param("totBuyAmt") int totBuyAmt);
	
	// 누적 총 구매 금액 조회
    @Select("SELECT tot_buy_amt FROM custom WHERE cust_id = #{cust_id}")
	int getTotBuyAmt(String cust_id);
	
	
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기

	
	
}
