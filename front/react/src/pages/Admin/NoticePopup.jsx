import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Draggable from "react-draggable";
import "./NoticePopup.css";

const DAYS_TO_HIDE = 7;

export default function NoticePopup() {
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [notice, setNotice] = useState(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/notice/active`).then(({ data }) => {
      if (!data) return;

      const storageKey = `notice_closed_${data.notice_no}`;
      const closedAt = localStorage.getItem(storageKey);
      const hiddenMs = DAYS_TO_HIDE * 24 * 60 * 60 * 1000;
      const recentlyClosed = closedAt && Date.now() - Number(closedAt) < hiddenMs;

      if (!recentlyClosed) setNotice(data);
    });
  }, []);

  const handleClose = () => {
    if (notice) {
      localStorage.setItem(
        `notice_closed_${notice.notice_no}`,
        Date.now().toString()
      );
    }
    setNotice(null);
  };

  if (!notice) return null;

  const popup = (
    <Draggable nodeRef={nodeRef} handle=".popup-wrapper">
      <div ref={nodeRef} className="popup-wrapper">
        <img src={`/${notice.img_path}`} alt="공지" />
        <button className="btn-close" onClick={handleClose}>
          닫기
        </button>
      </div>
    </Draggable>
  );

  return ReactDOM.createPortal(popup, document.body);
}