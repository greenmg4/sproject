import { useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import '../styles/Main.css';

function MainDefault() {
    const navigate = useNavigate();
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
    return (
        <div className='body_container'>
            <hr></hr>
            {/* <h3>~~ Main 영역 ~~</h3> */}
            <div id="contents">
                <img alt="MainImage" src="images/homeImages/library01.png" width={800} height={400} /> 
                <span onClick={() => { serverDataRequest("/product/proList") }} 
                                  className="textlink">상품 리스트</span>
            </div>
        </div>
    );  
}

export default MainDefault;
