import React, { useState, useEffect } from 'react';

import Staticstics from "./Statistics"
import StaticsticsProd from "./StatisticsProd"

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { name: '매출정보', content: <Staticstics /> }, // Statistics 컴포넌트 추가
        { name: '상품판매정보', content: <StaticsticsProd /> },
        // { name: 'Tab 3', content: <div>세 번째 탭 내용</div> },
        // { name: 'Tab 4', content: <div>네 번째 탭 내용</div> },
    ];

    return (
        <div className='' style={{ width: '100%', height: '100%'}}>            
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
            <div style={{ width:'98%', padding: '20px', border: '1px solid #ddd' }}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabComponent;

