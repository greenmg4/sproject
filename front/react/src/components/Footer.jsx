import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // 추가

function Footer() {
  return (
    <div className="footer_cover">
      <div className="footer_content">
        <img
          src="/images/homeImages/main_logo.png"
          alt="여백서점 로고"
          className="footer_logo"
        />
        <div className="footer_text">
          <span>
            상호: <strong>여백서점</strong> | 주소: 서울 강남구 학동로82길 24
          </span>
          <span>
            이메일:&nbsp;
            <Link to="mailto:marginbookstore@naver.com" title="스팸성 메일 차단">
              marginbookstore@naver.com
            </Link>
            &nbsp;| 사업자등록번호: 222-22-22222
          </span>
          <span>고객센터: <strong>02-222-2222 , 09:00 - 22:00</strong></span>
          <span>운영시간 외에는 이메일 또는 1:1 문의 게시판을 이용해주세요.</span>
          <br />
          <span>Copyright © 2025 여백서점. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
