import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const [cartDetail, setCartDetail] = useState([]);

  // sessionStorage에서 로그인 아이디 직접 가져오기
  const cust_id = sessionStorage.getItem("loginID");

  useEffect(() => {
    if (!cust_id) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    axios.post(`/cart/CartDetail`,{cust_id})
      .then(res => setCartDetail(res.data))
      .catch(err => console.error("장바구니 불러오기 실패", err));
  }, [cust_id]);

  if (!cust_id) {
    return <div>로그인 후 이용해 주세요.</div>;
  }

  // 총 가격 계산
  const totalPrice = cartDetail.reduce((sum, item) => sum + item.prod_price * item.cnt, 0);

  return (
    <div className="contents">
      <p className="pageTitle">🛒 장바구니 페이지</p>
      {cartDetail.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
      <>
        {cartDetail.map(item => (
          <div
            key={item.prod_no}
            className="cart-item"
            style={{                
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'}}
            >
            <img
              src={item.img_path}
              alt={item.prod_nm}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div>
              <h4>{item.prod_nm}</h4>
              <p>가격: {item.prod_price.toLocaleString()}원</p>
              <p>수량: {item.cnt}</p>
              <p>합계: {(item.prod_price * item.cnt).toLocaleString()}원</p>
            </div>
          </div>
        ))}

        {/* 총 가격 및 결제하기 버튼 */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #ddd',
          paddingTop: '10px',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
        <div>총 가격: {totalPrice.toLocaleString()}원</div>
          <button
            onClick={() => alert('결제하기 클릭!')}
            style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
              결제하기
          </button>
        </div>
      </>
    )}
   </div>
  );
}