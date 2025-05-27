import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';


function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 저장 변수
  const [loginInfo, setLoginInfo] = useState(""); // 회원 로그인 정보
  // 1. 로그인 확인
  // => 브라우져의 sessionStorage에서 로그인정보 확인
  if ( !isLoggedIn ) {
    const loginCheck =JSON.parse(sessionStorage.getItem("loginInfo"));
    
    if (loginCheck !== null) {  // token 적용이전 확인
    //if (loginCheck !== null && loginCheck.token !== null) {  //-> token 적용이후 확인
      alert(`** sessionStorage 로그인 확인 cust_nm=${loginCheck.cust_nm}`);
      setIsLoggedIn(true);
      setLoginInfo(loginCheck);
    } 
  } 
  // 2. 로그인 함수
  const onLoginSubmit = (cust_Id, Password) => {

    let url = "/cust/login";
    
    const data = { cust_id: cust_Id, password: Password };

    apiCall(url, 'POST', data, null)
    .then((response) => {
 
        sessionStorage.setItem("loginInfo", JSON.stringify(response));
        sessionStorage.setItem("loginID", response.cust_id);

        alert('로그인 성공');
        setIsLoggedIn(true);
        setLoginInfo(response);
        navigate("/");
    }).catch((err) => {
        setIsLoggedIn(false);
        setLoginInfo('');
        if (err===502) { alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
        }else { alert(`** onLoginSubmit 시스템 오류, err=${err}`); }
        navigate("/login");
    }); //apiCall

  }; //onLoginSubmit

  // 3. 로그아웃
  const onLogout = () => {
    let url = "/auth/logout";   
    alert(`** 로그아웃 token 확인 => ${loginInfo.token}`);
    apiCall(url, 'GET', null, loginInfo.token)
    .then((response) => {
        // => 로그인아웃 성공
        //  -> 브라우져의 sessionStorage에 로그인정보 삭제, 
        //     로그인상태값 과 loginInfo 값 초기화  
        //sessionStorage.removeItem("loginInfo");
        sessionStorage.clear();
        // => 쿠키삭제
        //   로그인관리와 무관하기때문에 큰 의미는 없지만 Test 함 
        //   그러나 아래코드는 String 값이 바람직하지않아 (기호 등등사용 때문인듯)  삭제안됨
        //document.cookie = 'JSESSIONID' + '=; domain=localhost; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/'; //쿠키 만료일을 과거로 설정
      
        //alert('로그아웃 성공');
        setIsLoggedIn(false);
        setLoginInfo('');
    }).catch((err) => {
        if (err===502) { alert("로그 아웃 실패, 다시하세요 ~~");
        }else if (err.response.status===403) {
              alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
        }else { alert(`** onLogout 시스템 오류, err=${err}`); }
    }); //apiCall
    navigate("/");
  }; //onLogout

  return (
    <div className="App">
      <Header userName={loginInfo.username} token={loginInfo.token} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Main token={loginInfo.token}
            onLoginSubmit={onLoginSubmit}
            
      />
      <Footer />
    </div>
  ); //return
}

export default App;
