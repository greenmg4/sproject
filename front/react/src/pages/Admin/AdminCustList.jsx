import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminCustList.css';

export default function AdminCustList() {
  /* ---------- 상태 ---------- */
  const [users, setUsers]       = useState([]);
  const [editingId, setEditing] = useState(null);
  const [tempGrade, setTemp]    = useState('N');

  // 🔍 검색 상태
  const [keyword, setKeyword]   = useState('');
  const [searchType, setType]   = useState('id');   // id | name
  const [isSearching, setFlag]  = useState(false);  // 전체보기 토글용

  /* ---------- 상수 ---------- */
  const EDITABLE = ['N', 'S', 'G', 'V'];
  const GRADE_LABEL  = { A:'관리자', N:'일반회원', S:'실버회원', G:'골드회원', V:'VIP회원' };
  const STATUS_LABEL = { 1:'유효', 2:'탈퇴', 3:'정지' };
  const GENDER_LABEL = { 1:'남성', 2:'여성' };

  /* ---------- 최초 로드 ---------- */
  const fetchAll = () =>
    axios.get('/cust/list', { withCredentials:true })
         .then(res => { setUsers(res.data); setFlag(false); });

  useEffect(() => { fetchAll().catch(console.error); }, []);

  /* ---------- 검색 ---------- */
  const doSearch = e => {
    e.preventDefault();
    if (!keyword.trim()) { alert('검색어를 입력하세요'); return; }

    axios.get('/cust/search', {
      params:{ type:searchType, keyword },
      withCredentials:true,
    })
    .then(res => { setUsers(res.data); setFlag(true); })
    .catch(err => alert(err.response?.data || '검색 실패'));
  };

  /* ---------- 편집 & 액션 ---------- */
  const startEdit  = (id,g)=>{ setEditing(id); setTemp(g); };
  const cancelEdit = ()     => setEditing(null);

  const saveGrade = id => {
    axios.put('/cust/grade',{ cust_id:id, grade:tempGrade },{ withCredentials:true })
         .then(()=>{ setUsers(p=>p.map(u=>u.cust_id===id?{...u,grade:tempGrade}:u)); cancelEdit(); })
         .catch(err=>alert(err.response?.data||'등급 변경 실패'));
  };

  const suspend = id => {
    if(!window.confirm('해당 회원을 정지시키겠습니까?')) return;
    axios.put('/cust/suspend',{cust_id:id},{withCredentials:true})
         .then(()=>setUsers(p=>p.map(u=>u.cust_id===id?{...u,status:3}:u)))
         .catch(err=>alert(err.response?.data||'정지 실패'));
  };

  const unsuspend = id => {
    if(!window.confirm('해당 회원의 정지를 해제시키겠습니까?')) return;
    axios.put('/cust/unsuspend',{cust_id:id},{withCredentials:true})
         .then(()=>setUsers(p=>p.map(u=>u.cust_id===id?{...u,status:1}:u)))
         .catch(err=>alert(err.response?.data||'해제 실패'));
  };

  /* ---------- 렌더 ---------- */
  return ( 
    <div className="admin-cust-list">
      <h2>회원 목록</h2>

      {/* 🔍 검색 폼 */}
      <form onSubmit={doSearch} style={{ marginBottom:'10px' }}>
        <select value={searchType} onChange={e=>setType(e.target.value)}>
          <option value="id">ID</option>
          <option value="name">이름</option>
        </select>
        &nbsp;
        <input
          value={keyword}
          onChange={e=>setKeyword(e.target.value)}
          placeholder="검색어 입력"
        />
        &nbsp;
        <button type="submit">검색</button>
        {isSearching && (
          <>
            &nbsp;
            <button type="button" onClick={fetchAll}>전체보기</button>
          </>
        )}
      </form>

      <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>이름</th><th>전화</th><th>이메일</th>
            <th>주소</th><th>상세주소</th><th>우편</th>
            <th>성별</th><th>생일</th>
            <th>상태</th><th>등급</th><th>액션</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>{
            const editing   = editingId===u.cust_id;
            const suspended = u.status===3;
            const admin     = u.grade==='A';
            return (
              <tr key={u.cust_id}>
                <td>{u.cust_id}</td>
                <td>{u.cust_nm}</td>
                <td>{u.phone}</td>
                <td>{u.email}</td>
                <td>{u.address1}</td>
                <td>{u.address2}</td>
                <td>{u.zip}</td>
                <td>{GENDER_LABEL[u.gender]||'-'}</td>
                <td>{u.birthday}</td>
                <td>{STATUS_LABEL[u.status]}</td>
                <td>
                  {admin||suspended ? (
                    GRADE_LABEL[u.grade]
                  ) : editing ? (
                    <>
                      <select value={tempGrade} onChange={e=>setTemp(e.target.value)}>
                        {EDITABLE.map(g=><option key={g} value={g}>{GRADE_LABEL[g]}</option>)}
                      </select>
                      &nbsp;<button onClick={()=>saveGrade(u.cust_id)}>저장</button>
                      &nbsp;<button onClick={cancelEdit}>취소</button>
                    </>
                  ) : (
                    <>
                      {GRADE_LABEL[u.grade]}
                      &nbsp;<button onClick={()=>startEdit(u.cust_id,u.grade)}>변경</button>
                    </>
                  )}
                </td>
                <td>
                  {admin ? '-' : suspended ? (
                    <button onClick={()=>unsuspend(u.cust_id)}>정지해제</button>
                  ) : (
                    <button onClick={()=>suspend(u.cust_id)}>회원정지</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
