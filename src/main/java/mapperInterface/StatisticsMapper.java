package mapperInterface;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StatisticsMapper {
	//** selectList
	List<Map<String, Object>> selectYearSaleList(String year);

	List<Map<String, Object>> selectMonthSaleList(String month);
	
	List<Map<String, Object>> selectSalesByProductList(String searchDate, int limit, int offset);
	
}
