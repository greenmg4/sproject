import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const [cartDetail, setCartDetail] = useState([]);

  const cust_id = sessionStorage.getItem("loginID");

  useEffect(() => {
    if (!cust_id) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    axios.post(`/cart/CartDetail`, { cust_id })
      .then(res => setCartDetail(res.data))
      .catch(err => console.error("장바구니 불러오기 실패", err));
  }, [cust_id]);

  if (!cust_id) {
    return <div>로그인 후 이용해 주세요.</div>;
  }

  const totalPrice = cartDetail.reduce((sum, item) => sum + item.prod_price * item.cnt, 0);

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init("imp06723305");

    IMP.request_pay({
      pg: "kakaopay.TC0ONETIME",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      name: cartDetail.length === 1
        ? cartDetail[0].prod_nm
        : `장바구니 상품 ${cartDetail.length}건`,
      amount: totalPrice,
      buyer_email: "testuser01@example.com",
      buyer_name: "홍길동",
      buyer_tel: "010-1234-5678",
      buyer_addr: "서울특별시 강남구 테헤란로 123 301호",
      buyer_postcode: "06134",
    }, function (rsp) {
      if (rsp.success) {
        fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imp_uid: rsp.imp_uid }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "paid") {
              alert("결제 성공!");

              fetch("/api/order/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  cust_id: cust_id,
                  pay_method: rsp.pay_method,
                  ord_dtm: new Date().toISOString(),
                  amount: totalPrice,
                  buyer_name: rsp.buyer_name,
                  buyer_tel: rsp.buyer_tel,
                  buyer_addr: rsp.buyer_addr,
                  buyer_postcode: rsp.buyer_postcode,
                  order_items: cartDetail.map(item => ({
                    prod_no: item.prod_no,
                    prod_price: item.prod_price,
                    cnt: item.cnt
                  }))
                })
              })
                .then(res => res.json())
                .then(orderSaveResult => {
                  if (orderSaveResult.success) {
                    alert("주문이 정상적으로 저장되었습니다.");
                    // window.location.href = "/order/complete";
                  } else {
                    alert("주문 저장 실패: " + orderSaveResult.message);
                  }
                });
            } else {
              alert("결제 검증 실패");
            }
          });
      } else {
        alert("결제 실패: " + rsp.error_msg);
      }
    }); // <-- IMP.request_pay의 닫힘
  }; // <-- onClickPayment 함수 닫힘

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
                gap: '20px'
              }}
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
              onClick={onClickPayment}
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