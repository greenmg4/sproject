package mapperInterface;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.demo.model.CustDTO;

@Mapper
public interface CustMapper {


	@Select("select password from custom where cust_id = #{mdto.cust_id}")
	String login(@Param("mdto")CustDTO cdto);
	
	@Select("select cust_nm from custom where cust_id = #{cust_id}")
	String search_name(@Param("cust_id")String cust_id);
	
	String selectGradeByCustId(String cust_id); //cust_id로 등급 찾기
}
