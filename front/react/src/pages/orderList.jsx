import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/List') 
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('결제 내역 불러오기 실패:', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>결제 내역</h2>
      {orders.length === 0 ? (
        <p>결제 내역이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
            {orders.map((order) => (
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
    </div>
  );
};

// 날짜 포맷 함수
const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return date.toLocaleString('ko-KR');
};

export default OrderList;