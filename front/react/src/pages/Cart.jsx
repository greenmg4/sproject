import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartDetail, setCartDetail] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const cust_id = sessionStorage.getItem("loginID");
  const navigate = useNavigate();

  useEffect(() => {
    if (!cust_id) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    fetchCartDetail();
  }, [cust_id]);

  // 장바구니 상세 불러오기
  const fetchCartDetail = () => {
    axios.post(`/cart/CartDetail`, { cust_id })
      .then(res => setCartDetail(res.data))
      .catch(err => console.error("장바구니 불러오기 실패", err));
  };

  // 수량 변경 함수 (소문자 함수명으로 통일)
  const updateCnt = (prod_no, newCnt) => {
    if (newCnt < 1) return;
    axios.post("/cart/updateCnt", {
      cust_id,
      prod_no,
      cnt: newCnt
    }).then(() => fetchCartDetail());
  };

  // 선택 삭제 함수
  const DeletePro = () => {
    if (selectedItems.length === 0) return;
    axios.post("/cart/deletePro", {
      cust_id,
      prod_no: selectedItems
    }).then(() => {
      setSelectedItems([]);
      fetchCartDetail();
    });
  };

  if (!cust_id) return <div>로그인 후 이용해 주세요.</div>;

  // 선택된 상품만 필터링
  const selectedCartItems = cartDetail.filter(item =>
    selectedItems.includes(item.prod_no)
  );

  // 총 금액 계산
  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.prod_price * item.cnt, 0
  );

  // 선택된 상품 수량 합계 계산
  const totalCount = selectedCartItems.reduce((sum, item) => sum + item.cnt, 0);

  const isAllSelected = cartDetail.length > 0 && selectedItems.length === cartDetail.length;

  // 전체 선택 / 해제
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartDetail.map(item => item.prod_no));
    }
  };

  // 개별 선택 / 해제
  const toggleSelectOne = (prod_no) => {
    setSelectedItems(prev =>
      prev.includes(prod_no) ? prev.filter(id => id !== prod_no) : [...prev, prod_no]
    );
  };


  return (
    <div className="contents">
      <p className="pageTitle">장바구니 페이지</p>

      {cartDetail.length === 0 ? (
        <div style={{
          borderTop: '1px solid #ddd',
          paddingTop: '10px',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>장바구니가 비어있습니다.</div>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
            둘러보기
          </button>
        </div>
      ) : (
        <>
          {/* 전체 선택 */}
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              /> 전체 선택
            </label>
          </div>

          {/* 장바구니 상품 목록 */}
          {cartDetail.map(item => (
            <div
              key={item.prod_no}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.prod_no)}
                onChange={() => toggleSelectOne(item.prod_no)}
              />
              <img
                src={item.img_path || '/images/recommendation/default-product.png'}
                alt={item.prod_nm}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h4>{item.prod_nm}</h4>
                <p>가격: {item.prod_price.toLocaleString()}원</p>
                <div>
                  수량:
                  <button onClick={() => updateCnt(item.prod_no, item.cnt - 1)}>-</button>
                  <span style={{ margin: '0 10px' }}>{item.cnt}</span>
                  <button onClick={() => updateCnt(item.prod_no, item.cnt + 1)}>+</button>
                </div>
                <p>합계: {(item.prod_price * item.cnt).toLocaleString()}원</p>
              </div>
            </div>
          ))}

          {/* 총액 및 버튼 영역 */}
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
            <div>
              선택 상품 총 가격: {totalPrice.toLocaleString()}원<br />
              선택 상품 총 수량: {totalCount}개
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() =>
                  navigate("/order/payment", {
                    state: {
                      selectedCartItems,
                      totalPrice,
                      totalCount,
                      cust_id
                    }
                  })
                }
                disabled={selectedItems.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: selectedItems.length === 0 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                }}>
                선택 결제
              </button>

              <button
                onClick={DeletePro}
                disabled={selectedItems.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                }}>
                선택 삭제
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                둘러보기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}