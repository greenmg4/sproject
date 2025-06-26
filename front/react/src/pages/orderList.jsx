import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminCustList.css';

const OrderList = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const [orders, setOrders] = useState([]);
  const [showAllReceived, setShowAllReceived] = useState(false);
  const [showAllCancelled, setShowAllCancelled] = useState(false);
  const [showAllReturned, setShowAllReturned] = useState(false);

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
  const Ord_st1 = orders.filter(order => order.ord_st === "1"); // 결제 내역
  const Ord_st2 = orders.filter(order => order.ord_st === "2"); // 수령 완료
  const Ord_st3 = orders.filter(order => order.ord_st === "3" || order.ord_st === "5"); // 주문 취소 or 주문 취소 승인
  const Ord_st4 = orders.filter(order => order.ord_st === "4" || order.ord_st === "6"); // 반품 or 반품 승인

  return (
    <div className="admin-cust-list">
      <h2>결제 내역</h2>
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
            {Ord_st1.slice(0, 3).map(order => (
              <tr key={order.ord_no}>
                <td>{order.ord_no}</td>
                <td>{order.product_summary}</td>
                <td>{order.tot_amount.toLocaleString()}원</td>
                <td>{formatDate(order.ord_dtm)}</td>
                <td>{order.cust_nm}</td>
                <td>{order.rcv_nm}</td>
                <td>
                  <button className="btn-green" onClick={() => handleConfirm(order.ord_no)}>수령 확인</button>
                </td>
                <td><button className="btn-green" onClick={() => handle3(order.ord_no)}>주문 취소</button></td>
                <td><button className="btn-green" onClick={() => handle4(order.ord_no)}>반품</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr />
      <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h2 style={{ margin: 0 }}>수령 완료 상품 목록</h2>
        <button className="btn-green"
          onClick={() => setShowAllReceived(!showAllReceived)}
          style={{ marginLeft: '10px', cursor: 'pointer'  }}>
          {showAllReceived ? '접기' : '더보기'}
        </button>
      </div>
      {Ord_st2.length === 0 ? (
        <p>수령 완료된 상품이 없습니다.</p>
      ) : (
        <>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
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
              {(showAllReceived ? Ord_st2 : Ord_st2.slice(0, 3)).map(order => (
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
          </>
          )}
      <hr />
      <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h2 style={{ margin: 0 }}>주문 취소 목록</h2>
        <button className="btn-green"
          onClick={() => setShowAllCancelled(!showAllCancelled)}
          style={{ marginLeft: '10px', cursor: 'pointer' }}>
          {showAllCancelled ? '접기' : '더보기'}
        </button>
      </div>
      {Ord_st3.length === 0 ? (
        <p>주문 취소된 상품이 없습니다.</p>
      ) : (
        <>
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
            {(showAllCancelled ? Ord_st3 : Ord_st3.slice(0, 3)).map(order => (
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
        </>
      )}

      <hr />

      <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h2 style={{ margin: 0 }}>반품 요청 목록</h2>
        <button className="btn-green"
          onClick={() => setShowAllReturned(!showAllReturned)}
          style={{ marginLeft: '10px', cursor: 'pointer' }}>
          {showAllReturned ? '접기' : '더보기'}
        </button>
      </div>
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
              {(showAllReturned ? Ord_st4 : Ord_st4.slice(0, 3)).map(order => (
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