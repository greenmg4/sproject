import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';

//function Header({ userName, token, isLoggedIn, onLogout }) {
function Header() {
    // ** 우측메뉴 처리에 대해 수정사항
    // => 현재는 Link 로 넘기고 각 Page 에서 fetchData 를 처리하지만,
    //    화면 흐름상 메뉴 클릭시 fetchData 결과에 따라 화면이동 하는것이 좋을듯

    // ** 서버 컨트롤러 연결 확인 하기 
    const serverTest = () => {
        let url='/test/check-server';
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** 서버 API 연결 성공 => ${response.checkData}, ${response.checkLogin}`);
            // apiCall 에서는 response.data 값을 return 함.
        }).catch((err) => {
            alert(`** 서버 API 연결 실패 => ${err}`);
        });
    } //serverTest
    // 🐬📯 🐋 🐳 🎶
    const navigate = useNavigate();
    // ** Server 요청 함수
    const serverDataRequest = (url) => {
        // token 적용 이전
        //apiCall(url, 'GET', null, null)

        // token 적용 이후
        //alert(`** serverDataRequest 요청전 token 확인 =${token}`);
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** serverDataRequest 성공 url=${url}`);
            sessionStorage.setItem("serverData", JSON.stringify(response));
            navigate(url);
        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    } //serverDataRequest

    //채팅상담 이동 함수
    const goToChat = () => {
        navigate("/chat/rooms");
    };

    const goToProductPage = () => {
        navigate("product")
    }

    const goToPL = () => {
        navigate("productupload")
    }

    return (
        <div className="headerTop">
            <h2 style={{ color:'#444444'}}>  도서 판매 </h2>
            <div className="headerLeft">
                <span onClick={serverTest} className="textlink">Server</span>&nbsp;&nbsp;
                <Link to="/">Home</Link>&nbsp;&nbsp;
                <span onClick={() => { serverDataRequest("/test/memberlist") }} 
                                  className="textlink">DbTestList</span>&nbsp;&nbsp;
                <span onClick={goToChat} className="textlink">채팅상담</span>&nbsp;&nbsp;
                <span onClick={goToProductPage} className="textlink">상품목록</span>&nbsp;&nbsp;
                <span onClick={goToPL} className="textlink">상품업로드</span>&nbsp;&nbsp;
            </div>
        </div> //headerTop
    ); //return
} //Header

export default Header;
