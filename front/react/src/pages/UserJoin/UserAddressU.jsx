import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateAddress } from '../../service/apiService';
import DaumPostcode from 'react-daum-postcode';
import '../../styles/User/UserAddressF.css'; // 추가 폼과 동일 CSS 사용

function UserAddressU() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  const addr = state?.addressInfo;

  // 수정할 배송지 정보를 초기값으로 설정
  const [form, setForm] = useState({
    seq: addr?.seq || '',                // 배송지 PK
    addr_class: addr?.addr_class || '', // 주소 분류
    address1: addr?.address1 || '',      // 기본주소
    address2: addr?.address2 || '',      // 상세주소
    zip: addr?.zip || '',                // 우편번호
    rcv_nm: addr?.rcv_nm || '',          // 수신자 이름
    rcv_phone: addr?.rcv_phone || '',    // 수신자 전화번호
    cust_id: loginInfo?.cust_id || ''    // 로그인 고객 ID
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 우편번호 창 열림 여부
  const [showAddress2, setShowAddress2] = useState(!!addr?.address2); // 상세주소 보일지 여부

  // 전화번호 입력 시 자동 하이픈 처리
  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  // input 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'rcv_phone' ? formatPhoneNumber(value) : value;
    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  // 주소 검색 완료 시 처리
  const handlePostcodeComplete = (data) => {
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
    const fullAddress = `${data.address}${extraAddress}`;
    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddress
    }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };

  // 수정 저장 버튼 클릭 시 실행
  const handleSubmit = async () => {
    const { addr_class, rcv_nm, rcv_phone, address1, address2 } = form;

    // 유효성 검사
    if (!addr_class) return alert('📌 주소명을 선택해주세요.');
    if (!rcv_nm.trim()) return alert('📌 받는 사람 이름을 입력해주세요.');
    if (!rcv_phone.trim()) return alert('📌 전화번호를 입력해주세요.');
    if (!/^\d{3}-\d{4}-\d{4}$/.test(rcv_phone)) return alert('📌 전화번호를 확인하세요.');
    if (!address1.trim()) return alert('📌 주소 검색을 완료해주세요.');
    if (!address2.trim()) return alert('📌 상세주소를 입력해주세요.');

    try {
      await updateAddress(form); // ✅ 백엔드와 연결된 API 호출
      alert('수정이 완료되었습니다.');
      navigate('/useraddress');
    } catch (err) {
      console.error('주소 수정 오류:', err);
      alert('❗ 주소 수정 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => navigate('/useraddress'); // 닫기 버튼

  return (
    <div className="user-address-form">
      <h2 className="form-title">배송지 수정</h2>

      {/* 주소명 선택 */}
      <div className="address-form-group">
        <label>주소명</label>
        <select name="addr_class" value={form.addr_class} onChange={handleChange}>
          <option value="">선택하세요</option>
          <option value="01">집</option>
          <option value="02">회사</option>
          <option value="03">지인</option>
        </select>
      </div>

      {/* 수신자 이름 */}
      <div className="address-form-group">
        <label>받는 사람</label>
        <input name="rcv_nm" placeholder="수신인 이름" value={form.rcv_nm} onChange={handleChange} />
      </div>

      {/* 전화번호 */}
      <div className="address-form-group">
        <label>전화번호</label>
        <input name="rcv_phone" placeholder="숫자만 입력하세요" value={form.rcv_phone} onChange={handleChange} />
      </div>

      {/* 주소 검색 */}
      <div className="address-form-group address1-group">
        <label>주소</label>
        <input name="address1" placeholder="도로명 주소" value={form.zip ? `[${form.zip}] ${form.address1}` : ''} readOnly />
        <span className="search-btn" onClick={() => setIsPostcodeOpen(true)}>주소 검색</span>
      </div>

      {/* 상세 주소 */}
      {showAddress2 && (
        <div className="address-form-group">
          <input name="address2" placeholder="상세주소를 입력하세요" value={form.address2} onChange={handleChange} />
        </div>
      )}

      {/* 다음 주소 검색창 */}
      {isPostcodeOpen && (
        <div className="postcode-box">
          <DaumPostcode
            onComplete={handlePostcodeComplete}
            autoClose
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      )}

      {/* 버튼 */}
      <div className="button-group">
        <button onClick={handleSubmit} className="address-btn-submit">수정 저장</button>
        <button onClick={handleClose} className="address-btn-cancel">닫기</button>
      </div>
    </div>
  );
}

export default UserAddressU;
