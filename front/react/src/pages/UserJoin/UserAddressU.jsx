import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateAddress } from '../../service/apiService'; // 수정 함수 사용

function UserAddressU() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  const addr = state?.addressInfo;

  const [form, setForm] = useState({
    seq: addr.seq,
    addr_class: addr.addr_class,
    address1: addr.address1,
    address2: addr.address2,
    zip: addr.zip,
    rcv_nm: addr.rcv_nm,
    rcv_phone: addr.rcv_phone,
    cust_id: loginInfo.cust_id
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("💬 수정 전송 데이터", form);
    try {
      await updateAddress(form);
      alert('수정되었습니다.');
      navigate(-1); // 뒤로가기
    } catch(err) {
      console.error('수정 실패:', err);
      alert('수정 중 에러 발생');
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl">배송지 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="addr_class" value={form.addr_class} onChange={handleChange} placeholder="배송지명" />
        <input name="zip" value={form.zip} onChange={handleChange} placeholder="우편번호" />
        <input name="address1" value={form.address1} onChange={handleChange} placeholder="주소1" />
        <input name="address2" value={form.address2} onChange={handleChange} placeholder="주소2" />
        <input name="rcv_nm" value={form.rcv_nm} onChange={handleChange} placeholder="받는 사람" />
        <input name="rcv_phone" value={form.rcv_phone} onChange={handleChange} placeholder="전화번호" />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">수정 저장</button>
      </form>
    </div>
  );
}

export default UserAddressU;
