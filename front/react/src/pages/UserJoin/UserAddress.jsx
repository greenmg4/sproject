import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAddresses, deleteAddress, setDefaultAddress } from '../../service/apiService';
import UserAddressF from './UserAddressF';

function UserAddress() {
  const location = useLocation();
  const loginInfoFromState = location.state?.loginInfo;
  const loginInfo = loginInfoFromState || JSON.parse(sessionStorage.getItem('loginInfo'));

  const [addresses, setAddresses] = useState([]); // 주소 목록 상태
  const [showForm, setShowForm] = useState(false); // 폼 표시 여부

  // 주소 목록 불러오기
  const loadAddresses = async () => {
    if (!loginInfo?.cust_id) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const res = await getAddresses(loginInfo.cust_id);
      console.log('📦 서버 응답 전체:', res);

      // 🔧 수정 시작: 응답 구조 유연하게 처리
      let addrList = [];

      // 1. res가 배열이면 그대로 사용
      if (Array.isArray(res)) {
        addrList = res;
      } 
      // 2. res.data가 배열이면 그것 사용
      else if (res && Array.isArray(res.data)) {
        addrList = res.data;
      } 
      // 3. res.data.data가 배열이면 그것 사용
      else if (res?.data?.data && Array.isArray(res.data.data)) {
        addrList = res.data.data;
      } 
      // 4. 구조 파악 안되면 경고 출력
      else {
        console.warn('⚠️ 예기치 못한 응답 구조입니다:', res);
      }

      setAddresses(addrList);
      // 🔧 수정 끝

    } catch (err) {
      console.error('❌ 주소 불러오기 실패', err);
      setAddresses([]);
    }
  };

  // 주소 삭제
  const handleDelete = async (seq) => {
    await deleteAddress(seq);
    loadAddresses(); // 삭제 후 갱신
  };

  // 기본배송지 설정
  const handleSetDefault = async (seq) => {
    await setDefaultAddress({ custId: loginInfo.cust_id, seq });
    loadAddresses(); // 설정 후 갱신
  };

  // 컴포넌트 마운트 시 주소 로드
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
        onClick={() => setShowForm(true)}
      >
        배송지 추가
      </button>

      {/* 주소 추가 폼 */}
      {showForm && loginInfo?.cust_id && (
        <UserAddressF
          custId={loginInfo.cust_id}
          onSave={loadAddresses}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* 주소 목록 */}
      <ul className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <li key={addr.seq} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p>{addr.address1} {addr.address2} ({addr.zip})</p>
                <p>{addr.rcvNm} / {addr.rcvPhone}</p>
                <p>주소명: {addr.addrClass}</p>
                {addr.defaultYn === 'Y' && <span className="text-red-500 font-bold">[기본배송지]</span>}
              </div>
              <div className="space-x-2">
                <button onClick={() => handleDelete(addr.seq)} className="text-red-500">삭제</button>
                <button onClick={() => handleSetDefault(addr.seq)} className="text-blue-500">기본배송지 설정</button>
              </div>
            </li>
          ))
        ) : (
          <li>등록된 주소가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default UserAddress;
