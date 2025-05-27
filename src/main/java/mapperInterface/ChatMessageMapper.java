package mapperInterface;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;

@Mapper
public interface ChatMessageMapper {
    int selectMaxSeq(@Param("qna_no") int qna_no);
    void insertMessage(ChatMessageDTO content);
    List<ChatMessageDTO> getMessagesByRoomId(int qna_no);
    List<ChatMessageDTO> getRoomSummaries();
    CustDTO getUserInfo(String cust_Id);
}