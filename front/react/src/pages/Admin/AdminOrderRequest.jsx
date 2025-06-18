import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 추가
import '../../styles/AdminCustList.css';

const AdminCancelRefund = () => {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const navigate = useNavigate(); // 추가

  const [cancelReq, setCancelReq] = useState([]);
  const [refundReq, setRefundReq] = useState([]);

  /* ───── 최초 마운트 시: 관리자 체크 + 데이터 불러오기 ───── */
  useEffect(() => {
    axios.get(`${API}/api/cust/admincheck`, { withCredentials: true })
         .then(() => fetchData())  // 인증 성공 시 fetchData 실행
         .catch(() => {
           navigate('/', { replace: true }); // 인증 실패 시 홈으로 리다이렉트
         });
  }, [navigate]);

  /* ───── 목록 가져오기 ───── */
  const fetchData = () => {
    axios.get(`${API}/api/Admin/List`)
         .then(res => {
           setCancelReq(res.data.filter(o => o.ord_st == 3));
           setRefundReq(res.data.filter(o => o.ord_st == 4));
         })
         .catch(console.error);
  };

  /* ───── 승인 처리 ───── */
  const approve = (order) => {
    const nextStatus = order.ord_st == 3 ? 5 : 6;

    if (order.ord_st == 3) {
      setCancelReq(prev => prev.filter(o => o.ord_no !== order.ord_no));
    } else {
      setRefundReq(prev => prev.filter(o => o.ord_no !== order.ord_no));
    }

    axios.put(`${API}/api/order/${order.ord_no}/${nextStatus}`)
         .then(() => alert('승인이 완료되었습니다.'))
         .catch(err => {
           alert('승인이 실패했습니다. 다시 시도해 주세요.');
           console.error(err);
           if (order.ord_st == 3) setCancelReq(prev => [...prev, order]);
           else                   setRefundReq(prev => [...prev, order]);
         });
  };

  const fmt = dt => new Date(dt).toLocaleString('ko-KR');

  return (
    <div className="admin-cust-list">
      <h2>주문 취소 요청</h2>
      {cancelReq.length === 0 ? <p>취소 요청이 없습니다.</p> : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th><th>고객 ID</th><th>상품명</th>
              <th>결제 금액</th><th>결제 일시</th>
              <th>보낸이</th><th>수령인</th><th>승인</th>
            </tr>
          </thead>
          <tbody>
            {cancelReq.map(o => (
              <tr key={o.ord_no}>
                <td>{o.ord_no}</td>
                <td>{o.cust_id}</td>
                <td>{o.product_summary}</td>
                <td>{o.tot_amount.toLocaleString()}원</td>
                <td>{fmt(o.ord_dtm)}</td>
                <td>{o.cust_nm}</td>
                <td>{o.rcv_nm}</td>
                <td><button onClick={() => approve(o)}>취소 승인</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2>반품 요청</h2>
      {refundReq.length === 0 ? <p>반품 요청이 없습니다.</p> : (
        <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th>주문 번호</th><th>고객 ID</th><th>상품명</th>
              <th>결제 금액</th><th>결제 일시</th>
              <th>보낸이</th><th>수령인</th><th>승인</th>
            </tr>
          </thead>
          <tbody>
            {refundReq.map(o => (
              <tr key={o.ord_no}>
                <td>{o.ord_no}</td>
                <td>{o.cust_id}</td>
                <td>{o.product_summary}</td>
                <td>{o.tot_amount.toLocaleString()}원</td>
                <td>{fmt(o.ord_dtm)}</td>
                <td>{o.cust_nm}</td>
                <td>{o.rcv_nm}</td>
                <td><button onClick={() => approve(o)}>반품 승인</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCancelRefund;
