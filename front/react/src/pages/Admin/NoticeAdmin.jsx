import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./NoticeAdmin.css";

export default function NoticeAdmin() {
  /* ── 상태 ────────────────────────────── */
  const [list, setList] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [cls, setCls] = useState("02"); // 01:이벤트, 02:안내
  const fileRef = useRef(null);

  /* ── 환경 ────────────────────────────── */
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8080";

  /* ── 데이터 페치 ─────────────────────── */
  const fetchList = () =>
    axios.get(`${API_BASE_URL}/api/notice`).then((r) => setList(r.data));

  useEffect(() => {
    fetchList();
  }, []);

  /* ── 업로드 ─────────────────────────── */
  const onUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("이미지 파일을 선택하세요.");
      return;
    }
    const fd = new FormData();
    fd.append("file", uploadFile);
    fd.append("notiClass", cls);
    await axios.post(`${API_BASE_URL}/api/notice/upload`, fd, {
      withCredentials: true,
    });
    setUploadFile(null);
    if (fileRef.current) fileRef.current.value = "";
    fetchList();
  };

  /* ── 노출 토글 ──────────────────────── */
  const toggleYn = (id, yn) =>
    axios
      .patch(`${API_BASE_URL}/api/notice/${id}?yn=${yn}`, null, {
        withCredentials: true,
      })
      .then(fetchList);

  /* ── 삭제 ───────────────────────────── */
  const del = (id) =>
    window.confirm("정말 삭제하시겠습니까?") &&
    axios.delete(`${API_BASE_URL}/api/notice/${id}`).then(fetchList);

  /* ── 렌더 ───────────────────────────── */
  return (
    <div className="notice-admin">
      <h2>공지 이미지 관리</h2>

      {/* 업로드 폼 */}
      <form className="upload-form" onSubmit={onUpload}>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setUploadFile(e.target.files[0])}
        />
        <select value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="01">이벤트</option>
          <option value="02">안내</option>
        </select>
        <button type="submit" className="notice-btn-upload">
          업로드
        </button>
      </form>

      {/* 이미지 그리드 */}
      <div className="notice-grid">
        {list.map((n) => (
          <div key={n.notice_no} className="notice-card">
            <img src={`/${n.img_path}`} alt="notice" />
            <div className="notice-card-body">
              <div className="notice-meta">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.noti_yn === "Y"}
                    onChange={(e) =>
                      toggleYn(n.notice_no, e.target.checked ? "Y" : "N")
                    }
                  />
                  <span className="slider"></span>
                </label>

                <button className="notice-btn-delete" onClick={() => del(n.notice_no)}>
                  삭제
                </button>
              </div>
              <span className="notice-class">
                {n.noti_class === "01" ? "🎉 이벤트 공지" : "📢 안내 공지"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}