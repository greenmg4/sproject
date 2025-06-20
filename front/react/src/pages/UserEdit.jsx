// ✅ UserEdit.jsx 전체 완성본 (rcv_nm, rcv_phone 같이 전송되도록 수정)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserAddressF.css';

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
    address2: '',
    addr_class: '',
    rcv_nm: '',   // 수신자 이름
    rcv_phone: '' // 수신자 전화번호
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showAddress2, setShowAddress2] = useState(false);

  const goToPassword = () => {
    navigate("/passwordcheck");
  };

  // 사용자 로그인 여부 및 정보 불러오기
  useEffect(() => {
    if (!loginInfo || !loginInfo.cust_id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios.post(`${API_BASE_URL}/api/user/info`, { cust_id: loginInfo.cust_id })
      .then(res => {
        if (res.data && res.data.cust_id) {
          setForm(prev => ({
            ...prev,
            ...res.data,
            rcv_nm: res.data.cust_nm,       // 이름을 수신자 이름으로 기본 설정
            rcv_phone: res.data.phone       // 전화번호를 수신자 전화로 기본 설정
          }));
          if (res.data.address2?.trim()) setShowAddress2(true);
        } else {
          alert("사용자 정보를 불러올 수 없습니다.");
        }
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패:", err);
        alert("서버 오류로 사용자 정보를 가져오지 못했습니다.");
      });
  }, [loginInfo, navigate]);

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePostcodeComplete = (data) => {
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
    const fullAddress = `[${data.zonecode}] ${data.address}${extraAddress}`;

    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddress
    }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };

  // 폼 제출 (유효성 검사 포함)
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ 필수 항목 유효성 검사
    if (!form.cust_nm.trim() || !form.phone.trim() || !form.email.trim() || !form.rcv_nm.trim() || !form.rcv_phone.trim()) {
      alert("이름, 전화번호, 이메일, 수신자 이름/전화번호는 필수입니다.");
      return;
    }

    // 주소 항목은 선택적이지만 addr_class 선택되면 zip/address1도 필요함
    if (form.addr_class && (!form.zip || !form.address1)) {
      alert("주소 분류를 선택한 경우 주소 검색도 필요합니다.");
      return;
    }

    axios.post(`${API_BASE_URL}/api/user/update`, form)
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
        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="cust_id" value={form.cust_id} disabled />
        </div>

        <div className="form-group">
          <label>이름</label>
          <input type="text" name="cust_nm" value={form.cust_nm} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>전화번호</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>수신자 이름</label>
          <input type="text" name="rcv_nm" value={form.rcv_nm} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>수신자 전화</label>
          <input type="text" name="rcv_phone" value={form.rcv_phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>주소</label>
          <div className="address-search-container">
            <input type="text" name="address1" value={form.address1} placeholder="주소 검색" onClick={() => setIsPostcodeOpen(true)} readOnly />
            <input type="text" name="zip" value={form.zip} readOnly placeholder="우편번호" />
          </div>
        </div>

        {showAddress2 && (
          <div className="form-group">
            <label>상세 주소</label>
            <input type="text" name="address2" value={form.address2} onChange={handleChange} placeholder="상세 주소를 입력해주세요" />
          </div>
        )}

        {showAddress2 && (
          <div className="form-group">
            <label>주소 분류</label>
            <select name="addr_class" value={form.addr_class} onChange={handleChange}>
              <option value="">-- 주소 분류 선택 --</option>
              <option value="01">집</option>
              <option value="02">회사</option>
              <option value="03">지인</option>
            </select>
          </div>
        )}

        {isPostcodeOpen && (
          <div className="postcode-popup">
            <DaumPostcode onComplete={handlePostcodeComplete} autoClose />
          </div>
        )}

        <div>
          <button type="submit" className="btn-edit" style={{ cursor: 'pointer' }}>
            내정보 수정하기
          </button>

          <button type="button" onClick={goToPassword} className="btn-password" style={{ cursor: 'pointer' }}>
            비밀번호 수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
