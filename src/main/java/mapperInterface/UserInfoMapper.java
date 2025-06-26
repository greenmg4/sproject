package mapperInterface;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.model.UserInfoDTO;


@Mapper
public interface UserInfoMapper {
    UserInfoDTO getUserInfoById(String cust_id);
    
    int updateUserInfo(UserInfoDTO dto); // 수정용
    
    void updateUserAddress(@Param("cust_id") String cust_id,
            @Param("address1") String address1,
            @Param("address2") String address2,
            @Param("zip") String zip);
    
    void updateProfileImg(String custId, String imgUrl);

}