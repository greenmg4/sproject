import React, { useState } from 'react';
import { addAddress } from '../../service/apiService';

function UserAddressF({ custId, onSave, onClose }) {
  const [form, setForm] = useState({
    addrClass: '',
    address1: '',
    address2: '',
    zip: '',
    rcvNm: '',
    rcvPhone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("제출 데이터:", { ...form, custId }); // 디버깅용
    await addAddress({ ...form, custId });
    onSave();
    onClose();
  };

  return (
    <div className="border p-4 rounded">
      <input name="addr_class" placeholder="주소명" onChange={handleChange} className="block mb-2" />
      <input name="zip" placeholder="우편번호" onChange={handleChange} className="block mb-2" />
      <input name="address1" placeholder="주소" onChange={handleChange} className="block mb-2" />
      <input name="address2" placeholder="상세주소" onChange={handleChange} className="block mb-2" />
      <input name="rcv_nm" placeholder="수신인" onChange={handleChange} className="block mb-2" />
      <input name="rcv_phone" placeholder="연락처" onChange={handleChange} className="block mb-2" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
      <button onClick={onClose} className="ml-2">닫기</button>
    </div>
  );
}

export default UserAddressF;
