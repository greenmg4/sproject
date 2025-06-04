import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const goToEditPage = () => {
    navigate("/useredit");
  };
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
   const userId = sessionStorage.getItem('loginID');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 백엔드에 POST 요청
    axios.post('/api/user/info', { cust_id: userId }, {
  headers: { 'Content-Type': 'application/json' }
})
    .then(res => {
      setUserInfo(res.data);
    })
    .catch(err => {
      console.error('유저 정보를 가져오는 데 실패했습니다.', err);
    });
  }, []);

  if (!userInfo) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>내 정보</h2>
      <ul>
        <strong>아이디:</strong> {userInfo.cust_id} <br></br>
        <strong>이름:</strong> {userInfo.cust_nm}<br></br>
        <strong>이메일:</strong> {userInfo.email}<br></br>
        <strong>전화번호:</strong> {userInfo.phone}<br></br>
        <strong>주소1:</strong> {userInfo.address1}<br></br>
       <strong>주소2:</strong> {userInfo.address2}<br></br>
        <strong>우편번호:</strong> {userInfo.zip}<br></br>
        <strong>성별:</strong> {userInfo.gender}<br></br>
        <strong>생일:</strong> {userInfo.birthday}<br></br>
        <strong>등급:</strong> {userInfo.grade}<br></br>
        <strong>총 구매 금액:</strong> {userInfo.tot_buy_amt}원
      </ul>

        <button onClick={goToEditPage} style={{ marginTop: '20px' }}>내 정보 수정</button>
    </div>
  );
};

export default UserInfoPage;
