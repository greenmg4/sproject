import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress
} from '../../service/apiService';

import '../../styles/UserAddr/UserAddress.css'; // 외부 CSS 연결

function UserAddress() {
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 정보 가져오기 (state → sessionStorage 순)
  const loginInfoFromState = location.state?.loginInfo;
  const loginInfo = loginInfoFromState || JSON.parse(sessionStorage.getItem('loginInfo'));

  const [addresses, setAddresses] = useState([]);     // 주소 리스트 상태
  const [selectedSeq, setSelectedSeq] = useState(null); // 선택된 주소 seq (기본 설정용)

  // 주소 타입 코드 매핑 (01=집, 02=회사, 03=기타)
  const addressClassMap = {
    '01': '집',
    '02': '회사',
    '03': '기타'
  };

  // 서버에서 주소 목록 불러오기
  const loadAddresses = async () => {
    if (!loginInfo?.cust_id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await getAddresses(loginInfo.cust_id);
      let addrList = [];

      // 서버 응답 형식에 따라 분기 처리
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

  // 주소 삭제 처리
  const handleDelete = async (seq) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteAddress(seq); // 서버에 삭제 요청
      alert('삭제 완료');
      loadAddresses(); // 삭제 후 목록 다시 불러오기
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
      loadAddresses(); // 설정 후 목록 새로고침
    } catch (err) {
      alert('기본 배송지 설정 실패');
      console.error(err);
    }
  };

  // 주소 수정 페이지로 이동
  const handleModify = (addr) => {
    navigate('/useraddressu', { state: { addressInfo: addr } });
  };

  // 주소 추가 페이지로 이동
  const handleAddAddress = () => {
    navigate('/useraddressf', { state: { loginInfo } });
  };

  // 페이지 로딩 시 주소 불러오기
  useEffect(() => {
    if (loginInfo?.cust_id) {
      loadAddresses();
    }
  }, [loginInfo]);

  return (
    <div className="address-container">
      <h2 className="address-title">배송지 관리</h2>

      <button className="btn-add" onClick={handleAddAddress}>
        배송지 추가
      </button>

      <ul className="address-list">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <li
              key={addr.seq}
              className={`address-item ${addr.default_yn === 'Y' ? 'default' : ''}`}
            >
              <div className="address-left">
                <input
                  type="checkbox"
                  checked={selectedSeq === addr.seq}
                  onChange={() => setSelectedSeq(addr.seq)}
                />

                <div>
                  {/* ✅ 기본배송지 문구 표시 */}
                  {addr.default_yn === 'Y' && (
                    <span className="default-badge">기본배송지</span>
                  )}

                  {/* 주소 정보 출력 */}
                  <p>주소명: {addressClassMap[addr.addr_class] || addr.addr_class}</p>
                  <p>[{addr.zip}] {addr.address1} {addr.address2}</p>
                  <p>{addr.rcv_nm} / {addr.rcv_phone}</p>
                </div>
              </div>

              <div className="address-buttons">
                <button onClick={() => handleModify(addr)} className="btn-modify">수정</button>
                <button onClick={() => handleDelete(addr.seq)} className="btn-delete">삭제</button>
              </div>
            </li>
          ))
        ) : (
          <li>등록된 주소가 없습니다.</li>
        )}
      </ul>

      <button className="btn-default" onClick={handleSetDefault}>
        선택된 주소를 기본배송지로 설정
      </button>
    </div>
  );
}

export default UserAddress;
