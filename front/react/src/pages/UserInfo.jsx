import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserInfo.css';




const UserInfoPage = ({ loginInfo, isLoggedIn }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // 내정보 수정 페이지 이동
  const goToEditPage = () => navigate("/useredit");

  // 배송지 관리 페이지 이동 (userInfo 상태를 함께 전달)
  const goToAddressPage = () => navigate("/useraddress", { state: { loginInfo: userInfo } });

  // 탈퇴 페이지 이동
  const goToWithdraw = () => navigate("/userwithdraw");

  // 결제 내역 페이지 이동
  const orderList = () => navigate("/orderList");

  // 유저 정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/info`, { cust_id: loginInfo.cust_id }, { withCredentials: true });
      setUserInfo(res.data);
    } catch (err) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  // 컴포넌트 로딩 시 사용자 정보 불러오기
  useEffect(() => {
    if (loginInfo && loginInfo.cust_id) fetchUserInfo();
  }, [loginInfo, navigate]);
  useEffect(() => {
  console.log("📸 profile_img 경로 확인:", userInfo?.profile_img);
}, [userInfo]);

  // 프로필 이미지 업로드 처리
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

      console.log(" 파일 업로드 시도:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cust_id", loginInfo.cust_id);

    try {
      await axios.post(`${API_BASE_URL}/api/user/upload-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    fetchUserInfo();
    } catch (err) {
      alert("프로필 업로드 실패");
      console.error(err);
    }
  };

  // 프로필 이미지 삭제 처리
  const handleProfileDelete = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/user/delete-profile`, {
        cust_id: loginInfo.cust_id,
      });
      fetchUserInfo();
    } catch (err) {
      alert("이미지 삭제 실패");
      console.error(err);
    }
  };

  if (!userInfo) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로그인이 필요합니다.</div>;

  return (
    <div className="user-info-container">
      <h2 className="user-info-title">내정보</h2>

      {/* 프로필 이미지 및 등급 표시 영역 */}
      <div className="profile-section">

        {/* 왼쪽: 프로필 이미지와 등록 버튼 */}
        <div className="profile-image-with-button">
          <div className="profile-image-box">
            <img
              src={userInfo.profile_img || "/images/profile/basicman4.png"} // 서버에서 받아온 이미지 경로가 없으면 기본 이미지 출력
              alt="프로필"
              className="profile-img"
            />
          </div>

          {/* 숨겨진 파일 선택 input */}
          <input
            type="file"
            id="profileInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileUpload}
          />

          {/* 파일 선택 트리거용 버튼 */}
          <button className="profile-upload-btn" onClick={() => document.getElementById('profileInput').click()}>
            프로필 등록하기
          </button>

          {/* 이미지 삭제 버튼 (이미지가 있을 때만 노출) */}
          {userInfo.profile_img && (
            <button className="profile-delete-btn" onClick={handleProfileDelete}>
              이미지 삭제
            </button>
          )}
        </div>

        {/* 등급 라벨과 등급 값 */}
        <div className="profile-grade-box">
          <div className="grade-label">회원등급</div>
          <div className="profile-grade">{userInfo.grade || "등급 없음"}</div>
        
        </div>
      </div>

      {/* 사용자 상세 정보 리스트 */}
      <ul className="user-info-list">
        <li className="user-info-item"><span className="user-info-label">아이디 </span><span className="user-info-value">{userInfo.cust_id}</span></li>
        <li className="user-info-item"><span className="user-info-label">이름 </span><span className="user-info-value">{userInfo.cust_nm}</span></li>
        <li className="user-info-item"><span className="user-info-label">전화번호 </span><span className="user-info-value">{userInfo.phone}</span></li>
        <li className="user-info-item"><span className="user-info-label">이메일 </span><span className="user-info-value">{userInfo.email}</span></li>
        <li className="user-info-item"><span className="user-info-label">주소 </span><span className="user-info-value">{userInfo.address1}</span></li>
        <li className="user-info-item"><span className="user-info-label">상세주소 </span><span className="user-info-value">{userInfo.address2}</span></li>
        <li className="user-info-item"><span className="user-info-label">우편번호 </span><span className="user-info-value">{userInfo.zip}</span></li>
    
        <li className="user-info-item">
          <span className="user-info-label">성별 </span>
          <span className="user-info-value">
            {userInfo.gender === '1' ? '남자' : userInfo.gender === '2' ? '여자' : '기타'}
          </span>
        </li>

        <li className="user-info-item"><span className="user-info-label">생일 </span><span className="user-info-value">{userInfo.birthday}</span></li>
        <li className="user-info-item">
          <span className="user-info-label">총 구매 금액:</span>
          <span className="user-info-value">{userInfo.tot_buy_amt}원</span>
          <button className="user-info-order-btn" onClick={orderList}>주문 내역</button>
        </li>
      </ul>

      <button className="user-info-btn" onClick={goToAddressPage}>배송지 관리</button>
      <button className="user-info-btn2" onClick={goToEditPage}>내정보 수정</button>
      <button className="user-info-withdraw-text" onClick={goToWithdraw}>탈퇴하기</button>
    </div>
  );
};

export default UserInfoPage;
