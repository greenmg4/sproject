package mapperInterface;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberShipMapper {
	List<Map<String, Object>> selectGradeList();
}
