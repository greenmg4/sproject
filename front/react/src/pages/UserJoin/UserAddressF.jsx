import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAddress, updateAddress } from '../../service/apiService';
import DaumPostcode from 'react-daum-postcode';
import '../../styles/User/UserAddressF.css';

/**
 * 배송지 추가/수정 컴포넌트
 * @params isEdit: 수정 모드 여부 (true면 기존 입력값 유지 + PUT 호출)
 * @params existingData: 수정 시 기존 addressDTO 값
 */
function UserAddressF({ loginInfo, onSave, isEdit = false, existingData = {} }) {
  const navigate = useNavigate();
  const [custId, setCustId] = useState('');
  const [form, setForm] = useState({
    addr_class: existingData.addr_class || '',
    address1: existingData.address1 || '',
    address2: existingData.address2 || '',
    zip: existingData.zip || '',
    rcv_nm: existingData.rcv_nm || '',
    rcv_phone: existingData.rcv_phone || '',
    seq: existingData.seq || null,
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showAddress2, setShowAddress2] = useState(!!existingData.address2);

  useEffect(() => {
    if (loginInfo?.cust_id) setCustId(loginInfo.cust_id);
  }, [loginInfo]);

  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0,11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0,3)}-${nums.slice(3)}`;
    return `${nums.slice(0,3)}-${nums.slice(3,7)}-${nums.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'rcv_phone' ? formatPhoneNumber(value) : value });
  };

  const handlePostcodeComplete = (data) => {
    const full = data.address + (data.buildingName ? ` (${data.buildingName})` : '');
    setForm(prev => ({ ...prev, zip: data.zonecode, address1: full }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };

  const handleSubmit = async () => {
    if (!custId) return alert('로그인이 필요합니다.');
    const { addr_class, rcv_nm, rcv_phone, address1, address2 } = form;
    if (!addr_class || !rcv_nm.trim() || !rcv_phone.trim() ||
        !address1.trim() || !address2.trim() ||
        !/^\d{3}-\d{4}-\d{4}$/.test(rcv_phone)) {
      return alert('모든 필수 항목을 정확히 입력하세요.');
    }

    const fullData = { ...form, cust_id: custId };
    console.log('📦 전송 데이터:', fullData);

    try {
      if (isEdit) {
        await updateAddress(fullData);
      } else {
        await addAddress(fullData);
      }
      if (onSave) onSave();
      navigate('/useraddress');
    } catch (err) {
      console.error('주소 저장 중 오류:', err);
      alert('주소 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="user-address-form">
      <h2 className="form-title">{isEdit ? ' 배송지 수정' : ' 배송지 추가'}</h2>

      {/* addr_class */}
      <div className="form-group">
        <label>주소명</label>
        <select name="addr_class" value={form.addr_class} onChange={handleChange}>
          <option value="">선택하세요</option>
          <option value="01">집</option>
          <option value="02">회사</option>
          <option value="03">지인</option>
        </select>
      </div>

      {/* 수신자 이름 */}
      <div className="form-group">
        <label>받는 사람</label>
        <input name="rcv_nm" value={form.rcv_nm} onChange={handleChange} />
      </div>

      {/* 수신자 전화 */}
      <div className="form-group">
        <label>전화번호</label>
        <input name="rcv_phone" value={form.rcv_phone} onChange={handleChange} />
      </div>

      {/* 주소 + 검색 */}
      <div className="form-group address1-group">
        <label>주소</label>
        <input
          name="address1"
          value={form.zip ? `[${form.zip}] ${form.address1}` : ''}
          readOnly
        />
        <span className="search-btn" onClick={() => setIsPostcodeOpen(true)}>주소 검색</span>
      </div>

      {showAddress2 && (
        <div className="form-group">
          <input name="address2" value={form.address2} onChange={handleChange} placeholder="상세주소" />
        </div>
      )}

      {isPostcodeOpen && (
        <div className="postcode-box">
          <DaumPostcode
            onComplete={handlePostcodeComplete}
            autoClose
            style={{width:'100%',height:'400px'}}
          />
        </div>
      )}

      <div className="button-group">
        <button onClick={handleSubmit} className="btn-submit">저장</button>
        <button onClick={() => navigate('/useraddress')} className="btn-cancel">닫기</button>
      </div>
    </div>
  );
}

export default UserAddressF;
