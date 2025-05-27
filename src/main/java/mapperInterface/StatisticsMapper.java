package mapperInterface;

import java.util.List;
import java.util.Map;

public interface StatisticsMapper {
	//** selectList
	List<Map<String, Object>> selectYearSaleList(String year);
	List<Map<String, Object>> selectMonthSaleList(String month);
}
