import "../../styles/Statistics.css"; // CSS 파일 import

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


import React, { useEffect, useRef, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const StatisticsProd = () => {
    const chartRef = useRef(null);

    const [searchType, setSearchType] = useState("C"); // Default search type
    const [date, setDate] = useState(new Date()); // 초기값: 현재 날짜
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const changeSearchCategory = (type) => {
        setSearchType(type);
        setDate(new Date()); // 선택 변경 시 초기화
        setIsCalendarVisible(true); // 선택했을 때만 달력이 보이도록 설정
    };

    const handleDateChange = (selectedDate) => {
        alert("날짜가 선택되었습니다.");

        let formattedDate = "";

        // searchType에 따라 다른 형식으로 날짜를 표시
        if (searchType === "Y") {
            formattedDate = selectedDate.getFullYear(); // 년도만 표시
        } else if (searchType === "M") {
            formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`; // 년-월 표시
        } else if (searchType === "D") {
            formattedDate = selectedDate.toLocaleDateString(); // 전체 날짜 표시
        }

        alert(`선택한 날짜: ${formattedDate}`);
        setDate(selectedDate);
        setIsCalendarVisible(false); // 날짜 선택 후 달력 숨기기

    };





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


    
    return (
        <div style={{ position: "relative" }}>
            <div className="statistics-title">상품판매 정보</div>
            <hr className="statistics-hr" />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select 
                    className="search-condition"
                    value={searchType}
                    onChange={(e) => changeSearchCategory(e.target.value)}
                >
                    <option value="">선택</option>
                    <option value="Y">년</option>
                    <option value="M">월</option>
                    <option value="D">일</option>
                </select>
            </div>

            {isCalendarVisible && (
                <div style={{
                    position: "absolute",
                    top: "50px",
                    left: "10px",
                    background: "white",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    padding: "10px",
                    borderRadius: "8px"
                }}>
                    <Calendar 
                        value={date} 
                        onChange={handleDateChange} 
                        // view={searchType === "Y" ? "decade" : searchType === "M" ? "year" : "month"}
                        view={searchType === "Y" ? "decade" : searchType === "M" ? "year" : searchType === "D" ? "month" : "month"}
                    />
                </div>
            )}



                <div style={{height: '450px', width: '100%', align: 'center', margin: '0 auto'}}>
                    <canvas ref={chartRef} width="400" height="400"/>
                </div>
                
            </div>
    );
};

export default StatisticsProd;
