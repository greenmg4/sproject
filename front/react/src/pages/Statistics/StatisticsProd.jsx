import React, { useState, useEffect, useRef } from "react";
import { generateRGBArray } from "../../helpers/statistics.js";

import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function StatisticsProd() {
    const chartRef = useRef(null);

    const [searchType, setSearchType] = useState("Y"); // 기본값
    const [inputType, setInputType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [arrColorList, setArrColorList] = useState([]);

    const dateRef = useRef(null);

    useEffect(() => {
    updateTodayDate("Y"); // 초기값을 현재 연도로 설정
    }, []);

    
    // 선택된 값에 따라 input 타입 변경 및 날짜 업데이트
    const changeSearchCategory = (value) => {
        setSearchType(value);

        if (value === "Y") {
            setInputType("number");
            updateTodayDate("Y");
        } else if (value === "M") {
            setInputType("month");
            updateTodayDate("M");
        } else if (value === "D") {
            setInputType("date");
            updateTodayDate("D");
        } else {
            setInputType("");
            setSelectedDate("");
        }


        
    };

    // 현재 날짜를 가져와 형식에 맞게 설정하는 함수
    const updateTodayDate = (type) => {
    const today = new Date();
    if (type === "Y") {
        setSelectedDate(today.getFullYear()); // 연도만 설정
    } else if (type === "M") {
        setSelectedDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`); // 연도-월 설정
    } else if (type === "D") {
        setSelectedDate(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
        ); // 연도-월-일 설정
    }
    };

    

    useEffect(() => {
        const arrlist = generateRGBArray(5);

        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
                type: 'doughnut',
                data: {

                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 150, 100, 80, 10],
                    backgroundColor: arrlist,
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
        <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select className="search-condition" value={searchType} onChange={(e) => changeSearchCategory(e.target.value)}>
                <option value="Y">년</option>
                <option value="M">월</option>
                <option value="D">일</option>
            </select>

            <input type={inputType} value={selectedDate} ref={dateRef} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            <div style={{height: '450px', width: '100%', align: 'center', margin: '0 auto'}}>
                <canvas ref={chartRef} width="400" height="400"/>
            </div>
        </div>
    );
}

export default StatisticsProd;
