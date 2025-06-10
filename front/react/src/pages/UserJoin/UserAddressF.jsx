import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAddress } from '../../service/apiService';
import DaumPostcode from 'react-daum-postcode';

function UserAddressF({ cust_id: propCustId, onSave }) {
  const navigate = useNavigate();
  const [custId, setCustId] = useState('');
  const [form, setForm] = useState({
    addr_class: '',      // 집, 회사, 지인 → 코드값: 01, 02, 03
    address1: '',
    address2: '',
    zip: '',
    rcv_nm: '',
    rcv_phone: '',
  });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showAddress2, setShowAddress2] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('loginInfo');
    if (propCustId) {
      setCustId(propCustId);
    } else if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.cust_id) setCustId(parsed.cust_id);
    }
  }, [propCustId]);

  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'rcv_phone' ? formatPhoneNumber(value) : value;
    setForm({ ...form, [name]: newValue });
  };

  const handlePostcodeComplete = (data) => {
    const fullAddr = `[${data.zonecode}] ${data.address}`;
    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddr,
    }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };

  const handleSubmit = async () => {
    if (!custId) {
      alert('로그인이 필요합니다.');
      return;
    }

        // ✅ 입력값 누락 검사
    const { addr_class, rcv_nm, rcv_phone, address1, address2 } = form;

    if (!addr_class) {
      alert('📌 주소명을 선택해주세요.');
      return;
    }

    if (!rcv_nm.trim()) {
      alert('📌 받는 사람 이름을 입력해주세요.');
      return;
    }

    if (!rcv_phone.trim()) {
      alert('📌 전화번호를 입력해주세요.');
      return;
    }

    // 전화번호 형식 검사 추가 (여기부터 추가됨)
    if (!/^\d{3}-\d{4}-\d{4}$/.test(rcv_phone)) {
      alert('📌 전화번호를 확인하세요.');
      return;
    }
    // 전화번호 형식 검사 추가 끝


    if (!address1.trim()) {
      alert('📌 주소 검색을 완료해주세요.');
      return;
    }

    if (!address2.trim()) {
      alert('📌 상세주소를 입력해주세요.');
      return;
    }


    try {
      const fullData = { ...form, cust_id: custId };
      await addAddress(fullData);
      if (onSave) onSave();
      navigate('/useraddress');
    } catch (error) {
      console.error('주소 추가 오류:', error);
      alert('❗ 주소 저장 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => navigate('/useraddress');

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center'
      }}>배송지 추가</h2>

      {/* 주소명: select box로 변경 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>주소명</label>
        <select
          name="addr_class"
          value={form.addr_class}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        >
          <option value="">선택하세요</option>
          <option value="01">집</option>
          <option value="02">회사</option>
          <option value="03">지인</option>
        </select>
      </div>

      {/* 수신인 이름 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>받는 사람</label>
        <input
          name="rcv_nm"
          placeholder="수신인 이름"
          value={form.rcv_nm}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 전화번호 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>전화번호</label>
        <input
          name="rcv_phone"
          placeholder="숫자만 입력하세요"
          value={form.rcv_phone}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 주소1 */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>주소</label>
        <input
          name="address1"
          placeholder="도로명 주소"
          value={form.address1}
          readOnly
          style={{
            width: '100%',
            padding: '10px 100px 10px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <span
          onClick={() => setIsPostcodeOpen(true)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '70%',
            transform: 'translateY(-50%)',
            color: '#007bff',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          주소 검색
        </span>
      </div>

      {/* 상세 주소 */}
      {showAddress2 && (
        <div style={{ marginBottom: '20px' }}>
          <input
            name="address2"
            placeholder="상세주소를 입력하세요"
            value={form.address2}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      )}

      {/* 다음 주소 API */}
      {isPostcodeOpen && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <DaumPostcode
            onComplete={handlePostcodeComplete}
            autoClose
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      )}

      {/* 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          저장
        </button>
        <button
          onClick={handleClose}
          style={{
            backgroundColor: '#6c757d',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default UserAddressF;
