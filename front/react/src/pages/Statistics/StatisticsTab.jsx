import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Staticstics from "./Statistics"
import StaticsticsProd from "./StatisticsProd"
import axios from 'axios';

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState(0);

    /* ---------- 관리자 체크 ---------- */
    const navigate = useNavigate();
    useEffect(() => {
        axios
        .get(`/api/cust/admincheck`, { withCredentials: true })
        .then(() => init())                              // 통과 시 데이터 로드
        .catch(() => {
            //alert('관리자 권한 없음');
            navigate('/', { replace: true });
            return;
        });

        function init() {
        ;
        }
    },[]);


    const tabs = [
        { name: '매출정보', content: <Staticstics /> }, // Statistics 컴포넌트 추가
        { name: '상품판매정보', content: <StaticsticsProd /> },
        // { name: 'Tab 3', content: <div>세 번째 탭 내용</div> },
        // { name: 'Tab 4', content: <div>네 번째 탭 내용</div> },
    ];

    return (
        <div className="statistics-background" style={{ width: '100%', height: '670px',  overflowX:'hidden', overflowY:'scroll'}}>            
            <div className='statistics-tab'>
                {tabs.map((tab, index) => (
                    <div
                    key={index}
                    onClick={() => setActiveTab(index)}
                    style={{
                        padding: '10px',
                        borderBottom: activeTab === index ? '2px solid `rgb(192, 34, 158)`' : 'none',
                        backgroundColor: activeTab === index ? `rgb(216, 231, 217)` : `rgb(255, 255, 255)`,
                        borderTopRightRadius: '15px',
                        borderTopLeftRadius: '15px',
                    }}
                    >
                        <b> {tab.name} </b>
                    </div>
                ))}
            </div>
            <div style={{ width:'98%', paddingLeft: '20px', paddingRight: '20px', border: '1px solid #ddd' }}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabComponent;

