package mapperInterface;

import com.example.demo.model.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeMapper {
    List<NoticeDTO> selectAll();
    NoticeDTO selectActive();
    int insert(NoticeDTO dto);
    int updateYn(@Param("notice_no") int notice_no,
                 @Param("noti_yn") String noti_yn);
    int delete(int notice_no);
}