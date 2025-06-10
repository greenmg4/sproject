// UserAddress.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress
} from '../../service/apiService';

function UserAddress() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginInfoFromState = location.state?.loginInfo;
  const loginInfo = loginInfoFromState || JSON.parse(sessionStorage.getItem('loginInfo'));

  const [addresses, setAddresses] = useState([]);
  const [selectedSeq, setSelectedSeq] = useState(null);

  // 주소명 코드 → 이름 매핑
  const addressClassMap = {
    '01': '집',
    '02': '회사',
    '03': '기타'
  };

  // 배송지 리스트 불러오기
  const loadAddresses = async () => {
    if (!loginInfo?.cust_id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await getAddresses(loginInfo.cust_id);
      let addrList = [];

      if (Array.isArray(res)) {
        addrList = res;
      } else if (res && Array.isArray(res.data)) {
        addrList = res.data;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        addrList = res.data.data;
      }

      setAddresses(addrList);
    } catch (err) {
      console.error('❌ 주소 불러오기 실패:', err);
      setAddresses([]);
    }
  };

  // 삭제 기능
  const handleDelete = async (seq) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteAddress(seq); // DELETE 요청
      alert('삭제 완료');
      loadAddresses(); // 다시 로드
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('삭제 실패: ' + (err.message || '서버 에러'));
    }
  };

  // 기본 배송지 설정
  const handleSetDefault = async () => {
    if (!selectedSeq) {
      alert('기본배송지로 설정할 주소를 선택하세요.');
      return;
    }
    try {
      await setDefaultAddress({ custId: loginInfo.cust_id, seq: selectedSeq });
      alert('기본 배송지 설정 완료');
      loadAddresses();
    } catch (err) {
      alert('기본 배송지 설정 실패');
      console.error(err);
    }
  };

  // 수정 이동
  const handleModify = (addr) => {
    navigate('/useraddressu', { state: { addressInfo: addr } });
  };

  // 추가 이동
  const handleAddAddress = () => {
    navigate('/useraddressf', { state: { loginInfo } });
  };

  useEffect(() => {
    if (loginInfo?.cust_id) {
      loadAddresses();
    }
  }, [loginInfo]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">배송지 관리</h2>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleAddAddress}
      >
        배송지 추가
      </button>

      <ul className="space-y-4 mb-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <li key={addr.seq} className="p-4 border rounded flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedSeq === addr.seq}
                  onChange={() => setSelectedSeq(addr.seq)}
                />
                <div>
                  <p>
                    주소명: {addressClassMap[addr.addr_class] || addr.addr_class}
                  </p>
                  <p>[{addr.zip}] {addr.address1} {addr.address2}</p>
                  <p>{addr.rcv_nm} / {addr.rcv_phone}</p>

                  {addr.defaultYn === 'Y' && (
                    <span className="text-red-500 font-bold">[기본배송지]</span>
                  )}
                </div>
              </div>
              <div className="space-x-2">
                {/* ✅ 버튼 순서: 수정 → 삭제 */}
                <button onClick={() => handleModify(addr)} className="text-blue-500">수정</button>
                <button onClick={() => handleDelete(addr.seq)} className="text-red-500">삭제</button>
              </div>
            </li>
          ))
        ) : (
          <li>등록된 주소가 없습니다.</li>
        )}
      </ul>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSetDefault}
      >
        선택된 주소를 기본배송지로 설정
      </button>
    </div>
  );
}

export default UserAddress;
