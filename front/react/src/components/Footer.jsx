import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="footer_cover">
            <div className="footer_customer">
                <hr></hr>
                <span>상호: <strong>여백서점</strong> | 주소: 서울강남구 학동로82길 24</span><br />
                <span>이메일: 
                <Link
                        to="mailto:marginbookstore@naver.com"
                        title="스팸성 메일 차단"
                    >marginbookstore@naver.com </Link>
                    | 사업자등록번호: 222-22-22222</span><br />
                <span>고객센터 : </span>
                <strong>02-222-2222 , 09:00 - 22:00</strong>
            </div>
        </div>
    );
}

export default Footer;
