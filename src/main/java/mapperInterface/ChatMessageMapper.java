package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.domain.ChatMessageDTO;
import com.example.demo.domain.CustomDTO;

@Mapper
public interface ChatMessageMapper {
    int selectMaxSeq(@Param("qnaNo") Long roomId);
    void insertMessage(ChatMessageDTO message);
    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);
    List<ChatMessageDTO> getRoomSummaries();
    CustomDTO getUserInfo(String custId);
}