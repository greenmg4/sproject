import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';
import axios from "axios";

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 저장 변수
  const [loginInfo, setLoginInfo] = useState(""); // 회원 로그인 정보
  // 1. 로그인 확인
  // => 브라우져의 sessionStorage에서 로그인정보 확인
 
useEffect(() => {
  const loginCheck = JSON.parse(sessionStorage.getItem("loginInfo"));
  if (loginCheck !== null) {
    setIsLoggedIn(true);
    setLoginInfo(loginCheck);
  }
}, []);

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
        window.location.reload();
    }).catch((err) => {
  setIsLoggedIn(false);
  setLoginInfo('');
  console.log("에러 전체:", err);
        if (err?.status === 502) {
    alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
  } else if (err?.response?.status === 403) {
    alert(`** Server Reject : 접근권한이 없습니다. => ${err.message}`);
  } else {
    alert(`** onLoginSubmit 시스템 오류, err=${err.message || err}`);
  }
  navigate("/login");
});
 //apiCall

  }; //onLoginSubmit

  // 3. 로그아웃
  const onLogout = () => {
    axios.get("http://localhost:8080/cust/logout", { withCredentials: true })
      .then(() => {
          // 상태 초기화
          sessionStorage.clear(); // 혹시 저장한 사용자 정보 있다면 클리어
          alert("로그아웃되었습니다.");
          setIsLoggedIn(false);
          navigate("/");
      })
      .catch(err => {
          console.error("로그아웃 오류:", err);
      });
  };

  return (
    <div className="App">
      <Header cust_nm={loginInfo.cust_nm} token={loginInfo.token} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Main token={loginInfo.token}
            onLoginSubmit={onLoginSubmit}
            
      />
      <Footer />
    </div>
  ); //return
}

export default App;
