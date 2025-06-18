import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminCustList.css';

const OrderList = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get(`${API_BASE_URL}/api/List`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('결제 내역 불러오기 실패:', err));
  };

  // 수령 확인 버튼 클릭 이벤트
  const handleConfirm = (ord_no) => {
    axios.put(`${API_BASE_URL}/api/order/${ord_no}/2`)
      .then(() => {
        alert('수령이 확인되었습니다.');
        fetchOrders(); // 상태 변경 후 목록 갱신
      })
      .catch(err => {
        console.error('수령 확인 실패:', err);
        alert('수령 확인에 실패했습니다.');
      });
  };

  // 주문취소 클릭 이벤트
  const handle3 = (ord_no) => {
    axios.put(`${API_BASE_URL}/api/order/${ord_no}/3`)
      .then(() => {
        alert('주문 취소 요청되었습니다.');
        fetchOrders(); // 상태 변경 후 목록 갱신
      })
      .catch(err => {
        console.error('수령 확인 실패:', err);
        alert('수령 확인에 실패했습니다.');
      });
  };

  // 반품 클릭 이벤트
  const handle4 = (ord_no) => {
    axios.put(`${API_BASE_URL}/api/order/${ord_no}/4`)
      .then(() => {
        alert('반품 요청되었습니다.');
        fetchOrders(); // 상태 변경 후 목록 갱신
      })
      .catch(err => {
        console.error('수령 확인 실패:', err);
        alert('수령 확인에 실패했습니다.');
      });
  };
  const Ord_st1 = orders.filter(order => order.ord_st === "1").slice(0, 3); // 결제 내역
  const Ord_st2 = orders.filter(order => order.ord_st === "2").slice(0, 3); // 수령 완료
  const Ord_st3 = orders.filter(order => order.ord_st === "3" || order.ord_st === "5").slice(0, 3); // 주문 취소 or 주문 취소 승인
  const Ord_st4 = orders.filter(order => order.ord_st === "4" || order.ord_st === "6").slice(0, 3); // 반품 or 반품 승인

  return (
    <div className="admin-cust-list">
      <h2>전체 결제 내역</h2>
      {Ord_st1.length === 0 ? (
        <p>결제 내역이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>결제 금액</th>
              <th>결제 일시</th>
              <th>보낸이</th>
              <th>수령인</th>
              <th>수령 여부</th>
              <th>주문 취소</th>
              <th>반품</th>
            </tr>
          </thead>
          <tbody>
            {Ord_st1.map(order => (
              <tr key={order.ord_no}>
                <td>{order.ord_no}</td>
                <td>{order.product_summary}</td>
                <td>{order.tot_amount.toLocaleString()}원</td>
                <td>{formatDate(order.ord_dtm)}</td>
                <td>{order.cust_nm}</td>
                <td>{order.rcv_nm}</td>
                <td>
                  <button onClick={() => handleConfirm(order.ord_no)}>수령 확인</button>
                </td>
                <td><button onClick={() => handle3(order.ord_no)}>주문 취소</button></td>
                <td><button onClick={() => handle4(order.ord_no)}>반품</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr />
      <h2 style={{ marginTop: '40px' }}>수령 완료 상품 목록</h2>
      {Ord_st2.length === 0 ? (
        <p>수령 완료된 상품이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>결제 금액</th>
              <th>결제 일시</th>
              <th>보낸이</th>
              <th>수령인</th>
            </tr>
          </thead>
          <tbody>
            {Ord_st2.map(order => (
              <tr key={order.ord_no}>
                <td>{order.ord_no}</td>
                <td>{order.product_summary}</td>
                <td>{order.tot_amount.toLocaleString()}원</td>
                <td>{formatDate(order.ord_dtm)}</td>
                <td>{order.cust_nm}</td>
                <td>{order.rcv_nm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr />
      <h2 style={{ marginTop: '40px' }}>주문 취소 목록</h2>
      {Ord_st3.length === 0 ? (
        <p>주문 취소된 상품이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>결제 금액</th>
              <th>결제 일시</th>
              <th>보낸이</th>
              <th>수령인</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {Ord_st3.map(order => (
              <tr key={order.ord_no}>
                <td>{order.ord_no}</td>
                <td>{order.product_summary}</td>
                <td>{order.tot_amount.toLocaleString()}원</td>
                <td>{formatDate(order.ord_dtm)}</td>
                <td>{order.cust_nm}</td>
                <td>{order.rcv_nm}</td>
                <td>
                  {order.ord_st == 3 ? '취소 진행중' : '취소 완료'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <h2 style={{ marginTop: '40px' }}>반품 요청 목록</h2>
      {Ord_st4.length === 0 ? (
        <p>반품 요청된 상품이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>결제 금액</th>
              <th>결제 일시</th>
              <th>보낸이</th>
              <th>수령인</th>
              <th>상태</th>
            </tr>
          </thead>
            <tbody>
              {Ord_st4.map(order => (
                <tr key={order.ord_no}>
                  <td>{order.ord_no}</td>
                  <td>{order.product_summary}</td>
                  <td>{order.tot_amount.toLocaleString()}원</td>
                  <td>{formatDate(order.ord_dtm)}</td>
                  <td>{order.cust_nm}</td>
                  <td>{order.rcv_nm}</td>
                  <td>
                    {order.ord_st == 4 ? '반품 진행중' : '반품 완료'}
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      )}
    </div>
    
  );
};

// 날짜 포맷 함수
const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return date.toLocaleString('ko-KR');
};

export default OrderList;