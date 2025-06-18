import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserAddressF.css'; // 주소 스타일 공통 사용

const UserEdit = ({ loginInfo, isLoggedIn }) => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // 사용자 정보 상태
  const [form, setForm] = useState({
    cust_id: '',
    cust_pw: '',
    cust_nm: '',
    birthday: '',
    phone: '',
    email: '',
    zip: '',
    address1: '',
    address2: ''
  });

  // 주소 검색창 열림 여부
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 상세주소 입력창 표시 여부
  const [showAddress2, setShowAddress2] = useState(false);

  // 비밀번호 변경 페이지로 이동
  const goToPassword = () => {
    navigate("/passwordcheck");
  };

  // 사용자 로그인 여부 확인 및 정보 가져오기
  useEffect(() => {
    if (loginInfo === undefined) return;
    if (!loginInfo || !loginInfo.cust_id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios.post(`${API_BASE_URL}/api/user/info`, { cust_id: loginInfo.cust_id }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.data && res.data.cust_id) {
          setForm(res.data);

          // 주소2에 기존 데이터가 있다면 상세주소 칸 자동 표시
          if (res.data.address2 && res.data.address2.trim() !== '') {
            setShowAddress2(true);
          }
        } else {
          alert("사용자 정보를 불러올 수 없습니다.");
        }
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패:", err);
        alert("서버 오류로 사용자 정보를 가져오지 못했습니다.");
      });
  }, [loginInfo, navigate]);

  // input 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 주소 검색 완료 시 동작
  const handlePostcodeComplete = (data) => {
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
    const fullAddress = `[${data.zonecode}] ${data.address}${extraAddress}`;

    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddress
    }));

    setIsPostcodeOpen(false);
    setShowAddress2(true); // 상세주소 칸 보이기
  };

  // 정보 수정 API 요청
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_BASE_URL}/api/user/update`, form, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        alert("수정 완료되었습니다.");
        navigate("/userinfo");
      })
      .catch(err => {
        console.error("수정 실패:", err);
        alert("정보 수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="user-address-form">
      <h2 className="form-title">내정보 수정</h2>

      <form onSubmit={handleSubmit}>
        {/* 아이디 (수정 불가) */}
        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="cust_id" value={form.cust_id} disabled />
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label>이름</label>
          <input type="text" name="cust_nm" value={form.cust_nm} onChange={handleChange} />
        </div>

        {/* 생년월일 */}
        <div className="form-group">
          <label>생년월일</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label>전화번호</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label>이메일</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        {/* 주소 */}
        <div className="form-group">
          <label>주소</label>
          <div className="address-search-container">
            {/* 주소 검색용 주소1 (클릭 시 주소창 오픈) */}
            <input
              type="text"
              name="address1"
              value={form.address1}
              placeholder="주소 검색"
              onClick={() => setIsPostcodeOpen(true)}
              readOnly
              className="address1-input"
            />
            {/* 우편번호 */}
            <input
              type="text"
              name="zip"
              value={form.zip}
              readOnly
              placeholder="우편번호"
              className="zip-input"
            />
          </div>
        </div>

        {/* 상세주소 (주소 검색 이후 또는 기존 데이터가 있으면 표시) */}
        {showAddress2 && (
          <div className="form-group">
            <label>상세 주소</label>
            <input
              type="text"
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="상세 주소를 입력해주세요"
            />
          </div>
        )}

        {/* 주소 검색창 (다음 API) */}
        {isPostcodeOpen && (
          <div className="postcode-popup">
            <DaumPostcode onComplete={handlePostcodeComplete} autoClose />
          </div>
        )}

        {/* 수정 및 비밀번호 수정 버튼 */}
        <div >
          <button
            type="submit"
            className="btn-edit"
            style={{cursor:'pointer'}}
          >
           내정보 수정하기
          </button>

          <button
            type="button"
             onClick={goToPassword}
            className="btn-password"
            style={{cursor:'pointer'}}
          >
            비밀번호 수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
