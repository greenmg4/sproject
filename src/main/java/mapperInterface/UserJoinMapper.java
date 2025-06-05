package mapperInterface;

import com.example.demo.model.UserJoinDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserJoinMapper {
    int insertUser(UserJoinDTO user);
    int countByCustId(String cust_id);  // 아이디 중복확인용 (선택)
}