package mapperInterface;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.example.demo.model.ChatMessageDTO;

@Mapper
public interface ChatMessageMapper {
    int selectMaxSeq(@Param("qna_no") int qna_no);
    void insertMessage(ChatMessageDTO dto);
    List<ChatMessageDTO> getMessagesByRoomId(int qna_no);
    List<ChatMessageDTO> getRoomSummaries(@Param("excludeType") int excludeType);
    int selectNextQnaNo();
    void updateRoomType(@Param("qna_no") int qna_no, @Param("qna_type") int qna_type);
    List<ChatMessageDTO> getUserChatList(String session_id);
}
