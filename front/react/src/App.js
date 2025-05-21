import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const navigate = useNavigate();

  //const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 저장 변수
  //const [loginInfo, setLoginInfo] = useState(""); // 회원 로그인 정보

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
