import "../../styles/Statistics.css"; // CSS 파일 import

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


import React, { useEffect, useRef, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const StatisticsProd = () => {
    const chartRef = useRef(null);

    const [searchType, setSearchType] = useState("Y"); // Default search type
    const [date, setDate] = useState(new Date()); // 초기값: 현재 날짜


    useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
            type: 'doughnut',
            data: {

            datasets: [{
                label: 'My First Dataset',
                data: [300, 150, 100, 80, 10],
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(158, 118, 24)', 'rgb(79, 139, 97)', 'rgb(50, 31, 94)'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
        }

    });
    }, []);

    const changeSearchCategory = (type) => {
        setSearchType(type);
        
    }


    return (
            <div>
                <div className="statistics-title">
                    상품판매 정보
                </div>

                <hr className="statistics-hr"></hr>

                <div style={{width:'30%'}}>
                <select className="search-condition"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    // onChange={(e) => changeSearchCategory(e.target.value)}
                >
                    <option value="Y">년</option>
                    <option value="M">월</option>
                    <option value="D">일</option>
                </select>

                {/* 조건부 렌더링: 선택된 검색 타입에 따라 입력 필드 표시 */}
                <Calendar
                onChange={setDate}
                value={date}
                minDetail={searchType === "Y" ? "decade" : searchType === "M" ? "year" : "month"}
                maxDetail={searchType === "Y" ? "year" : searchType === "M" ? "month" : "day"}
                />



                </div>


                <div style={{height: '450px', width: '100%', align: 'center', margin: '0 auto'}}>
                    <canvas ref={chartRef} width="400" height="400"/>
                </div>
                
            </div>
    );
};

export default StatisticsProd;
