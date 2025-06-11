package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.demo.model.AddressDTO;

@Mapper
public interface AddressMapper {
    List<AddressDTO> findByCustId(String cust_id);
    void insertAddress(AddressDTO dto);
    void deleteAddress(Long seq);
    void resetDefaultAddress(String cust_id);
    void setDefaultAddress(@Param("cust_id") String custId, @Param("seq") Long seq);
    void updateAddress(AddressDTO dto);
    
    // 기본 주소 호출[박민혁]
    @Select("SELECT zip, address1, address2 FROM delivery_addr WHERE"
    		+ " cust_id = #{custId} AND default_yn = 'Y' LIMIT 1")
    AddressDTO DefaultAddress(String custId);
    
    
}

