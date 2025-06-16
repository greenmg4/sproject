import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  // 서버에서 결제 내역 불러오기
  useEffect(() => {
    axios.get('/orderList')  // 백엔드에서 이 API 만들어야 함
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('결제 내역 불러오기 실패:', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧾 결제 내역</h2>
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
              <th>결제 상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.productName}</td>
                <td>{order.amount.toLocaleString()}원</td>
                <td>{order.paidAt}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;