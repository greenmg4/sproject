package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.model.AddressDTO;

@Mapper
public interface AddressMapper {
    List<AddressDTO> findByCustId(String custId);
    void insertAddress(AddressDTO dto);
    void deleteAddress(Long seq);
    void resetDefaultAddress(String custId);
    void setDefaultAddress(@Param("cust_Id") String custId, @Param("seq") Long seq);
}

