import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserInfoPage = ({ loginInfo, isLoggedIn }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  

  // "내정보 수정" 페이지로 이동
  const goToEditPage = () => {
    navigate("/useredit");
  };

  // "배송지 관리" 페이지로 이동하며 userInfo 전달
  const goToAddressPage = () => {
    navigate("/useraddress", { state: { loginInfo: userInfo } });
  };

  useEffect(() => {
  if (loginInfo && loginInfo.cust_id) {
    axios.post('/api/user/info', { cust_id: loginInfo.cust_id }, { withCredentials: true })
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => {
        console.error('유저 정보를 가져오는 데 실패했습니다.', err);
        alert('로그인이 필요합니다.');
        navigate('/login');
      });
  }
}, [loginInfo, navigate]);

  if (!userInfo) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>내정보</h2>
      <ul>
        <strong>아이디:</strong> {userInfo.cust_id} <br />
        <strong>이름:</strong> {userInfo.cust_nm} <br />
        <strong>이메일:</strong> {userInfo.email} <br />
        <strong>전화번호:</strong> {userInfo.phone} <br />
        <strong>주소1:</strong> {userInfo.address1} <br />
        <strong>주소2:</strong> {userInfo.address2} <br />
        <strong>우편번호:</strong> {userInfo.zip} <br />
        <strong>성별:</strong> {userInfo.gender} <br />
        <strong>생일:</strong> {userInfo.birthday} <br />
        <strong>등급:</strong> {userInfo.grade} <br />
        <strong>총 구매 금액:</strong> {userInfo.tot_buy_amt}원
      </ul>
      <button onClick={goToAddressPage} style={{ marginTop: '20px' }}>배송지 관리</button>
      <button onClick={goToEditPage} style={{ marginTop: '10px', marginLeft: '10px' }}>내정보 수정</button>
    </div>
  );
};

export default UserInfoPage;
