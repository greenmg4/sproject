package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;

@Mapper
public interface ChatMessageMapper {
    int selectMaxSeq(@Param("qnaNo") Long roomId);
    void insertMessage(ChatMessageDTO message);
    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);
    List<ChatMessageDTO> getRoomSummaries();
    CustDTO getUserInfo(String custId);
}