import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAddress } from '../../service/apiService';
import DaumPostcode from 'react-daum-postcode';
import '../../styles/UserAddr/UserAddressF.css'; // 스타일 파일 import

function UserAddressF({ loginInfo, onSave }) {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 로그인된 사용자 ID 저장
  const [custId, setCustId] = useState('');

  // 폼 입력 상태 초기화
  const [form, setForm] = useState({
    addr_class: '',    // 주소명 분류: 집/회사/지인
    address1: '',      // 도로명 주소
    address2: '',      // 상세 주소
    zip: '',           // 우편번호
    rcv_nm: '',        // 수신자 이름
    rcv_phone: '',     // 수신자 전화번호
  });

  // 우편번호 검색창 열기 여부
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  // 상세주소 입력칸 보이기 여부
  const [showAddress2, setShowAddress2] = useState(false);

    // 🔹 props로 받은 loginInfo에서 cust_id를 추출하여 custId로 설정
  useEffect(() => {
    if (loginInfo?.cust_id) {
      setCustId(loginInfo.cust_id);
    }
  }, [loginInfo]); // loginInfo가 바뀌면 재실행




  // 전화번호 자동 하이픈 처리 함수
  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  // 폼 필드 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'rcv_phone' ? formatPhoneNumber(value) : value;
    setForm({ ...form, [name]: newValue });
  };

  // 주소 검색 후 선택 시 실행되는 함수
  const handlePostcodeComplete = (data) => {
    // 우편번호는 zip 필드에만 저장
    // 주소 전체(지번 포함)는 address1에 저장
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
    const fullAddress = `${data.address}${extraAddress}`;

    setForm(prev => ({
      ...prev,
      zip: data.zonecode,        // 우편번호만 zip에 저장
      address1: fullAddress,     // 주소만 address1에 저장
    }));

    setIsPostcodeOpen(false);     // 주소창 닫기
    setShowAddress2(true);        // 상세주소 입력칸 열기
  };

  // 저장 버튼 클릭 시 실행
  const handleSubmit = async () => {
    if (!custId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const { addr_class, rcv_nm, rcv_phone, address1, address2 } = form;

    // 필수 항목 검증
    if (!addr_class) return alert('📌 주소명을 선택해주세요.');
    if (!rcv_nm.trim()) return alert('📌 받는 사람 이름을 입력해주세요.');
    if (!rcv_phone.trim()) return alert('📌 전화번호를 입력해주세요.');
    if (!/^\d{3}-\d{4}-\d{4}$/.test(rcv_phone)) return alert('📌 전화번호를 확인하세요.');
    if (!address1.trim()) return alert('📌 주소 검색을 완료해주세요.');
    if (!address2.trim()) return alert('📌 상세주소를 입력해주세요.');

    try {
      const fullData = { ...form, cust_id: custId }; // 최종 전송 데이터
      console.log('최종 전송 데이터:', fullData);       // 🔍 디버깅 로그
      await addAddress(fullData);                    // API 호출로 주소 추가
      if (onSave) onSave();                          // 저장 후 콜백 실행
      navigate('/useraddress');                      // 주소 목록 페이지로 이동
    } catch (error) {
      console.error('주소 추가 오류:', error);
      alert('❗ 주소 저장 중 오류가 발생했습니다.');
    }
  };

  // 닫기 버튼 클릭 시 주소 목록으로 이동
  const handleClose = () => navigate('/useraddress');

  return (
    <div className="user-address-form">
      <h2 className="form-title">배송지 추가</h2>

      {/* 주소명 선택 드롭다운 */}
      <div className="form-group">
        <label>주소명</label>
        <select name="addr_class" value={form.addr_class} onChange={handleChange}>
          <option value="">선택하세요</option>
          <option value="01">집</option>
          <option value="02">회사</option>
          <option value="03">지인</option>
        </select>
      </div>

      {/* 수신자 이름 입력 */}
      <div className="form-group">
        <label>받는 사람</label>
        <input
          name="rcv_nm"
          placeholder="수신인 이름"
          value={form.rcv_nm}
          onChange={handleChange}
        />
      </div>

      {/* 수신자 전화번호 입력 */}
      <div className="form-group">
        <label>전화번호</label>
        <input
          name="rcv_phone"
          placeholder="숫자만 입력하세요"
          value={form.rcv_phone}
          onChange={handleChange}
        />
      </div>

     {/* 주소 표시 및 검색 버튼 */}
          <div className="form-group address1-group">
            <label>주소</label>
            {/* 주소를 선택하기 전에는 placeholder만 보이고, 선택한 후에는 [우편번호] 주소 형식으로 출력 */}
            <input
              name="address1"
              placeholder="도로명 주소"
              value={form.zip ? `[${form.zip}] ${form.address1}` : ''}
              readOnly
            />
            <span className="search-btn" onClick={() => setIsPostcodeOpen(true)}>
              주소 검색
            </span>
          </div>


      {/* 상세주소 입력칸 (주소 선택 후에만 보임) */}
      {showAddress2 && (
        <div className="form-group">
          <input
            name="address2"
            placeholder="상세주소를 입력하세요"
            value={form.address2}
            onChange={handleChange}
          />
        </div>
      )}

      {/* 다음 우편번호 검색창 */}
      {isPostcodeOpen && (
        <div className="postcode-box">
          <DaumPostcode
            onComplete={handlePostcodeComplete} // 주소 선택 시 처리 함수
            autoClose
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      )}

      {/* 저장 및 닫기 버튼 */}
      <div className="button-group">
        <button onClick={handleSubmit} className="btn-submit">저장</button>
        <button onClick={handleClose} className="btn-cancel">닫기</button>
      </div>
    </div>
  );
}

export default UserAddressF;