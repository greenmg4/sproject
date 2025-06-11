package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.model.AddressDTO;

@Mapper
public interface AddressMapper {
    List<AddressDTO> findByCustId(String cust_id);
    void insertAddress(AddressDTO dto);
    void deleteAddress(Long seq);
    void resetDefaultAddress(String cust_id);
    void setDefaultAddress(@Param("cust_id") String custId, @Param("seq") Long seq);
    void updateAddress(AddressDTO dto);
}

