package mapperInterface;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.demo.model.CustDTO;

@Mapper
public interface CustMapper {

	//로그인[박민혁]
	@Select("select password from custom where cust_id = #{mdto.cust_id}")
	String login(@Param("mdto")CustDTO cdto);
	
	// 로그인된 아이디 이름 찾기[박민혁]
	@Select("select cust_nm from custom where cust_id = #{cust_id}")
	String search_name(@Param("cust_id")String cust_id);
	
	// 총 구매 금액 업데이트[박민혁]
	@Update("UPDATE custom SET tot_buy_amt = tot_buy_amt + #{amount}, upd_dtm = NOW() WHERE cust_id = #{cust_id}")
    void updateTotBuyAmt(@Param("cust_id") String cust_id, @Param("amount") int amount);
	
	// 등급 업데이트[박민혁]
	@Update("UPDATE custom SET grade = #{grade} WHERE cust_id = #{cust_id}")
	void updateGrade(@Param("cust_id") String cust_id, @Param("grade") String grade);
	
	// 누적 금액 기준 등급 조회[박민혁]
	@Select("SELECT grade FROM grade_disc WHERE std_amt <= #{totBuyAmt} ORDER BY std_amt DESC LIMIT 1")
	String GradeTotBuyAmt(@Param("totBuyAmt") int totBuyAmt);
	
	// 누적 총 구매 금액 조회[박민혁]
    @Select("SELECT tot_buy_amt FROM custom WHERE cust_id = #{cust_id}")
	int TotBuyAmt(String cust_id);
	
    // 할인율 조회[박민혁]
    @Select("SELECT disc_rate FROM grade_disc WHERE grade = #{grade}")
    double DiscRate(@Param("grade") String grade);

    // 할인 최대 금액 조회[박민혁]
    @Select("SELECT disc_max_amt FROM grade_disc WHERE grade = #{grade}")
    int DiscMaxAmt(@Param("grade") String grade);

    //회원탈퇴
    @Update("UPDATE custom SET status = 2 WHERE cust_id = #{cust_id}")
    int withdrawUserStatus(String cust_id);
    
    
    //비밀번호 수정 및 확인 
    
    // 1) 현재 비밀번호 확인
    @Select("SELECT password FROM custom WHERE cust_id = #{cust_id}")
    String getEncryptedPassword(@Param("cust_id") String cust_id);
    
    String getPasswordById(String cust_id);

    // 2) 새 비밀번호 암호화 후 저장
    @Update("UPDATE custom SET password = #{newEncPwd}, upd_dtm = NOW() WHERE cust_id = #{cust_id}")
    void updatePassword(@Param("cust_id") String cust_id, @Param("newEncPwd") String newEncPwd);

    CustDTO findById(String id);
    
    java.util.List<CustDTO> findAllWithoutPassword();
    void updateStatusSimple(@Param("cust_id") String cust_id, @Param("status")  int status);
    int selectStatusByCustId(@Param("cust_id") String cust_id);
    void updateGradeSimple(@Param("cust_id") String cust_id, @Param("grade")   String grade);
    java.util.List<CustDTO> searchMember(@Param("type") String type, @Param("keyword") String keyword);
    
        
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기

	

	
	
}
