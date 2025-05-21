package mapperInterface;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

public interface TestMapper {

	//** selectList
	List<Map<String, Object>> selectList();
	
}
