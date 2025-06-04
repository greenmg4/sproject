package mapperInterface;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.UserInfoDTO;

@Mapper
public interface UserInfoMapper {
    UserInfoDTO getUserInfoById(String cust_id);
}